/**
 * WebSocket Close Code Sanitizer for RFC 6455 Compliance
 * 
 * Ensures all WebSocket close codes fall within the valid range (1000-4999)
 * and converts invalid codes to appropriate RFC 6455 compliant codes.
 * 
 * This prevents comic character IDs and other invalid data from being
 * used as WebSocket close codes, which crashes Vite's HMR system.
 */

// RFC 6455 Standard Close Codes
export const WebSocketCloseCodes = {
  NORMAL_CLOSURE: 1000,
  GOING_AWAY: 1001,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED_DATA: 1003,
  NO_STATUS_RECEIVED: 1005,
  ABNORMAL_CLOSURE: 1006,
  INVALID_FRAME_PAYLOAD_DATA: 1007,
  POLICY_VIOLATION: 1008,
  MESSAGE_TOO_BIG: 1009,
  MANDATORY_EXTENSION: 1010,
  INTERNAL_SERVER_ERROR: 1011,
  SERVICE_RESTART: 1012,
  TRY_AGAIN_LATER: 1013,
  BAD_GATEWAY: 1014,
  TLS_HANDSHAKE: 1015,
} as const;

export type ValidCloseCode = typeof WebSocketCloseCodes[keyof typeof WebSocketCloseCodes] | number;

/**
 * Sanitizes a WebSocket close code to ensure RFC 6455 compliance
 * 
 * @param code - The close code to sanitize (could be character ID, invalid number, etc.)
 * @param reason - Optional reason for closing (used for error mapping)
 * @returns Tuple of [sanitizedCode, sanitizedReason]
 */
export function sanitizeWebSocketCloseCode(
  code: any, 
  reason?: string
): [number, string] {
  // Convert to number if possible
  const numericCode = typeof code === 'number' ? code : parseInt(String(code), 10);
  
  // Check if the code is valid (1000-4999 range per RFC 6455)
  if (isValidWebSocketCloseCode(numericCode)) {
    return [numericCode, reason || 'Connection closed'];
  }
  
  // Log the invalid code for debugging
  console.warn(`🚨 Invalid WebSocket close code detected: ${code} (${typeof code}). Sanitizing...`);
  
  // Map invalid codes to appropriate RFC 6455 codes based on context
  let sanitizedCode: number;
  let sanitizedReason: string;
  
  // If the original code looks like a character/asset ID (large number)
  if (numericCode > 10000) {
    sanitizedCode = WebSocketCloseCodes.NORMAL_CLOSURE;
    sanitizedReason = `Normal closure (sanitized from ID: ${code})`;
  }
  // If code suggests an error condition
  else if (reason && (reason.includes('error') || reason.includes('Error'))) {
    sanitizedCode = WebSocketCloseCodes.INTERNAL_SERVER_ERROR;
    sanitizedReason = 'Internal server error';
  }
  // If code suggests server shutdown
  else if (reason && (reason.includes('shutdown') || reason.includes('restart'))) {
    sanitizedCode = WebSocketCloseCodes.GOING_AWAY;
    sanitizedReason = 'Server going away';
  }
  // If code suggests authentication issues
  else if (reason && (reason.includes('auth') || reason.includes('unauthorized'))) {
    sanitizedCode = WebSocketCloseCodes.POLICY_VIOLATION;
    sanitizedReason = 'Authentication required';
  }
  // Default to normal closure for any other invalid codes
  else {
    sanitizedCode = WebSocketCloseCodes.NORMAL_CLOSURE;
    sanitizedReason = reason || `Normal closure (sanitized from: ${code})`;
  }
  
  console.log(`✅ Sanitized WebSocket close code: ${code} -> ${sanitizedCode} (${sanitizedReason})`);
  
  return [sanitizedCode, sanitizedReason];
}

/**
 * Checks if a WebSocket close code is valid per RFC 6455
 * 
 * @param code - The close code to validate
 * @returns true if the code is valid, false otherwise
 */
export function isValidWebSocketCloseCode(code: number): boolean {
  // Must be a number
  if (typeof code !== 'number' || isNaN(code)) {
    return false;
  }
  
  // RFC 6455 valid ranges:
  // 1000-2999: Reserved for use by the protocol itself
  // 3000-3999: Available for use by libraries, frameworks, and applications
  // 4000-4999: Available for use by applications
  return (code >= 1000 && code <= 4999);
}

/**
 * Creates a sanitized WebSocket close function that automatically
 * sanitizes close codes before calling the original close method
 * 
 * @param originalClose - The original WebSocket close function
 * @returns Sanitized close function
 */
export function createSanitizedCloseFunction(
  originalClose: (code?: number, reason?: string) => void
) {
  return function sanitizedClose(code?: any, reason?: string): void {
    if (code !== undefined) {
      const [sanitizedCode, sanitizedReason] = sanitizeWebSocketCloseCode(code, reason);
      return originalClose.call(this, sanitizedCode, sanitizedReason);
    } else {
      // No code provided, use normal closure
      return originalClose.call(this, WebSocketCloseCodes.NORMAL_CLOSURE, reason || 'Normal closure');
    }
  };
}

/**
 * Patches a WebSocket instance to use sanitized close codes
 * 
 * @param ws - The WebSocket instance to patch
 */
export function patchWebSocketWithSanitization(ws: any): void {
  if (ws && typeof ws.close === 'function') {
    const originalClose = ws.close.bind(ws);
    ws.close = createSanitizedCloseFunction(originalClose);
  }
}

/**
 * Aggressive character ID detection patterns
 */
const CHARACTER_ID_PATTERNS = [
  /^\d{5,}$/,           // 5+ digit numbers (25936, 59462, 65474, etc.)
  /^[0-9]{4,6}$/,       // 4-6 digit patterns common in comic character IDs
  /^\d+$/               // Any pure numeric string that might be misinterpreted
];

/**
 * Checks if a value could be a problematic character ID
 */
function isPotentialCharacterId(value: any): boolean {
  if (typeof value === 'number') {
    // Numbers over 1000 could be character IDs
    return value > 1000 && value < 100000;
  }
  
  if (typeof value === 'string') {
    // Check against known patterns
    return CHARACTER_ID_PATTERNS.some(pattern => pattern.test(value));
  }
  
  return false;
}

/**
 * Sanitizes WebSocket message data to prevent character IDs from being misinterpreted
 * as close codes or causing protocol violations
 * 
 * NOTE: Data sanitization is DISABLED by default as it was causing issues with numeric values
 * like volume, price, etc. being incorrectly converted to strings. WebSocket close code 
 * sanitization is sufficient to prevent protocol violations.
 * 
 * @param data - The data object to sanitize
 * @returns The data object unchanged (sanitization disabled)
 */
export function sanitizeWebSocketData(data: any): any {
  // DISABLED: Data sanitization was overly aggressive and corrupting valid numeric data
  // WebSocket close code sanitization (via patchWebSocketWithSanitization) is sufficient
  return data;
}

/**
 * Safely sends WebSocket data with sanitization to prevent protocol violations
 * 
 * @param ws - WebSocket instance
 * @param data - Data to send (will be sanitized)
 */
export function safeWebSocketSend(ws: any, data: any): void {
  if (!ws || typeof ws.send !== 'function') {
    console.warn('Invalid WebSocket instance provided to safeWebSocketSend');
    return;
  }
  
  try {
    const sanitizedData = sanitizeWebSocketData(data);
    const message = typeof sanitizedData === 'string' ? sanitizedData : JSON.stringify(sanitizedData);
    ws.send(message);
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
  }
}

/**
 * Utility to safely close a WebSocket with sanitized codes
 * 
 * @param ws - WebSocket instance
 * @param code - Close code (will be sanitized)
 * @param reason - Close reason
 */
export function safeWebSocketClose(ws: any, code?: any, reason?: string): void {
  if (!ws || typeof ws.close !== 'function') {
    console.warn('Invalid WebSocket instance provided to safeWebSocketClose');
    return;
  }
  
  const [sanitizedCode, sanitizedReason] = sanitizeWebSocketCloseCode(
    code || WebSocketCloseCodes.NORMAL_CLOSURE, 
    reason
  );
  
  try {
    ws.close(sanitizedCode, sanitizedReason);
  } catch (error) {
    console.error('Error closing WebSocket:', error);
    // Fallback to normal closure
    try {
      ws.close(WebSocketCloseCodes.NORMAL_CLOSURE, 'Fallback closure');
    } catch (fallbackError) {
      console.error('Error in fallback WebSocket close:', fallbackError);
    }
  }
}
/**
 * EMERGENCY FIX: Prevent Character IDs from Corrupting WebSocket Frames
 * 
 * This utility provides comprehensive protection against character IDs 
 * (like 11789, 30098, etc.) being interpreted as WebSocket close codes
 * by Vite's HMR system, which violates RFC 6455.
 */

import WebSocket from 'ws';

// Pattern to identify ALL character IDs (not just known ones)
// Character IDs are typically 4-6 digit numbers outside valid WebSocket range
function isCharacterIdCode(code: number): boolean {
  // Valid WebSocket close codes are strictly 1000-4999 per RFC 6455
  if (code >= 1000 && code <= 4999) {
    return false; // This is a valid WebSocket close code
  }
  
  // COMPREHENSIVE BLOCKING: Any numeric value outside valid WebSocket range
  // Block ANY number that could be a character/comic ID from CSV data
  if (code >= 5000 && code <= 999999) {
    console.warn(`🚨 [COMPREHENSIVE] Blocking potential character/comic ID: ${code}`);
    return true;
  }
  
  // Also block smaller numbers that could be character IDs (but preserve standard codes)
  if (code >= 100 && code <= 999) {
    console.warn(`🚨 [COMPREHENSIVE] Blocking potential small character ID: ${code}`);
    return true;
  }
  
  return false;
}

// Known problematic character IDs from CSV data (for logging purposes)
const KNOWN_CHARACTER_IDS = [
  11789, 30098, 111789, 34430, 101197, 102201, 32866, 9903, 34651, 2083, 47277, 48665
];

// NUCLEAR OPTION: Block ALL numeric codes that aren't standard WebSocket codes
function isStandardWebSocketCode(code: number): boolean {
  // Only allow these specific standard WebSocket close codes
  const allowedCodes = [1000, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011];
  return allowedCodes.includes(code);
}

/**
 * Emergency interceptor for all WebSocket close operations
 */
export function applyEmergencyWebSocketFix() {
  console.log('🚨 [EMERGENCY] Applying comprehensive WebSocket character ID fix...');
  
  // Override WebSocket close method globally
  const originalClose = WebSocket.prototype.close;
  
  WebSocket.prototype.close = function(code?: number, reason?: string | Buffer) {
    // Intercept any character IDs being used as close codes
    if (code && typeof code === 'number') {
      // NUCLEAR OPTION: Only allow standard WebSocket codes
      if (!isStandardWebSocketCode(code)) {
        console.error(`🚨 [NUCLEAR] Blocked non-standard code ${code} from WebSocket close!`);
        console.log(`🔧 [NUCLEAR] Using safe close code 1000 instead of ${code}`);
        return originalClose.call(this, 1000, reason);
      }
      
      // Fallback: Use the comprehensive character ID detection
      if (isCharacterIdCode(code)) {
        console.error(`🚨 [EMERGENCY] Blocked character ID ${code} from WebSocket close!`);
        console.log(`🔧 [EMERGENCY] Using safe close code 1000 instead of ${code}`);
        return originalClose.call(this, 1000, reason);
      }
      
      // Double-check with known character IDs list
      if (KNOWN_CHARACTER_IDS.includes(code)) {
        console.error(`🚨 [EMERGENCY] Blocked known character ID ${code} from WebSocket!`);
        return originalClose.call(this, 1000, reason);
      }
    }
    
    return originalClose.call(this, code, reason);
  };
  
  console.log('✅ [EMERGENCY] WebSocket character ID fix applied successfully');
}

/**
 * Sanitize any data object to remove numeric character IDs
 */
export function emergencyDataSanitizer(data: any): any {
  if (!data) return data;
  
  if (typeof data === 'number' && KNOWN_CHARACTER_IDS.includes(data)) {
    console.warn(`🛡️ [EMERGENCY] Sanitized character ID ${data} -> "char_${data}"`);
    return `char_${data}`;
  }
  
  if (typeof data === 'string' && /^\d{4,6}$/.test(data)) {
    const numValue = parseInt(data);
    if (isCharacterIdCode(numValue) || KNOWN_CHARACTER_IDS.includes(numValue)) {
      console.warn(`🛡️ [EMERGENCY] Sanitized string character ID "${data}" -> "char_${data}"`);
      return `char_${data}`;
    }
  }
  
  if (typeof data === 'object') {
    const sanitized = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      // Recursively sanitize nested data
      (sanitized as any)[key] = emergencyDataSanitizer(value);
    }
    
    return sanitized;
  }
  
  return data;
}

/**
 * Emergency middleware to sanitize all WebSocket messages
 */
export function sanitizeWebSocketMessage(message: any) {
  try {
    // If it's a string, try to parse as JSON
    let data = message;
    if (typeof message === 'string') {
      try {
        data = JSON.parse(message);
      } catch {
        // Not JSON, check if it's a character ID string
        if (/^\d{4,6}$/.test(message)) {
          const numValue = parseInt(message);
          if (KNOWN_CHARACTER_IDS.includes(numValue)) {
            console.warn(`🛡️ [EMERGENCY] Sanitized raw character ID message: "${message}"`);
            return JSON.stringify(`char_${message}`);
          }
        }
        return message;
      }
    }
    
    // Sanitize the data object
    const sanitizedData = emergencyDataSanitizer(data);
    
    return typeof message === 'string' ? JSON.stringify(sanitizedData) : sanitizedData;
  } catch (error) {
    console.error('Error in emergency WebSocket sanitizer:', error);
    return message;
  }
}
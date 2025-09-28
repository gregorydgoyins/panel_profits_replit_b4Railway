/**
 * ULTIMATE WebSocket Fix - Comprehensive Character ID Prevention
 * 
 * This fix prevents ANY character IDs from reaching Vite's WebSocket processing
 * by intercepting all WebSocket operations at the fundamental level.
 */

import WebSocket from 'ws';

// Comprehensive character ID pattern detection
function sanitizeAnyNumericData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle numeric values directly
  if (typeof data === 'number') {
    // If it's outside valid WebSocket close code range and could be a character ID
    if ((data >= 5000 && data <= 999999) || (data >= 100 && data <= 999)) {
      console.warn(`🛡️ [ULTIMATE] Sanitized numeric character ID: ${data} -> "char_${data}"`);
      return `char_${data}`;
    }
    return data;
  }
  
  // Handle string numbers
  if (typeof data === 'string') {
    // Check if it's a pure numeric string that could be a character ID
    if (/^\d{3,6}$/.test(data)) {
      const numValue = parseInt(data);
      if ((numValue >= 5000 && numValue <= 999999) || (numValue >= 100 && numValue <= 999)) {
        console.warn(`🛡️ [ULTIMATE] Sanitized string character ID: "${data}" -> "char_${data}"`);
        return `char_${data}`;
      }
    }
    return data;
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeAnyNumericData(item));
  }
  
  // Handle objects
  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Also sanitize object keys that might be character IDs
      const sanitizedKey = sanitizeAnyNumericData(key);
      sanitized[sanitizedKey] = sanitizeAnyNumericData(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Apply the ultimate WebSocket fix that intercepts ALL WebSocket operations
 */
export function applyUltimateWebSocketFix() {
  console.log('🚀 [ULTIMATE] Applying comprehensive WebSocket character ID prevention...');
  
  // Override WebSocket send method globally
  const originalSend = WebSocket.prototype.send;
  
  WebSocket.prototype.send = function(data: any, options?: any, cb?: any) {
    try {
      let sanitizedData = data;
      
      // Sanitize the data being sent
      if (typeof data === 'string') {
        try {
          // Try to parse as JSON and sanitize
          const parsed = JSON.parse(data);
          const sanitized = sanitizeAnyNumericData(parsed);
          sanitizedData = JSON.stringify(sanitized);
        } catch {
          // Not JSON, sanitize as string
          sanitizedData = sanitizeAnyNumericData(data);
        }
      } else if (Buffer.isBuffer(data)) {
        // Handle Buffer data
        try {
          const str = data.toString();
          const parsed = JSON.parse(str);
          const sanitized = sanitizeAnyNumericData(parsed);
          sanitizedData = Buffer.from(JSON.stringify(sanitized));
        } catch {
          // Keep as is if not JSON
          sanitizedData = data;
        }
      } else {
        // Sanitize other data types
        sanitizedData = sanitizeAnyNumericData(data);
        if (typeof sanitizedData !== 'string' && !Buffer.isBuffer(sanitizedData)) {
          sanitizedData = JSON.stringify(sanitizedData);
        }
      }
      
      return originalSend.call(this, sanitizedData, options, cb);
    } catch (error) {
      console.error('Error in ultimate WebSocket send sanitizer:', error);
      // Fallback to original send
      return originalSend.call(this, data, options, cb);
    }
  };
  
  // Override WebSocket close method to only allow safe codes
  const originalClose = WebSocket.prototype.close;
  
  WebSocket.prototype.close = function(code?: number, reason?: string | Buffer) {
    // Only allow these specific safe codes
    const safeCodes = [1000, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011];
    
    if (code !== undefined && !safeCodes.includes(code)) {
      console.warn(`🚀 [ULTIMATE] Blocked unsafe close code ${code}, using 1000 instead`);
      return originalClose.call(this, 1000, reason);
    }
    
    return originalClose.call(this, code, reason);
  };
  
  console.log('✅ [ULTIMATE] Comprehensive WebSocket character ID prevention applied successfully');
}

/**
 * Sanitize all outgoing WebSocket messages at the application level
 */
export function sanitizeWebSocketMessage(message: any): any {
  return sanitizeAnyNumericData(message);
}
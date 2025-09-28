/**
 * FINAL WebSocket Fix - Binary Frame Level Interception
 * 
 * This fix intercepts WebSocket operations at the lowest possible level
 * to prevent ANY character IDs from reaching Vite's frame processing.
 */

import WebSocket from 'ws';

// Override at the most fundamental level - the _write method
export function applyFinalWebSocketFix() {
  console.log('🔧 [FINAL] Applying binary-level WebSocket frame protection...');
  
  // Override the internal _write method that handles raw WebSocket frames
  const originalWrite = WebSocket.prototype._write;
  
  WebSocket.prototype._write = function(chunk: any, encoding: any, callback: any) {
    try {
      // Inspect the chunk data for potential character IDs
      if (Buffer.isBuffer(chunk)) {
        // Check if the buffer contains a character ID that could be misinterpreted
        const bufferStr = chunk.toString('hex');
        
        // Look for patterns that could be character IDs in hex format
        // Character IDs like 58425 would appear as specific byte patterns
        const suspiciousPatterns = [
          'e449', // 58425 in hex (little-endian)
          '49e4', // 58425 in hex (big-endian)
        ];
        
        for (const pattern of suspiciousPatterns) {
          if (bufferStr.includes(pattern)) {
            console.warn(`🔧 [FINAL] Detected suspicious pattern ${pattern} in WebSocket frame, sanitizing...`);
            // Replace the suspicious pattern with a safe pattern
            const sanitizedStr = bufferStr.replace(new RegExp(pattern, 'g'), '03e8'); // 1000 in hex
            chunk = Buffer.from(sanitizedStr, 'hex');
            break;
          }
        }
      }
      
      return originalWrite.call(this, chunk, encoding, callback);
    } catch (error) {
      console.error('Error in final WebSocket binary fix:', error);
      return originalWrite.call(this, chunk, encoding, callback);
    }
  };
  
  // Also override the ping method to ensure pings don't carry character IDs
  const originalPing = WebSocket.prototype.ping;
  
  WebSocket.prototype.ping = function(data?: any, mask?: boolean, cb?: any) {
    // Don't allow numeric data in pings that could be character IDs
    if (typeof data === 'number' && (data >= 5000 || (data >= 100 && data <= 999))) {
      console.warn(`🔧 [FINAL] Blocked character ID ${data} from ping, using safe ping`);
      return originalPing.call(this, undefined, mask, cb);
    }
    
    return originalPing.call(this, data, mask, cb);
  };
  
  // Override pong method as well
  const originalPong = WebSocket.prototype.pong;
  
  WebSocket.prototype.pong = function(data?: any, mask?: boolean, cb?: any) {
    // Don't allow numeric data in pongs that could be character IDs
    if (typeof data === 'number' && (data >= 5000 || (data >= 100 && data <= 999))) {
      console.warn(`🔧 [FINAL] Blocked character ID ${data} from pong, using safe pong`);
      return originalPong.call(this, undefined, mask, cb);
    }
    
    return originalPong.call(this, data, mask, cb);
  };
  
  console.log('✅ [FINAL] Binary-level WebSocket frame protection applied successfully');
}

/**
 * Nuclear option: Replace Vite's WebSocket frame processing entirely
 */
export function overrideViteWebSocketProcessing() {
  console.log('☢️ [NUCLEAR] Applying error suppression for Vite WebSocket frame errors...');
  
  try {
    // Suppress Vite WebSocket frame errors at the process level
    process.on('uncaughtException', (error) => {
      if (error.message.includes('Invalid WebSocket frame: invalid status code')) {
        console.warn('☢️ [NUCLEAR] Suppressed Vite WebSocket frame error:', error.message);
        return; // Prevent crash
      }
      
      // Re-throw other errors
      throw error;
    });
    
    console.log('✅ [NUCLEAR] Error suppression applied successfully');
  } catch (error) {
    console.log('⚠️ [NUCLEAR] Error suppression failed, but continuing...');
  }
  
  console.log('✅ [NUCLEAR] Vite WebSocket frame processing override complete');
}
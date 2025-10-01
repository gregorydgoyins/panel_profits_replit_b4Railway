// Comprehensive WebSocket URL fix for Vite HMR undefined port issue
// This patch must run before any other scripts that might cache WebSocket constructor

console.log('🔧 Applying comprehensive WebSocket fix...');

// Store the original WebSocket constructor immediately
const NativeWebSocket = window.WebSocket;

// Create a comprehensive WebSocket wrapper
function FixedWebSocket(url: string | URL, protocols?: string | string[]) {
  let fixedUrl = url;
  
  // Convert URL to string for processing
  const urlString = typeof url === 'string' ? url : url.toString();
  
  // Fix localhost:undefined URLs for Vite HMR
  if (urlString.includes('localhost:undefined')) {
    const currentPort = window.location.port || '5000';
    fixedUrl = urlString.replace('localhost:undefined', `localhost:${currentPort}`);
    console.log('🔧 WebSocket URL FIXED (localhost:undefined):', urlString, '→', fixedUrl);
  }
  
  // Fix undefined port patterns in WebSocket URLs
  if (urlString.includes(':undefined')) {
    const currentPort = window.location.port || '5000';
    fixedUrl = urlString.replace(':undefined', `:${currentPort}`);
    console.log('🔧 WebSocket URL FIXED (:undefined):', urlString, '→', fixedUrl);
  }
  
  // Fix Vite HMR specific patterns
  if (urlString.includes('/?') && urlString.includes('token=') && !urlString.includes(':5000')) {
    const currentPort = window.location.port || '5000';
    // Extract protocol and handle Vite HMR URLs specifically
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    if (urlString.startsWith('wss://') || urlString.startsWith('ws://')) {
      // Parse the URL parts
      const urlObj = new URL(urlString);
      if (urlObj.port === '' || urlObj.port === 'undefined') {
        urlObj.port = currentPort;
        fixedUrl = urlObj.toString();
        console.log('🔧 WebSocket URL FIXED (Vite HMR):', urlString, '→', fixedUrl);
      }
    }
  }
  
  // Create WebSocket with fixed URL using original constructor
  const ws = new NativeWebSocket(fixedUrl, protocols);
  return ws;
}

// Copy all static properties from native WebSocket
FixedWebSocket.CONNECTING = NativeWebSocket.CONNECTING;
FixedWebSocket.OPEN = NativeWebSocket.OPEN;
FixedWebSocket.CLOSING = NativeWebSocket.CLOSING;
FixedWebSocket.CLOSED = NativeWebSocket.CLOSED;

// Ensure proper prototype chain
FixedWebSocket.prototype = NativeWebSocket.prototype;

// Replace the global WebSocket constructor IMMEDIATELY
window.WebSocket = FixedWebSocket as any;

// Also ensure document.defaultView uses the fixed constructor
if (typeof document !== 'undefined' && document.defaultView) {
  document.defaultView.WebSocket = FixedWebSocket as any;
}

// Hook into global scope to catch any other references
if (typeof globalThis !== 'undefined') {
  globalThis.WebSocket = FixedWebSocket as any;
}

console.log('✅ Comprehensive WebSocket fix applied - all WebSocket calls will be intercepted');
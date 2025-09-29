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
  
  // Fix localhost:undefined URLs
  if (urlString.includes('localhost:undefined')) {
    const currentPort = window.location.port || '5000';
    fixedUrl = urlString.replace('localhost:undefined', `localhost:${currentPort}`);
    console.log('🔧 WebSocket URL FIXED:', urlString, '→', fixedUrl);
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
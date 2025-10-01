// DISABLED: WebSocket monkey-patching was causing immediate disconnects (code 1006)
// import "./vite-hmr-fix";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/hind/300.css";
import "@fontsource/hind/400.css";
import "@fontsource/hind/500.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

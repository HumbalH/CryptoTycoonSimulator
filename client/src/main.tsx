import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

// Lock screen orientation to landscape on mobile devices
const lockOrientation = async () => {
  try {
    // @ts-ignore - orientation.lock may not be in TypeScript definitions
    if (screen.orientation && screen.orientation.lock) {
      // @ts-ignore
      await screen.orientation.lock('landscape').catch(() => {
        // Silently fail if orientation lock is not supported or permission denied
      });
    }
  } catch (error) {
    // Orientation lock may not be supported on all devices
  }
};

// Hide loading screen after app mounts
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("fade-out");
    setTimeout(() => loadingScreen.remove(), 500);
  }
};

// Try to lock orientation when page loads
lockOrientation();

// Start rendering
root.render(
  <>
    <App />
    <Analytics />
  </>
);

// Hide loading screen after a short delay to ensure initial render
setTimeout(hideLoadingScreen, 100);


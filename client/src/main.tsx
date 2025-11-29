import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

// Hide loading screen after app mounts
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("fade-out");
    setTimeout(() => loadingScreen.remove(), 500);
  }
};

// Start rendering
root.render(<App />);

// Hide loading screen after a short delay to ensure initial render
setTimeout(hideLoadingScreen, 100);


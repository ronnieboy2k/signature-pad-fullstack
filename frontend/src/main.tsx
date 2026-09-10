import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./signature-pad-js.js";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

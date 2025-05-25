import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { registerSW } from "virtual:pwa-register";
import "./Styles/index.css";
import "../global.d.ts";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
registerSW({ immediate: true });
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

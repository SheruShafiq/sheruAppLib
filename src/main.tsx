import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./Styles/index.css";
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
  <SpeedInsights/>
    <App />
  </BrowserRouter>
);

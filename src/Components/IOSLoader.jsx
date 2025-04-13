import React from "react";
import "../Styles/IOSLoader.css";

function IOSLoader({ size = 20, theme = "dark" }) {
  const themeClass = theme === "dark" ? "spinner dark" : "spinner light";
  const style = { width: size, height: size, marginBottom: "3px" };
  return (
    <div
      className={themeClass}
      style={style}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {[...Array(9)].map((_, i) => (
        <div key={i} className="segment"></div>
      ))}
    </div>
  );
}

export default IOSLoader;

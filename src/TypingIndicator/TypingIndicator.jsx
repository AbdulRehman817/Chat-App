import React from "react";
import "./TypingIndicator.css"; // For styling and animation

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <span className="dot" style={{ animationDelay: "0ms" }}></span>
      <span className="dot" style={{ animationDelay: "150ms" }}></span>
      <span className="dot" style={{ animationDelay: "300ms" }}></span>
    </div>
  );
};

export default TypingIndicator;

// src/components/Button.jsx
import React from "react";

const Button = ({ text, onClick, type = "primary", disabled = false }) => {
  return (
    <button
      className={`btn btn-${type} px-4 shadow-sm fw-bold`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;

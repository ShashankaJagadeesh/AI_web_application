// src/components/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div
      className="card h-100 border-0 shadow card-lift"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
        borderRadius: "1rem",
      }}
    >
      <div className="card-body text-center">
        <img src={icon} alt={title} style={{ width: "60px" }} className="mb-3" />
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text small">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;

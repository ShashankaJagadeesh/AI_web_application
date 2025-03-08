// src/components/AIResponse.jsx
import React from "react";
import Button from "./Button";

const AIResponse = ({ response, loading, handleToggleReading, isReading }) => {
  return (
    <div className="mt-3">
      <h5 className="fw-bold text-dark">AI Response</h5>
      <p className="text-muted">{loading ? "Fetching response..." : response || "Your result will appear here."}</p>

      {response && (
        <div className="d-flex gap-2">
          <Button text="Copy AI Response" onClick={() => navigator.clipboard.writeText(response)} type="secondary" />
          <Button
            text="Download AI Response"
            type="success"
            onClick={() => {
              const blob = new Blob([response], { type: "text/plain" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "AI_Response.txt";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          />
          <Button text={isReading ? "Stop Reading" : "Read AI Response"} onClick={handleToggleReading} type="primary" />
        </div>
      )}
    </div>
  );
};

export default AIResponse;

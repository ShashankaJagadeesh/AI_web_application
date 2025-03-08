// src/components/QueryHistory.jsx
import React from "react";

const QueryHistory = ({ queryHistory, setQuery }) => {
  return (
    <div className="mt-3">
      <h6 className="text-muted">Recent Queries:</h6>
      {queryHistory.length > 0 ? (
        <ul className="list-group list-group-flush border rounded-3 shadow-sm">
          {queryHistory.map((item, index) =>
            item && item.query && item.option ? (
              <li
                key={index}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => setQuery(item.query)}
                style={{ cursor: "pointer" }}
              >
                {item.query}
                <span className="badge bg-primary rounded-pill">{item.option}</span>
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <p className="text-muted">No recent queries.</p>
      )}
    </div>
  );
};

export default QueryHistory;

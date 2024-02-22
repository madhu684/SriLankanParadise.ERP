import React from "react";

const ErrorComponent = ({ error, maxHeight = "80vh" }) => (
  <div
    className="d-flex justify-content-center align-items-center vh-100"
    style={{ maxHeight }}
  >
    Error: {error}
  </div>
);

export default ErrorComponent;

import React from "react";
import { BiError } from "react-icons/bi";

const ErrorComponent = ({ error, maxHeight = "80vh" }) => (
  <div
    className="d-flex flex-column justify-content-center align-items-center vh-100"
    style={{ maxHeight }}
  >
    <BiError size={64} className="text-danger mb-3" />
    <h4 className="text-danger mb-2">Oops! Something went wrong</h4>
    <p className="text-muted text-center" style={{ maxWidth: "500px" }}>
      {error || "An unexpected error occurred. Please try again later."}
    </p>
  </div>
);

export default ErrorComponent;

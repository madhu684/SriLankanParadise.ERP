import React from "react";

const ButtonLoadingSpinner = ({ text }) => (
  <>
    <span className="spinner-border spinner-border-sm"></span>
    <span role="status"> {text}</span>
  </>
);

export default ButtonLoadingSpinner;

import React from "react";
import "./CustomSelect.css";

const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  loading = false,
}) => {
  return (
    <div className="custom-select-wrapper">
      {label && (
        <label className="form-label small fw-semibold mb-1">{label}</label>
      )}
      <select
        className="form-select form-select-sm custom-select"
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {loading && (
        <div className="custom-select-spinner">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

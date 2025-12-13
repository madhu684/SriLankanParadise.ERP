import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiX, FiCheck } from "react-icons/fi";
import "./MultiSelect.css";

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  valueKey = "id",
  labelKey = "name",
  formatLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get display label for an option
  const getDisplayLabel = (option) => {
    if (formatLabel) {
      return formatLabel(option);
    }
    return option[labelKey];
  };

  const filteredOptions = options.filter((option) =>
    getDisplayLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getSelectedLabels = () => {
    return options
      .filter((option) => value.includes(option[valueKey]))
      .map((option) => ({
        value: option[valueKey],
        label: getDisplayLabel(option),
      }));
  };

  const selectedItems = getSelectedLabels();

  return (
    <div className="multi-select-wrapper" ref={dropdownRef}>
      {label && <label className="form-label">{label}</label>}

      <div className={`multi-select-container ${disabled ? "disabled" : ""}`}>
        <div
          className={`multi-select-input ${isOpen ? "open" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="multi-select-values">
            {selectedItems.length === 0 ? (
              <span className="placeholder">{placeholder}</span>
            ) : (
              <div className="selected-tags">
                {selectedItems.map((item) => (
                  <span key={item.value} className="tag">
                    {item.label}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.value);
                      }}
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="multi-select-actions">
            {selectedItems.length > 0 && (
              <button
                type="button"
                className="clear-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              >
                <FiX size={16} />
              </button>
            )}
            <FiChevronDown className={`chevron ${isOpen ? "open" : ""}`} />
          </div>
        </div>

        {isOpen && (
          <div className="multi-select-dropdown">
            <div className="search-box">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="options-list">
              {filteredOptions.length === 0 ? (
                <div className="no-options">No options found</div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option[valueKey]);
                  return (
                    <div
                      key={option[valueKey]}
                      className={`option-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleToggle(option[valueKey])}
                    >
                      <div className="option-checkbox">
                        {isSelected && <FiCheck size={14} />}
                      </div>
                      <span className="option-label">
                        {getDisplayLabel(option)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;

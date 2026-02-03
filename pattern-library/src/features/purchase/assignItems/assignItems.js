import "./assignItems.css";
import React from "react";

const AssignItems = ({
  choise,
  choiseFor,
  label,
  availableItems,
  assignedItems,
  handleSelect,
  handleRemove,
}) => {
  return (
    <div className="row g-3">
      <h6 className="fw-semibold">{` ${choiseFor} `}</h6>
      <div className="form-group col-md-6">
        <label htmlFor="itemSelector" className="form-label">
          {`Select from available ${choise}s for the ${choiseFor} `}
        </label>
        <select
          className="form-control"
          id="itemSelector"
          onChange={(e) => handleSelect(e.target.value)}
          value=""
        >
          <option value="" disabled>
            {`Select ${choise}s`}
          </option>
          {availableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {/* Assigned Items List */}
      <div className="col-md-6">
        <label htmlFor="itemSelector" className="form-label">
          {`Assigned ${choise}s for the ${choiseFor}`}
        </label>
        <div className="list-group">
          {assignedItems.map((item) => (
            <div
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.name}
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignItems;














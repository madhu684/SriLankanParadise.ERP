import React from "react";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useItemType from "./useItemType";

const ItemType = ({ handleClose }) => {
  const {
    formData,
    validFields,
    validationErrors,
    loading,
    handleInputChange,
    handleSubmit,
  } = useItemType({ onFormSubmit: () => handleClose() });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <i
            class="bi bi-arrow-left"
            onClick={handleClose}
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
          ></i>
          <p>
            {" "}
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Item Type</h1>
        <hr />
      </div>

      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>Item Type Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="name" className="form-label">
                Item Type Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.name ? "is-valid" : ""
                } ${validationErrors.name ? "is-invalid" : ""}`}
                id="name"
                placeholder="Enter Item Type Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {validationErrors.name && (
                <div className="invalid-feedback">{validationErrors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className={`form-select ${
                  validFields.status ? "is-valid" : ""
                } ${validationErrors.status ? "is-invalid" : ""}`}
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              {validationErrors.status && (
                <div className="invalid-feedback">
                  {validationErrors.status}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <ButtonLoadingSpinner text="Creating..." /> : "Create"}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemType;

import React from "react";
import useUnit from "./useUnit";

const Unit = () => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    formatDateTime,
    handleInputChange,
    handleSubmit,
  } = useUnit();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <img
            src="path/to/your/logo.png"
            alt="Company Logo"
            className="img-fluid"
          />
          <p>Date and Time: {formatDateTime()}</p>
        </div>
        <h1 className="mt-2 text-center">Create Unit</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Unit created successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Unit created as inactive, you can edit and active it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error creating unit. Please try again.
        </div>
      )}

      <form>
        {/* Unit Information */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>Unit Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="unitName" className="form-label">
                Unit Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.unitName ? "is-valid" : ""
                } ${validationErrors.unitName ? "is-invalid" : ""}`}
                id="unitName"
                placeholder="Enter Unit Name"
                value={formData.UnitName}
                onChange={(e) => handleInputChange("unitName", e.target.value)}
                required
              />
              {validationErrors.unitName && (
                <div className="invalid-feedback">
                  {validationErrors.unitName}
                </div>
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
          >
            Create
          </button>
          <button type="button" className="btn btn-danger">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Unit;

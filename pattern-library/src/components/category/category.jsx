import React from "react";
import useCategory from "./useCategory";

const Category = () => {
  const {
    formData,
    validFields,
    validationErrors,
    formatDateTime,
    handleInputChange,
    handleSubmit,
  } = useCategory();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <img
            src="path/to/your/logo.png"
            alt="Company Logo"
            className="img-fluid"
          />
          <p>Date and Time: {formatDateTime()}</p>
        </div>
        <h1 className="mt-2 text-center">Create Category</h1>
        <hr />
      </div>

      <form>
        {/* Category Information */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>Category Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="categoryName" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.categoryName ? "is-valid" : ""
                } ${validationErrors.categoryName ? "is-invalid" : ""}`}
                id="categoryName"
                placeholder="Enter Category Name"
                value={formData.categoryName}
                onChange={(e) =>
                  handleInputChange("categoryName", e.target.value)
                }
                required
              />
              {validationErrors.categoryName && (
                <div className="invalid-feedback">
                  {validationErrors.categoryName}
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
                <option value="" disabled>
                  Select Status
                </option>
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
            Submit
          </button>
          <button type="button" className="btn btn-danger">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Category;

import React from "react";
import useCategory from "./useCategory";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";

const Category = ({
  handleClose,
  handleUpdated,
  setShowCreateCategoryForm,
}) => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    handleInputChange,
    handleSubmit,
  } = useCategory({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  //const companyLogoUrl = useCompanyLogoUrl()

  const handleBack = () => {
    setShowCreateCategoryForm(false);
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          {/* <img src={companyLogoUrl} alt="Company Logo" height={30} /> */}
          {/* <button
            onClick={handleBack}
            className="btn btn-dark d-flex align-items-center"
          >
            Back
          </button> */}
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
        <h1 className="mt-2 text-center">Category</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Category created successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Category created as inactive, you can edit and active it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error creating category. Please try again.
        </div>
      )}

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
            disabled={loading || submissionStatus !== null}
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Creating..." />
            ) : (
              "Create"
            )}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading || submissionStatus !== null}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Category;

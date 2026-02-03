import React from "react";
import useUnit from "./useUnit";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "common/components/companyLogo/useCompanyLogoUrl";

const Unit = ({ handleClose, handleUpdated, setShowCreateUnitForm }) => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    isLoading,
    isError,
    measurementTypes,
    handleInputChange,
    handleSubmit,
  } = useUnit({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  //const companyLogoUrl = useCompanyLogoUrl();
  const handleBack = () => {
    setShowCreateUnitForm(false);
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
        <h1 className="mt-2 text-center">Unit</h1>
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
                placeholder="Enter Unit Name, ex:- Meter (m)"
                value={formData.unitName}
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
              <label htmlFor="measurementType" className="form-label">
                Measurement Type
              </label>
              <select
                className={`form-select ${
                  validFields.measurementType ? "is-valid" : ""
                } ${validationErrors.measurementType ? "is-invalid" : ""}`}
                id="measurementType"
                value={formData.measurementType}
                onChange={(e) =>
                  handleInputChange("measurementType", e.target.value)
                }
                required
              >
                <option value="">Select measurement Type</option>
                {/* Assuming you have an array of measurement types */}
                {measurementTypes?.map((type) => (
                  <option
                    key={type.measurementTypeId}
                    value={type.measurementTypeId}
                  >
                    {type.name}
                  </option>
                ))}
              </select>
              {validationErrors.measurementType && (
                <div className="invalid-feedback">
                  {validationErrors.measurementType}
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

export default Unit;














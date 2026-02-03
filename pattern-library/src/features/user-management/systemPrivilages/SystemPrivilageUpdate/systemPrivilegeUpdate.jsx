import React from "react";
import useSystemPrivilegeUpdate from "./useSystemPrivilegeUpdate";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const SystemPrivilegeUpdate = ({ handleClose, permission, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    loading,
    isLoading,
    isError,
    systemModules,
    handleInputChange,
    handleSubmit,
  } = useSystemPrivilegeUpdate({
    permission,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            class="bi bi-arrow-left-square fs-3"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          />
          <p>
            {" "}
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">System Privilege</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          System privilege updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          System privilege updated as inactive, you can edit and active it
          later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating system privilege. Please try again.
        </div>
      )}

      <form>
        {/* Permission Information */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>System Privilege Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="permissionName" className="form-label">
                Permission Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.permissionName ? "is-valid" : ""
                } ${validationErrors.permissionName ? "is-invalid" : ""}`}
                id="permissionName"
                placeholder="Enter Permission Name"
                value={formData.permissionName}
                onChange={(e) =>
                  handleInputChange("permissionName", e.target.value)
                }
                required
              />
              {validationErrors.permissionName && (
                <div className="invalid-feedback">
                  {validationErrors.permissionName}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="systemModule" className="form-label">
                System Module
              </label>
              <select
                className={`form-select ${
                  validFields.systemModule ? "is-valid" : ""
                } ${validationErrors.systemModule ? "is-invalid" : ""}`}
                id="systemModule"
                value={formData.systemModule}
                onChange={(e) =>
                  handleInputChange("systemModule", e.target.value)
                }
                required
              >
                <option value="">Select system module</option>
                {systemModules?.map((type) => (
                  <option
                    key={type.subscriptionModule.moduleId}
                    value={type.subscriptionModule.moduleId}
                  >
                    {type.subscriptionModule.module.moduleName}
                  </option>
                ))}
              </select>
              {validationErrors.systemModule && (
                <div className="invalid-feedback">
                  {validationErrors.systemModule}
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
                value={formData.permissionStatus}
                onChange={(e) =>
                  handleInputChange("permissionStatus", e.target.value)
                }
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

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || submissionStatus !== null}
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Updating..." />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemPrivilegeUpdate;














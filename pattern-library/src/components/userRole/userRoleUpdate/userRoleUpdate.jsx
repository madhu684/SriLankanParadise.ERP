import React, { useEffect } from "react";
import useUserRoleUpdate from "./useUserRoleUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const UserRoleUpdate = ({ handleClose, role, handleUpdated }) => {
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
  } = useUserRoleUpdate({
    role,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  useEffect(() => {
    console.log("Role prop received in UserRoleUpdate:", role);
  }, [role]);

  console.log("systemModules in jsx: ", systemModules);

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
        <h1 className="mt-2 text-center">User Role Update</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          User role updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          User role updated as inactive, you can edit and active it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating user role. Please try again.
        </div>
      )}

      <form>
        {/* Role Information */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>Role Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="roleName" className="form-label">
                Role Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.roleName ? "is-valid" : ""
                } ${validationErrors.roleName ? "is-invalid" : ""}`}
                id="roleName"
                placeholder="Enter Role Name"
                value={formData.roleName}
                onChange={(e) => handleInputChange("roleName", e.target.value)}
                required
              />
              {validationErrors.roleName && (
                <div className="invalid-feedback">
                  {validationErrors.roleName}
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
                {/* Assuming you have an array of system modules */}
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
              <ButtonLoadingSpinner text="Updating..." />
            ) : (
              "Update"
            )}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRoleUpdate;
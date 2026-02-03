import React from "react";
import useUserRole from "./useUserRole";
import { useNavigate } from "react-router-dom";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "common/components/companyLogo/useCompanyLogoUrl";

const UserRole = ({ handleClose, handleUpdated }) => {
  const navigate = useNavigate();
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    isLoading,
    isError,
    systemModules,
    handleInputChange,
    handleSubmit,
    handleClose: closeForm,
  } = useUserRole({
    onFormSubmit: () => {
      if (handleUpdated) handleUpdated();
      handleClose(); // Close form after submission
    },
    onClose: () => {
      handleClose(); // Close when cancelled
    },
  });

  //const companyLogoUrl = useCompanyLogoUrl();

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          {/* <img src={companyLogoUrl} alt="Company Logo" height={30} /> */}
          <i
            class="bi bi-arrow-left"
            onClick={handleClose}
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">User Role</h1>
        <hr />
      </div>

      {submissionStatus === 'successSubmitted' && (
        <div className="alert alert-success mb-3" role="alert">
          User role created successfully!
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="alert alert-danger mb-3" role="alert">
          Error creating user role. Please try again.
        </div>
      )}

      <form>
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
                  validFields.roleName ? 'is-valid' : ''
                } ${validationErrors.roleName ? 'is-invalid' : ''}`}
                id="roleName"
                placeholder="Enter Role Name"
                value={formData.roleName}
                onChange={(e) => handleInputChange('roleName', e.target.value)}
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
                  validFields.systemModule ? 'is-valid' : ''
                } ${validationErrors.systemModule ? 'is-invalid' : ''}`}
                id="systemModule"
                value={formData.systemModule}
                onChange={(e) =>
                  handleInputChange('systemModule', e.target.value)
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
                  validFields.status ? 'is-valid' : ''
                } ${validationErrors.status ? 'is-invalid' : ''}`}
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
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
              'Create'
            )}
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
  )
};

export default UserRole;













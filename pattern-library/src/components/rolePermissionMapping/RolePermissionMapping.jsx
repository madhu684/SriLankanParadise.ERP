import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useRolePermissionMapping from "./useRolePermissionMapping";

const RolePermissionMapping = () => {
  const {
    systemModules,
    filteredRoles,
    filteredPermissions,
    roleMappings,
    selectedModuleId,
    selectedRoleId,
    selectedPermissionId,
    errors,
    mappingsLoading,
    submissionStatus,
    isSubmiting,
    handleModuleChange,
    handleRoleChange,
    handleRemove,
    handlePermissionChange,
    handleCreate,
    handleClear,
  } = useRolePermissionMapping();

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <div className="d-flex justify-content-end">
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Role Permission Mapping</h1>
        <hr />
      </div>
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Role Permission mapped successfully!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error mapping role Permissions. Please try again.
        </div>
      )}
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="systemModule" className="form-label">
                System Module
              </label>
              <select
                className={`form-select ${
                  errors.selectedModuleId ? "is-invalid" : ""
                }`}
                id="systemModule"
                value={selectedModuleId}
                onChange={handleModuleChange}
                required
              >
                <option value="">Select system module</option>
                {systemModules?.map((module) => (
                  <option
                    key={module.subscriptionModule.moduleId}
                    value={module.subscriptionModule.moduleId}
                  >
                    {module.subscriptionModule.module.moduleName}
                  </option>
                ))}
              </select>
              {errors.selectedModuleId && (
                <div className="invalid-feedback">
                  {errors.selectedModuleId}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Select a Role
              </label>
              <select
                className={`form-select ${
                  errors.selectedRoleId ? "is-invalid" : ""
                }`}
                id="role"
                value={selectedRoleId}
                onChange={handleRoleChange}
                required
              >
                <option value="">Select a Role</option>
                {filteredRoles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.selectedRoleId && (
                <div className="invalid-feedback">{errors.selectedRoleId}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Select Permissions
              </label>
              <select
                className={`form-select ${
                  errors.selectedPermissionId ? "is-invalid" : ""
                }`}
                id="permissions"
                value={selectedPermissionId}
                onChange={(e) => handlePermissionChange(e.target.value)}
                required
              >
                <option value="">Select Permissions</option>
                {filteredPermissions.map((per) => (
                  <option key={per.permissionId} value={per.permissionId}>
                    {per.permissionName}
                  </option>
                ))}
              </select>
              {errors.selectedPermissionId && (
                <div className="invalid-feedback">
                  {errors.selectedPermissionId}
                </div>
              )}
            </div>
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={handleCreate}
                disabled={roleMappings.length === 0 || isSubmiting}
              >
                {isSubmiting ? (
                  <LoadingSpinner />
                ) : roleMappings.length > 0 ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClear}
              >
                Cancel
              </button>
            </div>
          </div>
          {selectedRoleId !== null && (
            <div className="col-md-6 mt-4">
              <div className="card">
                {roleMappings && roleMappings.length > 0 ? (
                  <>
                    <div className="card-header">
                      <h6 className="card-title-small">Role Permissions</h6>
                    </div>
                    <div className="card-body">
                      <div>
                        {mappingsLoading ? (
                          <div className="d-flex justify-content-center">
                            <LoadingSpinner />
                          </div>
                        ) : (
                          roleMappings.map((mapping) => (
                            <div
                              key={mapping.permissionId}
                              className="d-flex justify-content-between align-items-center mb-2"
                            >
                              <span className="me-2">
                                {mapping.permissionName}
                              </span>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() =>
                                  handleRemove(mapping.permissionId)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card-body d-flex justify-content-center">
                    <p>No any mappings found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RolePermissionMapping;

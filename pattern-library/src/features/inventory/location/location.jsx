import React from "react";
import useUnit from "./useLocation";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "common/components/companyLogo/useCompanyLogoUrl";

const Location = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    isLoading,
    isError,
    locationTypes,
    selectedParentLocation,
    searchTerm,
    isLocationsLoading,
    isLocationsError,
    locationsError,
    availableLocations,
    handleInputChange,
    handleSubmit,
    handleSelectLocation,
    handleResetParentLocation,
    setSearchTerm,
  } = useUnit({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

  return (
    <div className="container mt-4">
      {/* Header */}
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
            {" "}
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Location</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Location created successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Location created as inactive, you can edit and active it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error creating location. Please try again.
        </div>
      )}

      <form>
        {/* Location Information */}
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>Location Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="locationName" className="form-label">
                Location Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.locationName ? "is-valid" : ""
                } ${validationErrors.locationName ? "is-invalid" : ""}`}
                id="locationName"
                placeholder="Enter Location Name"
                value={formData.locationName}
                onChange={(e) =>
                  handleInputChange("locationName", e.target.value)
                }
                required
              />
              {validationErrors.locationName && (
                <div className="invalid-feedback">
                  {validationErrors.locationName}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="locationType" className="form-label">
                Location Type
              </label>
              <select
                className={`form-select ${
                  validFields.locationType ? "is-valid" : ""
                } ${validationErrors.locationType ? "is-invalid" : ""}`}
                id="locationType"
                value={formData.locationType}
                onChange={(e) =>
                  handleInputChange("locationType", e.target.value)
                }
                required
              >
                <option value="">Select Location Type</option>
                {locationTypes?.map((type) => (
                  <option key={type.locationTypeId} value={type.locationTypeId}>
                    {type.name}
                  </option>
                ))}
              </select>
              {validationErrors.locationType && (
                <div className="invalid-feedback">
                  {validationErrors.locationType}
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

          <div className="col-md-5">
            <h4>Location Hierarchy</h4>
            {/* Other form fields */}
            <div className="mb-3 mt-3">
              <label htmlFor="locationHierarchy" className="form-label">
                Hierarchy Type (Main Location/ Sub Location)?
              </label>
              <select
                className={`form-select ${
                  validFields.locationHierarchy ? "is-valid" : ""
                } ${validationErrors.locationHierarchy ? "is-invalid" : ""}`}
                id="locationHierarchy"
                value={formData.locationHierarchy}
                onChange={(e) =>
                  handleInputChange("locationHierarchy", e.target.value)
                }
                required
              >
                <option value="">Select Location Type</option>
                <option value="main">Main location</option>
                <option value="sub">Sub location</option>
              </select>
              {validationErrors.locationHierarchy && (
                <div className="invalid-feedback">
                  {validationErrors.locationHierarchy}
                </div>
              )}
            </div>

            {formData.locationHierarchy === "sub" &&
              selectedParentLocation === "" && (
                <div className="mb-3 mt-4">
                  {/* location Search */}
                  <div className="mb-0 mt-3">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a parent location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <span
                          className="input-group-text bg-transparent"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => setSearchTerm("")}
                        >
                          <i className="bi bi-x"></i>
                        </span>
                      )}
                    </div>

                    {/* Dropdown for filtered locations */}
                    {searchTerm && (
                      <div className="dropdown" style={{ width: "100%" }}>
                        <ul
                          className="dropdown-menu"
                          style={{
                            display: "block",
                            width: "100%",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {isLocationsLoading ? (
                            <li className="dropdown-item">
                              <ButtonLoadingSpinner text="Searching..." />
                            </li>
                          ) : isLocationsError ? (
                            <li className="dropdown-item">
                              Error: {locationsError.message}
                            </li>
                          ) : availableLocations.length === 0 ? (
                            <li className="dropdown-item">
                              <span className="me-3">
                                <i className="bi bi-emoji-frown"></i>
                              </span>
                              No locations found
                            </li>
                          ) : (
                            availableLocations?.map((location) => (
                              <li key={location.locationId}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => handleSelectLocation(location)}
                                >
                                  <span className="me-3">
                                    <i className="bi bi-geo-alt"></i>
                                  </span>{" "}
                                  {location.locationName}
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="mb-3">
                      <small className="form-text text-muted">
                        Please search for a parent location for this sub
                        location and add it
                      </small>
                    </div>
                    {validationErrors.selectedParentLocation && (
                      <div className="text-danger">
                        {validationErrors.selectedParentLocation}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {selectedParentLocation && (
              <div className="card border-success mb-3 mt-4">
                <div className="card-header">Selected Parent Location</div>
                <div className="card-body">
                  <p>Location Name: {selectedParentLocation.locationName}</p>
                  <p>
                    Location Type: {selectedParentLocation?.locationType?.name}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-danger float-end"
                    onClick={handleResetParentLocation}
                  >
                    Reset Parent Location
                  </button>
                </div>
              </div>
            )}
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

export default Location;














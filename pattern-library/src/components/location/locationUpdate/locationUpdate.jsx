import React from "react";
import useLocationUpdate from "./useLocationUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const LocationUpdate = ({ handleClose, location, handleUpdated }) => {
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
  } = useLocationUpdate({
    location,
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
        <h1 className="mt-2 text-center">Location</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Location updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Location updated as inactive, you can edit and active it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating location. Please try again.
        </div>
      )}

      <form>
        {/* Unit Information */}
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

            {formData.locationHierarchy === "sub" && selectedParentLocation && (
              <div className="d-flex justify-content-between mt-4">
                <span>
                  <strong>Selected Parent:</strong>{" "}
                  {selectedParentLocation.locationName}
                </span>
                <button
                  className="btn btn-danger"
                  onClick={handleResetParentLocation}
                >
                  Reset Parent
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save/Update Buttons */}
        <div className="d-flex justify-content-end">
          <div className="text-end">
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
              onClick={() => {
                console.log("Form data:", formData);
                handleSubmit();
              }}
              disabled={loading}
            >
              {loading ? <ButtonLoadingSpinner /> : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationUpdate;

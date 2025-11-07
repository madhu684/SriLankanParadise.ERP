import React from "react";
import useLocation from "./useLocation"; // Update path as needed
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";

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
    itemPriceList,
    handleInputChange,
    handleSubmit,
    handleSelectLocation,
    handleResetParentLocation,
    setSearchTerm,
    handleResetItemPriceList,
    handleItemPriceListChange,
  } = useLocation({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

  return (
    <div className="container-fluid py-4" style={{ maxWidth: "1400px" }}>
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handleClose}
            className="btn btn-dark d-flex align-items-center gap-2 px-3"
            disabled={loading}
          >
            <i className="bi bi-arrow-left"></i>
            {/* <span>Back</span> */}
          </button>
          <p className="text-muted mb-0">
            <CurrentDateTime />
          </p>
        </div>

        <div className="text-center">
          <h1 className="fw-bold mb-2">
            <i className="text-primary me-2"></i>
            Create Location
          </h1>
        </div>
        <hr className="my-4" />
      </div>

      {/* Alert Messages */}
      {submissionStatus === "successSubmitted" && (
        <div
          className="alert alert-success alert-dismissible fade show mb-4 shadow-sm"
          role="alert"
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill fs-4 me-3"></i>
            <div>
              <strong>Success!</strong> Location created successfully!
            </div>
          </div>
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div
          className="alert alert-info alert-dismissible fade show mb-4 shadow-sm"
          role="alert"
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill fs-4 me-3"></i>
            <div>
              <strong>Saved!</strong> Location created as inactive. You can edit
              and activate it later!
            </div>
          </div>
        </div>
      )}
      {submissionStatus === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4 shadow-sm"
          role="alert"
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
            <div>
              <strong>Error!</strong> Unable to create location. Please try
              again.
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column - Location Information */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Location Information
              </h4>
            </div>
            <div className="card-body p-4">
              {/* Location Name */}
              <div className="mb-4">
                <label
                  htmlFor="locationName"
                  className="form-label fw-semibold"
                >
                  <i className="bi bi-building me-2 text-primary"></i>
                  Location Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.locationName ? "is-valid" : ""
                  } ${validationErrors.locationName ? "is-invalid" : ""}`}
                  id="locationName"
                  placeholder="Enter location name"
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

              {/* Location Type */}
              <div className="mb-4">
                <label
                  htmlFor="locationType"
                  className="form-label fw-semibold"
                >
                  <i className="bi bi-tags me-2 text-primary"></i>
                  Location Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select  ${
                    validFields.locationType ? "is-valid" : ""
                  } ${validationErrors.locationType ? "is-invalid" : ""}`}
                  id="locationType"
                  value={formData.locationType}
                  onChange={(e) =>
                    handleInputChange("locationType", e.target.value)
                  }
                  required
                >
                  <option value="">Choose location type...</option>
                  {locationTypes?.map((type) => (
                    <option
                      key={type.locationTypeId}
                      value={type.locationTypeId}
                    >
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

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="form-label fw-semibold">
                  <i className="bi bi-toggle-on me-2 text-primary"></i>
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select  ${
                    validFields.status ? "is-valid" : ""
                  } ${validationErrors.status ? "is-invalid" : ""}`}
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  required
                >
                  <option value="">Choose status...</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
                {validationErrors.status && (
                  <div className="invalid-feedback">
                    {validationErrors.status}
                  </div>
                )}
              </div>

              {/* Item Price List - FIXED */}
              <div className="mb-4">
                <label
                  htmlFor="itemPriceList"
                  className="form-label fw-semibold"
                >
                  <i className="bi bi-currency-dollar me-2 text-primary"></i>
                  Item Price List <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select  ${
                    validFields.itemPriceListId ? "is-valid" : ""
                  } ${validationErrors.itemPriceListId ? "is-invalid" : ""}`}
                  id="itemPriceList"
                  value={formData.itemPriceListId || ""}
                  onChange={(e) => handleItemPriceListChange(e.target.value)}
                  disabled={formData.selectedPriceList !== null}
                >
                  <option value="">Choose price list...</option>
                  {itemPriceList?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.listName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Price List Card */}
              {formData.selectedPriceList && (
                <div className="card border-success shadow-sm">
                  <div className="card-header bg-success text-white d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Selected Item Price List
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <strong className="text-muted d-block mb-1">
                        List Name:
                      </strong>
                      <p className="mb-0">
                        {formData.selectedPriceList?.listName}
                      </p>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block mb-1">
                        Effective Date:
                      </strong>
                      <p className="mb-0">
                        <i className="bi bi-calendar-event me-2"></i>
                        {
                          formData.selectedPriceList?.effectiveDate.split(
                            "T"
                          )[0]
                        }
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100"
                      onClick={handleResetItemPriceList}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Reset Price List
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Location Hierarchy */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-info text-white py-3">
              <h4 className="mb-0">
                <i className="bi bi-diagram-3 me-2"></i>
                Location Hierarchy
              </h4>
            </div>
            <div className="card-body p-4">
              {/* Hierarchy Type */}
              <div className="mb-4">
                <label
                  htmlFor="locationHierarchy"
                  className="form-label fw-semibold"
                >
                  <i className="bi bi-layers me-2 text-info"></i>
                  Hierarchy Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select  ${
                    validFields.locationHierarchy ? "is-valid" : ""
                  } ${validationErrors.locationHierarchy ? "is-invalid" : ""}`}
                  id="locationHierarchy"
                  value={formData.locationHierarchy}
                  onChange={(e) =>
                    handleInputChange("locationHierarchy", e.target.value)
                  }
                  required
                >
                  <option value="">Choose hierarchy type...</option>
                  <option value="main">Main Location</option>
                  <option value="sub">Sub Location</option>
                </select>
                {validationErrors.locationHierarchy && (
                  <div className="invalid-feedback">
                    {validationErrors.locationHierarchy}
                  </div>
                )}
              </div>

              {/* Parent Location Search */}
              {formData.locationHierarchy === "sub" &&
                !selectedParentLocation && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-search me-2 text-info"></i>
                      Parent Location <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-white">
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
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setSearchTerm("")}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>

                    {/* Search Results Dropdown */}
                    {searchTerm && (
                      <div
                        className="mt-2 border rounded shadow-sm bg-white"
                        style={{ maxHeight: "250px", overflowY: "auto" }}
                      >
                        {isLocationsLoading ? (
                          <div className="p-3 text-center">
                            <ButtonLoadingSpinner text="Searching..." />
                          </div>
                        ) : isLocationsError ? (
                          <div className="p-3 text-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Error: {locationsError?.message}
                          </div>
                        ) : availableLocations?.length === 0 ? (
                          <div className="p-3 text-muted text-center">
                            <i className="bi bi-emoji-frown fs-4 d-block mb-2"></i>
                            No locations found
                          </div>
                        ) : (
                          <div className="list-group list-group-flush">
                            {availableLocations?.map((location) => (
                              <button
                                key={location.locationId}
                                type="button"
                                className="list-group-item list-group-item-action d-flex align-items-center"
                                onClick={() => handleSelectLocation(location)}
                              >
                                <i className="bi bi-geo-alt text-info me-3 fs-5"></i>
                                <div>
                                  <div className="fw-semibold">
                                    {location.locationName}
                                  </div>
                                  <small className="text-muted">
                                    {location.locationType?.name}
                                  </small>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <small className="form-text text-muted d-block mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Search and select a parent location for this sub location
                    </small>
                    {validationErrors.selectedParentLocation && (
                      <div className="text-danger mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {validationErrors.selectedParentLocation}
                      </div>
                    )}
                  </div>
                )}

              {/* Selected Parent Location Card */}
              {selectedParentLocation && (
                <div className="card border-success shadow-sm mt-4">
                  <div className="card-header bg-success text-white d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Selected Parent Location
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <strong className="text-muted d-block mb-1">
                        Location Name:
                      </strong>
                      <p className="mb-0">
                        {selectedParentLocation.locationName}
                      </p>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block mb-1">
                        Location Type:
                      </strong>
                      <p className="mb-0">
                        {selectedParentLocation?.locationType?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100"
                      onClick={handleResetParentLocation}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Reset Parent Location
                    </button>
                  </div>
                </div>
              )}

              {/* Info box for main location */}
              {formData.locationHierarchy === "main" && (
                <div className="alert alert-info border-info shadow-sm mt-4">
                  <div className="d-flex">
                    <i className="bi bi-info-circle-fill fs-5 me-3 flex-shrink-0"></i>
                    <div>
                      <strong className="d-block mb-1">Main Location</strong>
                      <p className="mb-0 small">
                        This location will be created as a main location and can
                        have sub-locations under it.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 d-flex gap-3 justify-content-start pb-4">
        <button
          type="button"
          className="btn btn-primary px-5 shadow"
          onClick={handleSubmit}
          disabled={loading || submissionStatus !== null}
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Creating..." />
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Create
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-danger px-5"
          onClick={handleClose}
          disabled={loading || submissionStatus !== null}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Location;

import React from "react";
import useTransferRequisition from "./useTransferRequisition";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import ToastMessage from "../toastMessage/toastMessage";

const TransferRequisition = ({
  handleClose,
  handleUpdated,
  setShowCreateTRForm,
}) => {
  const {
    formData,
    locations,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    isError,
    isLoading,
    error,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    loading,
    userDepartments,
    userLocations,
    showToast,
    isTRGenerated,
    trGenerating,
    uniqueItemBatchRefs,
    setShowToast,
    handleInputChange,
    handleDepartmentChange,
    handleItemDetailsChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    setFormData,
    setSearchTerm,
    handleSelectItem,
    handleGenerateTRN,
  } = useTransferRequisition({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handleClose}
            className="btn btn-dark d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="text-muted small">
            <CurrentDateTime />
          </div>
        </div>
        <h2 className="text-center mb-3 fw-bold">Transfer Requisition Note</h2>
        <hr className="mb-4" />
      </div>

      {/* Main Content */}
      <div ref={alertRef}></div>

      {/* Status Alerts */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Transfer requisition note submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Transfer requisition note saved as draft, you can edit and submit it
          later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting Transfer requisition. Please try again.
        </div>
      )}

      <div className="row g-4 mb-4">
        {/* Left Column - Request Information */}
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
              <i className="bi bi-info-circle"></i>
              <span className="fw-medium">1. Request Information</span>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Purpose of Request <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    validFields.purposeOfRequest ? "is-valid" : ""
                  } ${validationErrors.purposeOfRequest ? "is-invalid" : ""}`}
                  placeholder="Enter purpose of request"
                  value={formData.purposeOfRequest}
                  onChange={(e) =>
                    handleInputChange("purposeOfRequest", e.target.value)
                  }
                  rows="2"
                  maxLength="200"
                  required
                ></textarea>
                {validationErrors.purposeOfRequest && (
                  <div className="invalid-feedback">
                    {validationErrors.purposeOfRequest}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Requested From Warehouse{" "}
                  <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    validFields.fromWarehouseLocation ? "is-valid" : ""
                  } ${
                    validationErrors.fromWarehouseLocation ? "is-invalid" : ""
                  }`}
                  value={formData.fromWarehouseLocation ?? ""}
                  onChange={(e) =>
                    handleInputChange("fromWarehouseLocation", e.target.value)
                  }
                >
                  <option value="">Select Warehouse</option>
                  {userLocations
                    .filter(
                      (ul) =>
                        ul.location.locationTypeId === 2 &&
                        ul.location.alias !== "BOND"
                    )
                    .map((ul) => (
                      <option
                        key={ul.location.locationId}
                        value={ul.location.locationId}
                      >
                        {ul.location.locationName}
                      </option>
                    ))}
                </select>
                {validationErrors.fromWarehouseLocation && (
                  <div className="invalid-feedback">
                    {validationErrors.fromWarehouseLocation}
                  </div>
                )}
              </div>

              <div className="mb-0">
                <label className="form-label fw-medium">
                  Requested To Warehouse <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    validFields.toWarehouseLocation ? "is-valid" : ""
                  } ${
                    validationErrors.toWarehouseLocation ? "is-invalid" : ""
                  }`}
                  value={formData.toWarehouseLocation ?? ""}
                  onChange={(e) =>
                    handleInputChange("toWarehouseLocation", e.target.value)
                  }
                >
                  <option value="">Select Warehouse</option>
                  {locations
                    .filter(
                      (location) =>
                        location.alias !== "DMG" &&
                        location.locationTypeId === 2 &&
                        location.locationId !==
                          parseInt(formData.fromWarehouseLocation)
                    )
                    .map((location) => (
                      <option
                        key={location.locationId}
                        value={location.locationId}
                      >
                        {location.locationName}
                      </option>
                    ))}
                </select>
                {validationErrors.toWarehouseLocation && (
                  <div className="invalid-feedback">
                    {validationErrors.toWarehouseLocation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-secondary text-white d-flex align-items-center gap-2">
          <i className="bi bi-box"></i>
          <span className="fw-medium">3. Item Details</span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 mb-3">
              <label className="form-label fw-medium">Search Items</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for an item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={
                    formData.fromWarehouseLocation === null ||
                    formData.toWarehouseLocation === null
                  }
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>

              {searchTerm && (
                <div className="dropdown w-100 mt-2">
                  <ul
                    className="dropdown-menu show w-100 position-absolute"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {isItemsLoading ? (
                      <li className="dropdown-item">
                        <ButtonLoadingSpinner text="Searching..." />
                      </li>
                    ) : isItemsError ? (
                      <li className="dropdown-item">
                        Error: {itemsError.message}
                      </li>
                    ) : availableItems === null ||
                      availableItems?.filter(
                        (item) =>
                          !formData.itemDetails.some(
                            (detail) => detail.id === item.itemMasterId
                          )
                      ).length === 0 ? (
                      <li className="dropdown-item">
                        <span className="me-3">
                          <i className="bi bi-emoji-frown"></i>
                        </span>
                        No items found
                      </li>
                    ) : (
                      availableItems
                        ?.filter(
                          (item) =>
                            !formData.itemDetails.some(
                              (detail) => detail.id === item.itemMasterId
                            )
                        )
                        .map((item) => (
                          <li key={item.itemMasterId}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={(e) => handleSelectItem(item, e)}
                            >
                              <i className="bi bi-cart4 text-success me-3 fs-5"></i>
                              <div>
                                <div className="fw-semibold">
                                  {item.itemCode}
                                </div>
                                <small className="text-muted">
                                  {item.itemName}
                                </small>
                              </div>
                            </button>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {formData.itemDetails.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item Name</th>
                    <th>Unit</th>
                    <th>Cust Dek No</th>
                    <th>Quantity</th>
                    <th>Duty Paid W. Stock</th>
                    <th>Bonded W. Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.itemDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {item.unit}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`form-select ${
                            validFields[`custDekNo_${index}`] ? "is-valid" : ""
                          } ${
                            validationErrors[`custDekNo_${index}`]
                              ? "is-invalid"
                              : ""
                          }`}
                          value={item.batchId || ""}
                          onChange={(e) =>
                            handleItemDetailsChange(
                              index,
                              "batchId",
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value="" disabled>
                            Select Cust Dek No
                          </option>
                          {uniqueItemBatchRefs?.map((cd) => (
                            <option key={cd.batchId} value={cd.batchId}>
                              {cd.custDekNo}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className={`form-control ${
                            validFields[`quantity_${index}`] ? "is-valid" : ""
                          } ${
                            validationErrors[`quantity_${index}`]
                              ? "is-invalid"
                              : ""
                          }`}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemDetailsChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                        />
                        {validationErrors[`quantity_${index}`] && (
                          <div className="invalid-feedback">
                            {validationErrors[`quantity_${index}`]}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-primary fs-6 px-3 py-2">
                          {item.totalStockInHand}
                        </span>
                      </td>
                      {/* <td>
                        <span className="badge bg-success fs-6 px-3 py-2">
                          {item.totalStockInHandTo}
                        </span>
                      </td> */}
                      <td>
                        {item.isLoadingStock ? (
                          <div
                            className="spinner-border spinner-border-sm text-success"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <span className="badge bg-success fs-6 px-3 py-2">
                            {item.totalStockInHandTo}
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-info-circle"></i>
              <span>
                No items added yet. Search and select items to add to the
                invoice.
              </span>
            </div>
          )}

          {/* Generate TR Button */}
          {/* <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-info"
              onClick={handleGenerateTRN}
              disabled={
                trGenerating ||
                formData.toWarehouseLocation === null ||
                formData.fromWarehouseLocation === null ||
                formData.itemDetails.length > 0
              }
            >
              {trGenerating ? (
                <div className="d-flex align-items-center w-100">
                  <ButtonLoadingSpinner />
                </div>
              ) : (
                "Generate Transfer Requisition"
              )}
            </button>
          </div> */}

          {formData.itemDetails.length === 0 && isTRGenerated === true && (
            <ToastMessage
              show={showToast}
              onClose={() => setShowToast(false)}
              type="warning"
              message="No any available stocks in requested location"
            />
          )}
        </div>
      </div>

      {/* Attachments Section */}
      {/* <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-secondary text-white d-flex align-items-center gap-2">
          <i className="bi bi-paperclip"></i>
          <span className="fw-medium">4. Attachments</span>
        </div>
        <div className="card-body">
          <div className="mb-0">
            <label className="form-label fw-medium">
              Upload Files (Optional)
            </label>
            <input
              type="file"
              className={`form-control ${
                validFields.attachments ? "is-valid" : ""
              } ${validationErrors.attachments ? "is-invalid" : ""}`}
              onChange={(e) => handleAttachmentChange(e.target.files)}
              multiple
            />
            <small className="text-muted form-text d-block mt-2">
              <i className="bi bi-info-circle me-1"></i> File size limit: 10MB
            </small>
            {validationErrors.attachments && (
              <div className="invalid-feedback">
                {validationErrors.attachments}
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="d-flex flex-wrap gap-3 mb-3">
        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={() => handleSubmit(false)}
          disabled={
            !formData.itemDetails.length > 0 ||
            loading ||
            submissionStatus !== null
          }
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Submitting..." />
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Submit
            </>
          )}
        </button>
        {/* <button
          type="button"
          className="btn btn-secondary px-4"
          disabled={loading || submissionStatus !== null}
        >
          <i className="bi bi-save me-2"></i>
          Save as Draft
        </button> */}
        <button
          type="button"
          className="btn btn-danger px-4"
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

export default TransferRequisition;

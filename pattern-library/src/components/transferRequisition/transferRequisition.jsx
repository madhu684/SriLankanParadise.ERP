import React from "react";
import useTransferRequisition from "./useTransferRequisition";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";

const TransferRequisition = ({ handleClose, handleUpdated }) => {
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
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    setFormData,
    setSearchTerm,
    handleSelectItem,
  } = useTransferRequisition({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });
  //const companyLogoUrl = useCompanyLogoUrl();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

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
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Transfer Requisition Note</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === 'successSubmitted' && (
        <div className="alert alert-success mb-3" role="alert">
          Transfer requisition note submitted successfully!
        </div>
      )}
      {submissionStatus === 'successSavedAsDraft' && (
        <div className="alert alert-success mb-3" role="alert">
          Transfer requisition note saved as draft, you can edit and submit it
          later!
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting Transfer requisition. Please try again.
        </div>
      )}

      <form>
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Requestor Information */}
            <h4>1. Request Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="purposeOfRequest" className="form-label">
                Purpose of Request
              </label>
              <textarea
                className={`form-control ${
                  validFields.purposeOfRequest ? 'is-valid' : ''
                } ${validationErrors.purposeOfRequest ? 'is-invalid' : ''}`}
                placeholder="Enter purpose of request"
                id="purposeOfRequest"
                value={formData.purposeOfRequest}
                onChange={(e) =>
                  handleInputChange('purposeOfRequest', e.target.value)
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

            <div className="mb-3 mt-3">
              <label htmlFor="deliveryLocation" className="form-label">
                Department
              </label>
              <select
                className={`form-select ${
                  validFields.deliveryLocation ? 'is-valid' : ''
                } ${validationErrors.deliveryLocation ? 'is-invalid' : ''}`}
                id="deliveryLocation"
                value={formData?.deliveryLocation ?? ''}
                onChange={(e) => {
                  handleInputChange('deliveryLocation', e.target.value)
                  // Reset warehouseLocation in formData
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    warehouseLocation: '',
                  }))
                }}
                disabled
              >
                <option value="">Select Location</option>
                {/* Filter out locations where locationType is not "Warehouse" */}
                {locations
                  .filter(
                    (location) => location.locationType.name !== 'Warehouse'
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
              {validationErrors.deliveryLocation && (
                <div className="invalid-feedback">
                  {validationErrors.deliveryLocation}
                </div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="toWarehouseLocation" className="form-label">
                To Warehouse Location
              </label>
              <select
                className={`form-select ${
                  validFields.toWarehouseLocation ? 'is-valid' : ''
                } ${validationErrors.toWarehouseLocation ? 'is-invalid' : ''}`}
                id="toWarehouseLocation"
                value={formData?.toWarehouseLocation ?? ''}
                disabled={!formData.deliveryLocation}
                onChange={(e) =>
                  handleInputChange('toWarehouseLocation', e.target.value)
                }
              >
                <option value="">Select Warehouse</option>
                {/* Filter out warehouse locations based on both the selected delivery location and the locationType being "Warehouse" */}
                {locations
                  .filter(
                    (location) =>
                      location.parentId ===
                        parseInt(formData.deliveryLocation) &&
                      location.locationType.name === 'Warehouse'
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

            <div className="mb-3 mt-3">
              <label htmlFor="fromWarehouseLocation" className="form-label">
                From Warehouse Location
              </label>
              <select
                className={`form-select ${
                  validFields.fromWarehouseLocation ? 'is-valid' : ''
                } ${
                  validationErrors.fromWarehouseLocation ? 'is-invalid' : ''
                }`}
                id="fromWarehouseLocation"
                value={formData?.fromWarehouseLocation ?? ''}
                disabled={!formData.deliveryLocation}
                onChange={(e) =>
                  handleInputChange('fromWarehouseLocation', e.target.value)
                }
              >
                <option value="">Select Warehouse</option>
                {/* Filter out warehouse locations based on the locationType being "Warehouse" */}
                {locations
                  .filter(
                    (location) => location.locationType.name === 'Warehouse'
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
              {validationErrors.fromWarehouseLocation && (
                <div className="invalid-feedback">
                  {validationErrors.fromWarehouseLocation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <h4>2. Item Details</h4>

        <div className="col-md-5">
          {/* Item Search */}
          <div className="mb-3 mt-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <span
                  className="input-group-text bg-transparent"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x"></i>
                </span>
              )}
            </div>
            {/* Dropdown for filtered items */}
            {searchTerm && (
              <div className="dropdown" style={{ width: '100%' }}>
                <ul
                  className="dropdown-menu"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
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
                      ) // Filter out items that are already in itemDetails
                      .map((item) => (
                        <li key={item.itemMasterId}>
                          <button
                            className="dropdown-item"
                            onClick={() => handleSelectItem(item)}
                          >
                            <span className="me-3">
                              <i className="bi bi-cart4"></i>
                            </span>
                            {item.itemName}
                          </button>
                        </li>
                      ))
                  )}
                </ul>
              </div>
            )}

            {!formData.itemDetails.length > 0 && (
              <div className="mb-3">
                <small className="form-text text-muted">
                  Please search for an item and add it
                </small>
              </div>
            )}
          </div>
        </div>

        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
                          validFields[`quantity_${index}`] ? 'is-valid' : ''
                        } ${
                          validationErrors[`quantity_${index}`]
                            ? 'is-invalid'
                            : ''
                        }`}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            'quantity',
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
                      <button
                        type="button"
                        className="btn btn-outline-danger"
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
        )}

        {/* Attachments */}
        <h4>3. Attachments</h4>
        <div className="col-md-6 mb-3">
          <label htmlFor="attachment" className="form-label">
            Attachments (if any)
          </label>
          <input
            type="file"
            className={`form-control ${
              validFields.attachments ? 'is-valid' : ''
            } ${validationErrors.attachments ? 'is-invalid' : ''}`}
            id="attachment"
            onChange={(e) => handleAttachmentChange(e.target.files)}
            multiple
          />
          <small className="form-text text-muted">File size limit: 10MB</small>
          {validationErrors.attachments && (
            <div className="invalid-feedback">
              {validationErrors.attachments}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
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
              'Submit'
            )}
          </button>
          {/* <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleSubmit(true)}
          >
            Save as Draft
          </button> */}
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
  )
};

export default TransferRequisition;

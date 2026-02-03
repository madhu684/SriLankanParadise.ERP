import React from "react";
import usePurchaseRequisitionUpdate from "./usePurchaseRequisitionUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const PurchaseRequisitionUpdate = ({
  handleClose,
  purchaseRequisition,
  handleUpdated,
}) => {
  const {
    formData,
    userLocations,
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
    loadingDraft,
    userDepartments,
    handleInputChange,
    handleDepartmentChange,
    handleItemDetailsChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalPrice,
    handleSelectItem,
    setSearchTerm,
  } = usePurchaseRequisitionUpdate({
    purchaseRequisition,
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
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            class="bi bi-arrow-left"
            onClick={handleClose}
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Purchase Requisition</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase requisition updated and submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase requisition saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting purchase requisition. Please try again.
        </div>
      )}

      <form>
        <div className="row g-3 mb-3 d-flex justify-content-between">
          {/* Requestor Information */}
          <div className="col-md-5">
            <h4>1. Requestor Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="requestorName" className="form-label">
                Requestor Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.requestorName ? "is-valid" : ""
                } ${validationErrors.requestorName ? "is-invalid" : ""}`}
                id="requestorName"
                placeholder="Enter requestor name"
                value={formData.requestorName}
                onChange={(e) =>
                  handleInputChange("requestorName", e.target.value)
                }
                required
              />
              {validationErrors.requestorName && (
                <div className="invalid-feedback">
                  {validationErrors.requestorName}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              {userDepartments.length > 1 ? (
                <select
                  className={`form-select ${
                    validFields.departmentLocation ? "is-valid" : ""
                  } ${validationErrors.departmentLocation ? "is-invalid" : ""}`}
                  id="department"
                  value={formData.departmentLocation}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {userDepartments.map((dept) => (
                    <option key={dept.locationId} value={dept.locationId}>
                      {dept.location.locationName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={`form-control ${
                    validFields.departmentLocation ? "is-valid" : ""
                  } ${validationErrors.departmentLocation ? "is-invalid" : ""}`}
                  id="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  required
                  disabled
                />
              )}
              {validationErrors.departmentLocation && (
                <div className="invalid-feedback">
                  {validationErrors.departmentLocation}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="expectedDeliveryLocation" className="form-label">
                Delivery Location
              </label>
              <select
                className={`form-select ${
                  validFields.expectedDeliveryLocation ? "is-valid" : ""
                } ${
                  validationErrors.expectedDeliveryLocation ? "is-invalid" : ""
                }`}
                id="expectedDeliveryLocation"
                value={formData?.expectedDeliveryLocation ?? ""}
                onChange={(e) =>
                  handleInputChange("expectedDeliveryLocation", e.target.value)
                }
              >
                <option value="">Select Location</option>
                {userLocations
                  // .filter(
                  //   (location) =>
                  //     location.locationType.name === "Warehouse" &&
                  //     location.parentId ===
                  //       parseInt(sessionStorage.getItem("locationId"))
                  // )
                  .filter((ul) => ul?.location?.locationTypeId === 2)
                  .map((ul) => (
                    <option key={ul.locationId} value={ul.locationId}>
                      {ul?.location?.locationName}
                    </option>
                  ))}
              </select>
              {validationErrors.expectedDeliveryLocation && (
                <div className="invalid-feedback">
                  {validationErrors.expectedDeliveryLocation}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${
                  validFields.email ? "is-valid" : ""
                } ${validationErrors.email ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {validationErrors.email && (
                <div className="invalid-feedback">{validationErrors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">
                Contact number
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.contactNumber ? "is-valid" : ""
                } ${validationErrors.contactNumber ? "is-invalid" : ""}`}
                id="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                required
              />
              {validationErrors.contactNumber && (
                <div className="invalid-feedback">
                  {validationErrors.contactNumber}
                </div>
              )}
            </div>
          </div>
          {/* Request Information */}
          <div className="col-md-5">
            <h4>2. Request Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="requisitionDate" className="form-label">
                Requisition Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.requisitionDate ? "is-valid" : ""
                } ${validationErrors.requisitionDate ? "is-invalid" : ""}`}
                id="requisitionDate"
                placeholder="Enter requisition date"
                value={formData.requisitionDate}
                onChange={(e) =>
                  handleInputChange("requisitionDate", e.target.value)
                }
                required
              />
              {validationErrors.requisitionDate && (
                <div className="invalid-feedback">
                  {validationErrors.requisitionDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="purposeOfRequest" className="form-label">
                Purpose of Request
              </label>
              <textarea
                className={`form-control ${
                  validFields.purposeOfRequest ? "is-valid" : ""
                } ${validationErrors.purposeOfRequest ? "is-invalid" : ""}`}
                placeholder="Enter purpose of request"
                id="purposeOfRequest"
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
              <label htmlFor="expectedDeliveryDate" className="form-label">
                Expected Delivery Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.expectedDeliveryDate ? "is-valid" : ""
                } ${validationErrors.expectedDeliveryDate ? "is-invalid" : ""}`}
                id="expectedDeliveryDate"
                placeholder="Enter delivery date"
                value={formData.expectedDeliveryDate}
                onChange={(e) =>
                  handleInputChange("expectedDeliveryDate", e.target.value)
                }
                required
              />
              {validationErrors.expectedDeliveryDate && (
                <div className="invalid-feedback">
                  {validationErrors.expectedDeliveryDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="referenceNumber" className="form-label">
                Reference Number
              </label>
              <input
                type="text"
                className="form-control"
                id="referenceNumber"
                placeholder="Enter reference number"
                value={formData.referenceNumber}
                onChange={(e) =>
                  handleInputChange("referenceNumber", e.target.value)
                }
                disabled
              />
            </div>
          </div>
        </div>

        {formData.selectedSupplier && (
          <div className="row g-3 mb-3 d-flex justify-content-between">
            {/* Supplier tagging */}
            <div className="col-md-5">
              <h4>Supplier Information</h4>
              <div className="mb-3 mt-3">
                <label htmlFor="supplier" className="form-label">
                  Supplier
                </label>
              </div>
              <div className="card mb-3">
                <div className="card-header">Selected Supplier</div>
                <div className="card-body">
                  <p>Supplier Name: {formData.selectedSupplier.supplierName}</p>
                  <p>
                    Contact Person: {formData.selectedSupplier.contactPerson}
                  </p>
                  <p>Phone: {formData.selectedSupplier.phone}</p>
                  <p>Email: {formData.selectedSupplier.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Item Details */}
        <h4>3. Item Details</h4>
        <div className="col-md-5">
          {/* Item Search */}
          <div className="mb-3 mt-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent ">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={formData.selectedSupplier}
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
            {/* Dropdown for filtered items */}
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
                  <th>Unit Price</th>
                  <th className="text-end">Total Price</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name || item.itemMaster?.itemName}</td>
                    <td>{item.unit || item.itemMaster?.unit.unitName}</td>
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
                        onWheel={(e) => e.target.blur()}
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
                      <input
                        type="number"
                        className="form-control"
                        value={item.unitPrice}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "unitPrice",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="text-end">{item.totalPrice.toFixed(2)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleRemoveItem(
                            index,
                            item?.purchaseRequisitionDetailId
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"></td>
                  <th>Total Amount</th>
                  <td className="text-end">
                    {calculateTotalPrice().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Attachments */}
        <h4>4. Attachments</h4>
        <div className="col-md-6 mb-3">
          <label htmlFor="attachment" className="form-label">
            Attachments (if any)
          </label>
          <input
            type="file"
            className={`form-control ${
              validFields.attachments ? "is-valid" : ""
            } ${validationErrors.attachments ? "is-invalid" : ""}`}
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
              loadingDraft ||
              submissionStatus !== null
            }
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Updating..." />
            ) : (
              "Update and Submit"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleSubmit(true)}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            {loadingDraft && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Saving as Draft..." />
            ) : (
              "Save as Draft"
            )}
          </button>
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handlePrint}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            Print
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseRequisitionUpdate;

import React from "react";
import usePurchaseRequisition from "./usePurchaseRequisition";
import CurrentDateTime from "../currentDateTime/currentDateTime";

const PurchaseRequisition = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    locations,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalPrice,
  } = usePurchaseRequisition({
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
          <img
            src="path/to/your/logo.png"
            alt="Company Logo"
            className="img-fluid"
          />
          <p>
            Date and Time: <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Purchase Requisition</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase requisition submitted successfully!
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
          <div className="col-md-5">
            {/* Requestor Information */}
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
              <input
                type="text"
                className={`form-control ${
                  validFields.department ? "is-valid" : ""
                } ${validationErrors.department ? "is-invalid" : ""}`}
                id="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                required
              />
              {validationErrors.department && (
                <div className="invalid-feedback">
                  {validationErrors.department}
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
          <div className="col-md-5">
            {/* Request Information */}
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
              <label htmlFor="deliveryDate" className="form-label">
                Delivery Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.deliveryDate ? "is-valid" : ""
                } ${validationErrors.deliveryDate ? "is-invalid" : ""}`}
                id="deliveryDate"
                placeholder="Enter delivery date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  handleInputChange("deliveryDate", e.target.value)
                }
                required
              />
              {validationErrors.deliveryDate && (
                <div className="invalid-feedback">
                  {validationErrors.deliveryDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="deliveryLocation" className="form-label">
                Delivery Location
              </label>
              <select
                className={`form-select ${
                  validFields.deliveryLocation ? "is-valid" : ""
                } ${validationErrors.deliveryLocation ? "is-invalid" : ""}`}
                id="deliveryLocation"
                value={formData?.deliveryLocation ?? ""}
                onChange={(e) =>
                  handleInputChange("deliveryLocation", e.target.value)
                }
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
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
            <div className="mb-3">
              <label htmlFor="referenceNumber" className="form-label">
                Reference Number (if applicable)
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
              />
            </div>
          </div>
        </div>

        {/* Item Details */}
        <h4>3. Item Details</h4>
        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Item Category</th>
                  <th>Item ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.category}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "category",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.id}
                        onChange={(e) =>
                          handleItemDetailsChange(index, "id", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.name}
                        onChange={(e) =>
                          handleItemDetailsChange(index, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "unitPrice",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>{item.totalPrice.toFixed(2)}</td>
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
              <tfoot>
                <tr>
                  <td colSpan="4"></td>
                  <th>Total Amount</th>
                  <td colSpan="2">{calculateTotalPrice().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={handleAddItem}
        >
          Add Item
        </button>

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
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleSubmit(true)}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handlePrint}
          >
            Print
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

export default PurchaseRequisition;

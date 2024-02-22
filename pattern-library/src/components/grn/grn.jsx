import React from "react";
import useGrn from "./useGrn";
import CurrentDateTime from "../currentDateTime/currentDateTime";

const Grn = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    purchaseOrderOptions,
    statusOptions,
    alertRef,
    handleInputChange,
    handleItemDetailsChange,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
    handlePurchaseOrderChange,
    handleStatusChange,
  } = useGrn({
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
        <h1 className="mt-2 text-center">Goods Received Note</h1>
        <hr />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          GRN submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          GRN saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting GRN. Please try again.
        </div>
      )}

      <form>
        {/* GRN Information */}
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. GRN Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                GRN Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.grnDate ? "is-valid" : ""
                } ${validationErrors.grnDate ? "is-invalid" : ""}`}
                id="grnDate"
                placeholder="Enter GRN date"
                value={formData.grnDate}
                onChange={(e) => handleInputChange("grnDate", e.target.value)}
                required
              />
              {validationErrors.grnDate && (
                <div className="invalid-feedback">
                  {validationErrors.grnDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="receivedBy" className="form-label">
                Received By
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.receivedBy ? "is-valid" : ""
                } ${validationErrors.receivedBy ? "is-invalid" : ""}`}
                id="receivedBy"
                placeholder="Enter name"
                value={formData.receivedBy}
                onChange={(e) =>
                  handleInputChange("receivedBy", e.target.value)
                }
                required
              />
              {validationErrors.receivedBy && (
                <div className="invalid-feedback">
                  {validationErrors.receivedBy}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="receivedDate" className="form-label">
                Received Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.receivedDate ? "is-valid" : ""
                } ${validationErrors.receivedDate ? "is-invalid" : ""}`}
                id="receivedDate"
                placeholder="Enter received date"
                value={formData.receivedDate}
                onChange={(e) =>
                  handleInputChange("receivedDate", e.target.value)
                }
                required
              />
              {validationErrors.receivedDate && (
                <div className="invalid-feedback">
                  {validationErrors.receivedDate}
                </div>
              )}
            </div>
            {/* Status Dropdown */}
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`form-select ${
                  validFields.status ? "is-valid" : ""
                } ${validationErrors.status ? "is-invalid" : ""}`}
                value={formData.status}
                onChange={(e) =>
                  handleStatusChange(
                    statusOptions.find((option) => option.id === e.target.value)
                  )
                }
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {validationErrors.status && (
                <div className="invalid-feedback">
                  {validationErrors.status}
                </div>
              )}
            </div>
          </div>

          {/* Purchase Order ID Selection */}
          <div className="col-md-5">
            <h4>2. Purchase Order Details</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="purchaseOrder" className="form-label">
                Purchase Order Reference No
              </label>
              <select
                id="purchaseOrder"
                className={`form-select ${
                  validFields.purchaseOrderId ? "is-valid" : ""
                } ${validationErrors.purchaseOrderId ? "is-invalid" : ""}`}
                // value={formData.purchaseOrderId}
                onChange={(e) => handlePurchaseOrderChange(e.target.value)}
                required
              >
                <option value="">Select Reference Number</option>
                {purchaseOrderOptions.map((option) => (
                  <option key={option.referenceNo} value={option.referenceNo}>
                    {option.referenceNo}
                  </option>
                ))}
              </select>
              {validationErrors.purchaseOrderId && (
                <div className="invalid-feedback">
                  {validationErrors.purchaseOrderId}
                </div>
              )}
            </div>

            {/* Display selected Purchase Order details */}
            {selectedPurchaseOrder && (
              <div className="mb-3">
                <p>Supplier: {selectedPurchaseOrder?.supplier?.supplierName}</p>
                <p>
                  Order Date:{" "}
                  {selectedPurchaseOrder?.orderDate?.split("T")[0] ?? ""}
                </p>
                <p>
                  Delivery Date:{" "}
                  {selectedPurchaseOrder?.deliveryDate?.split("T")[0] ?? ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Item Details */}
        <h4>2. Item Details</h4>
        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Received Quantity</th>
                  <th>Accepted Quantity</th>
                  <th>Rejected Quantity</th>
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
                        value={item.id}
                        onChange={(e) =>
                          handleItemDetailsChange(index, "id", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.receivedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "receivedQuantity",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.acceptedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "acceptedQuantity",
                            e.target.value
                          )
                        }
                        max={item.receivedQuantity}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.receivedQuantity - item.acceptedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "rejectedQuantity",
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
                  <td colSpan="2">{calculateTotalAmount().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Add button to add more items */}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={handleAddItem}
        >
          Add Item
        </button>

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

export default Grn;

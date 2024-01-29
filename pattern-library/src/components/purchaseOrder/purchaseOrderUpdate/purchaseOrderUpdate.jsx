import React from "react";
import usePurchaseOrderUpdate from "./usePurchaseOrderUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";

const PurchaseOrderUpdate = ({ handleClose, purchaseOrder, handleUpdated }) => {
  const {
    formData,
    suppliers,
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
    calculateTotalAmount,
    handleSupplierChange,
  } = usePurchaseOrderUpdate({
    purchaseOrder,
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
        <h1 className="mt-2 text-center">Purchase Order</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase order submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase order updated and saved as draft, you can edit and submit it
          later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting purchase Order. Please try again.
        </div>
      )}
      <form>
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Supplier Information */}
            <h4>1. Supplier Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="supplierId" className="form-label">
                Supplier Name
              </label>
              <select
                className={`form-select ${
                  validFields.supplierId ? "is-valid" : ""
                } ${validationErrors.supplierId ? "is-invalid" : ""}`}
                id="supplierId"
                value={formData?.supplierId ?? ""}
                onChange={(e) => handleSupplierChange(e.target.value)}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
              {validationErrors.supplierId && (
                <div className="invalid-feedback">
                  {validationErrors.supplierId}
                </div>
              )}
            </div>

            {/* Additional Supplier Information */}
            {formData.selectedSupplier && (
              <div className="mb-3">
                <p>Contact Person: {formData.selectedSupplier.contactPerson}</p>
                <p>Phone: {formData.selectedSupplier.phone}</p>
                <p>Email: {formData.selectedSupplier.email}</p>
              </div>
            )}
          </div>

          <div className="col-md-5">
            {/* Order Information */}
            <h4>2. Order Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="orderDate" className="form-label">
                Order Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.orderDate ? "is-valid" : ""
                } ${validationErrors.orderDate ? "is-invalid" : ""}`}
                id="orderDate"
                placeholder="Enter order date"
                value={formData.orderDate}
                onChange={(e) => handleInputChange("orderDate", e.target.value)}
                required
              />
              {validationErrors.orderDate && (
                <div className="invalid-feedback">
                  {validationErrors.orderDate}
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
                        value={item.itemCategory}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "itemCategory",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.itemId}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "itemId",
                            e.target.value
                          )
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
                        onClick={() =>
                          handleRemoveItem(index, item?.purchaseOrderDetailId)
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
                  <td colSpan="4"></td>
                  <th>Total Amount</th>
                  <td colSpan="2">{calculateTotalAmount().toFixed(2)}</td>
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

export default PurchaseOrderUpdate;

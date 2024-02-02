import React from "react";
import useSalesOrder from "./useSalesOrder";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import Customer from "../customer/customer";

const SalesOrder = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    customers,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    showCreateCustomerModal,
    showCreateCustomerMoalInParent,
    directOrder,
    handleShowCreateCustomerModal,
    handleCloseCreateCustomerModal,
    handleInputChange,
    handleCustomerChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    handleAddCustomer,
    setDirectOrder,
  } = useSalesOrder({
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
        <h1 className="mt-2 text-center">Sales Order</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales order submitted successfully! Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales order saved as draft, you can edit and submit it later!
          Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting sales order. Please try again.
        </div>
      )}

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. Order Type and Customer Details</h4>
            {/* Order Type */}
            <div className="mb-3 mt-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="directOrderCheckbox"
                checked={directOrder}
                onChange={() => setDirectOrder(!directOrder)}
              />
              <label className="form-check-label" htmlFor="directOrderCheckbox">
                Direct Order (No Customer Selection)
              </label>
            </div>

            {/* Customer Information */}
            {!directOrder && (
              <div>
                <div className="mb-3 mt-3">
                  <label htmlFor="customerId" className="form-label">
                    Customer
                  </label>
                  <select
                    className={`form-select ${
                      validFields.customerId ? "is-valid" : ""
                    } ${validationErrors.customerId ? "is-invalid" : ""}`}
                    id="customerId"
                    value={formData?.customerId ?? ""}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option
                        key={customer.customerId}
                        value={customer.customerId}
                      >
                        {`${customer.customerName} - ${customer.customerId}`}
                      </option>
                    ))}
                  </select>
                  {validationErrors.customerId && (
                    <div className="invalid-feedback">
                      {validationErrors.customerId}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Customer Information */}
            {!directOrder && formData.selectedCustomer && (
              <div className="mb-3">
                <p>Name: {formData.selectedCustomer.customerName}</p>
                <p>Contact Person: {formData.selectedCustomer.contactPerson}</p>
                <p>Phone: {formData.selectedCustomer.phone}</p>
                <p>Email: {formData.selectedCustomer.email}</p>
              </div>
            )}

            {/* Add New Customer Option */}
            {!directOrder && !formData.selectedCustomer && (
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleShowCreateCustomerModal}
                >
                  Add New Customer
                </button>
                <p className="text-muted">
                  If the customer is not found, you can add a new one.
                </p>
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
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Batch Name</th>
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
                        value={item.itemMasterId}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "itemMasterId",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.itemBatchId}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "itemBatchId",
                            e.target.value
                          )
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
                  <td colSpan="3"></td>
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
      {showCreateCustomerMoalInParent && (
        <Customer
          show={showCreateCustomerModal}
          handleClose={handleCloseCreateCustomerModal}
          handleAddCustomer={handleAddCustomer}
        />
      )}
    </div>
  );
};

export default SalesOrder;

import React from "react";
import useSalesReceiptUpdate from "./useSalesReceiptUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ConfirmationModal from "../../confirmationModals/confirmationModal/confirmationModal";

const SalesReceiptUpdate = ({ handleClose, salesReceipt, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    paymentModes,
    salesInvoiceOptions,
    showPaymentRemovalConfirmation,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleSalesInvoiceChange,
    handleRemoveSalesInvoice,
    handleClosePaymentRemovalConfirmation,
    handleConfirmPaymentRemoval,
    handleRemovePayment,
  } = useSalesReceiptUpdate({
    salesReceipt,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  return (
    <>
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
          <h1 className="mt-2 text-center">Sales Receipt</h1>
          <hr />
        </div>

        {/* Display success or error messages */}
        {submissionStatus === "successSubmitted" && (
          <div className="alert alert-success mb-3" role="alert">
            Sales receipt updated successfully!
          </div>
        )}
        {submissionStatus === "successSavedAsDraft" && (
          <div className="alert alert-success mb-3" role="alert">
            Sales receipt updated and saved as draft, you can edit and create it
            later!
          </div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error creating sales receipt. Please try again.
          </div>
        )}
        <form>
          <div className="row mb-3 d-flex justify-content-between">
            <div className="col-md-5">
              {/* Receipt Information */}
              <h4>1. Receipt Information</h4>
              <div className="mb-3 mt-3">
                <label htmlFor="receiptDate" className="form-label">
                  Receipt Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    validFields.receiptDate ? "is-valid" : ""
                  } ${validationErrors.receiptDate ? "is-invalid" : ""}`}
                  id="receiptDate"
                  placeholder="Enter receipt date"
                  value={formData.receiptDate}
                  onChange={(e) =>
                    handleInputChange("receiptDate", e.target.value)
                  }
                  required
                />
                {validationErrors.receiptDate && (
                  <div className="invalid-feedback">
                    {validationErrors.receiptDate}
                  </div>
                )}
              </div>

              {/* Payment Mode */}
              <div className="mb-3">
                <label htmlFor="paymentMode" className="form-label">
                  Payment Mode
                </label>
                <select
                  id="paymentMode"
                  className={`form-select ${
                    validFields.paymentModeId ? "is-valid" : ""
                  } ${validationErrors.paymentModeId ? "is-invalid" : ""}`}
                  onChange={(e) =>
                    handleInputChange("paymentModeId", e.target.value)
                  }
                  value={formData.paymentModeId}
                  required
                >
                  <option value="">Select Payment Mode</option>
                  {/* Populate payment modes dynamically */}
                  {paymentModes.map((mode) => (
                    <option key={mode.paymentModeId} value={mode.paymentModeId}>
                      {mode.mode}
                    </option>
                  ))}
                </select>
                {validationErrors.paymentModeId && (
                  <div className="invalid-feedback">
                    {validationErrors.paymentModeId}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="referenceNo" className="form-label">
                  Reference No
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.referenceNo ? "is-valid" : ""
                  } ${validationErrors.referenceNo ? "is-invalid" : ""}`}
                  id="referenceNo"
                  placeholder="Enter reference number"
                  value={formData.referenceNo}
                  onChange={(e) =>
                    handleInputChange("referenceNo", e.target.value)
                  }
                  required
                />
                {validationErrors.referenceNo && (
                  <div className="invalid-feedback">
                    {validationErrors.referenceNo}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-5">
              <h4>2. Sales Invoices</h4>
              <div className="mb-3 mt-3">
                <label htmlFor="salesInvoice" className="form-label">
                  Sales Invoice Reference No
                </label>
                <select
                  id="salesInvoice"
                  className={`form-select ${
                    validFields.salesInvoiceId ? "is-valid" : ""
                  } ${validationErrors.salesInvoiceId ? "is-invalid" : ""}`}
                  onChange={(e) => handleSalesInvoiceChange(e.target.value)}
                  value={""}
                  required
                >
                  <option value="">Select Reference Number</option>
                  {/* Options */}
                  {salesInvoiceOptions.map((option) => (
                    <option key={option.referenceNo} value={option.referenceNo}>
                      {option.referenceNo}
                    </option>
                  ))}
                </select>
                {validationErrors.salesInvoiceId && (
                  <div className="invalid-feedback mb-3">
                    {validationErrors.salesInvoiceId}
                  </div>
                )}
                {formData.salesInvoiceReferenceNumbers.length > 0 && (
                  <label htmlFor="salesInvoice" className="form-label mt-3">
                    Selected Sales Invoice Reference Numbers
                  </label>
                )}
                {/* Display selected reference numbers */}
                <ul className="list-group mt-2">
                  {formData.salesInvoiceReferenceNumbers.map((referenceNo) => (
                    <li
                      key={referenceNo}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {referenceNo}
                      <button
                        className="btn  btn-outline-danger btn-sm"
                        onClick={() => handleRemovePayment(referenceNo)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Payments */}
          <h4>3. Payments</h4>
          {!formData.selectedSalesInvoices.length > 0 && (
            <div className="mb-3">
              {" "}
              <small className="form-text text-muted">
                Please select sales invoices to make payment
              </small>
            </div>
          )}
          {formData.selectedSalesInvoices.length > 0 && (
            <div className="table-responsive mb-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>SI Ref No</th>
                    <th>Invoice Total</th>
                    <th>Amount Due</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.selectedSalesInvoices.map((item, index) => (
                    <tr key={index}>
                      <td>{item.referenceNo}</td>
                      <td>{item.totalAmount.toFixed(2)}</td>
                      <td>{(item.amountDue - item.payment).toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          className={`form-control ${
                            validFields[`payment_${index}`] ? "is-valid" : ""
                          } ${
                            validationErrors[`payment_${index}`]
                              ? "is-invalid"
                              : ""
                          }`}
                          value={item.payment}
                          onChange={(e) =>
                            handleItemDetailsChange(
                              index,
                              "payment",
                              e.target.value
                            )
                          }
                        />
                        {validationErrors[`payment_${index}`] && (
                          <div className="invalid-feedback">
                            {validationErrors[`payment_${index}`]}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2"></td>
                    <th>Total Amount Received</th>
                    <td colSpan="2">{calculateTotalAmount().toFixed(2)}</td>
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
            <small className="form-text text-muted">
              File size limit: 10MB
            </small>
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
              Create
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
      {/* Confirmation modal */}
      <ConfirmationModal
        show={showPaymentRemovalConfirmation}
        handleClose={handleClosePaymentRemovalConfirmation}
        handleConfirm={handleConfirmPaymentRemoval}
        title="Confirm Payment Removal"
        message="Removing this payment will permanently delete it from the record. You won't be able to add it back. If you simply want to change the payment amount, you can adjust it below without removing."
        confirmButtonText="Confirm Removal"
        cancelButtonText="Cancel"
      />
    </>
  );
};

export default SalesReceiptUpdate;

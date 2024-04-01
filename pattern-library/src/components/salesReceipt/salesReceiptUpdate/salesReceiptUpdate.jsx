import React from "react";
import useSalesReceiptUpdate from "./useSalesReceiptUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ConfirmationModal from "../../confirmationModals/confirmationModal/confirmationModal";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

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
    isSalesInvoiceOptionsLoading,
    isSalesInvoiceOptionsError,
    salesInvoiceOptionsError,
    isPaymentModesLoading,
    isPaymentModesError,
    paymentModesError,
    siSearchTerm,
    loading,
    loadingDraft,
    selectedInvoiceIdToFilter,
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
    setSiSearchTerm,
    calculateTotalAmountReceived,
    calculateTotalExcessAmountAmount,
    calculateTotalShortAmountAmount,
  } = useSalesReceiptUpdate({
    salesReceipt,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

  if (isPaymentModesLoading || isSalesInvoiceOptionsLoading) {
    return <LoadingSpinner />;
  }

  if (isPaymentModesError || isSalesInvoiceOptionsError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <>
      <div className="container mt-4">
        {/* Header */}
        <div className="mb-4">
          <div ref={alertRef}></div>
          <div className="d-flex justify-content-between">
            <img src={companyLogoUrl} alt="Company Logo" height={30} />
            <p>
              <CurrentDateTime />
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
                  Payment Reference No
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.referenceNo ? "is-valid" : ""
                  } ${validationErrors.referenceNo ? "is-invalid" : ""}`}
                  id="referenceNo"
                  placeholder="Enter payment reference number"
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
                <label htmlFor="salesInvoices" className="form-label">
                  Sales Invoice
                </label>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent ">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${
                        validFields.trnId ? "is-valid" : ""
                      } ${validationErrors.trnId ? "is-invalid" : ""}`}
                      placeholder="Search for a sales invoice..."
                      value={siSearchTerm}
                      onChange={(e) => setSiSearchTerm(e.target.value)}
                      autoFocus={false}
                    />
                    {siSearchTerm && (
                      <span
                        className="input-group-text bg-transparent"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setSiSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </span>
                    )}
                  </div>

                  {/* Dropdown for filtered suppliers */}
                  {siSearchTerm && (
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
                        {salesInvoiceOptions
                          .filter(
                            (si) =>
                              si.referenceNo
                                ?.replace(/\s/g, "")
                                ?.toLowerCase()
                                .includes(
                                  siSearchTerm.toLowerCase().replace(/\s/g, "")
                                ) &&
                              !selectedInvoiceIdToFilter?.includes(
                                si.referenceNo
                              )
                          )
                          .map((si) => (
                            <li key={si.salesInvoiceId}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() =>
                                  handleSalesInvoiceChange(si.referenceNo)
                                }
                              >
                                <span className="me-3">
                                  <i className="bi bi-file-earmark-text"></i>
                                </span>{" "}
                                {si?.referenceNo}
                              </button>
                            </li>
                          ))}
                        {salesInvoiceOptions.filter(
                          (si) =>
                            si.referenceNo
                              ?.replace(/\s/g, "")
                              ?.toLowerCase()
                              .includes(
                                siSearchTerm.toLowerCase().replace(/\s/g, "")
                              ) &&
                            !selectedInvoiceIdToFilter?.includes(si.referenceNo)
                        ).length === 0 && (
                          <li className="dropdown-item text-center">
                            <span className="me-3">
                              <i className="bi bi-emoji-frown"></i>
                            </span>
                            No sales invoices found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  {formData.selectedSalesInvoices?.length === 0 && (
                    <div className="mb-3">
                      <small className="form-text text-muted">
                        {validationErrors.salesInvoiceId && (
                          <div className="invalid-feedback mb-3">
                            {validationErrors.salesInvoiceId}
                          </div>
                        )}
                        Please search for a sales invoice and select it
                      </small>
                    </div>
                  )}
                </div>

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
                        type="button"
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
                    <th>Ref Number</th>
                    <th>Invoice Total</th>
                    <th>Amount Due</th>
                    <th>Excess Amount</th>
                    <th>Short Amount</th>
                    <th>Amount Received</th>
                    <th className="text-end">Customer Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.selectedSalesInvoices.map((item, index) => (
                    <tr key={index}>
                      <td>{item.referenceNo}</td>
                      <td>{item?.referenceNumber}</td>
                      <td>{item.totalAmount.toFixed(2)}</td>
                      <td>{item.amountDue.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.excessAmount}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            const positiveValue = isNaN(value)
                              ? 0
                              : Math.max(0, value);

                            handleItemDetailsChange(
                              index,
                              "excessAmount",
                              positiveValue
                            );
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.shortAmount}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            const positiveValue = isNaN(value)
                              ? 0
                              : Math.max(0, value);

                            handleItemDetailsChange(
                              index,
                              "shortAmount",
                              positiveValue
                            );
                          }}
                        />
                      </td>
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
                      <td className="text-end">
                        {item.customerBalance?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6"></td>
                    <th>Total Excess Amount</th>
                    <td className="text-end">
                      {calculateTotalExcessAmountAmount().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <th>Total Short Amount</th>
                    <td className="text-end">
                      {calculateTotalShortAmountAmount().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <th>Total Amount Received</th>
                    <td className="text-end">
                      {calculateTotalAmount().toFixed(2)}
                    </td>
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
              disabled={
                !formData.selectedSalesInvoices?.length > 0 ||
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
              disabled={
                !formData.selectedSalesInvoices?.length > 0 ||
                loading ||
                loadingDraft ||
                submissionStatus !== null
              }
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

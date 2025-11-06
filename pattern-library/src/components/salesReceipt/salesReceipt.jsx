import React, { useState } from "react";
import useSalesReceipt from "./useSalesReceipt";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import useFormatCurrency from "../salesInvoice/helperMethods/useFormatCurrency";

const SalesReceipt = ({ handleClose, handleUpdated }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDraftSubmission, setIsDraftSubmission] = useState(false);

  const {
    formData,
    paymentModes,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    salesInvoiceOptions,
    isSalesInvoiceOptionsLoading,
    isSalesInvoiceOptionsError,
    salesInvoiceOptionsError,
    selectedsalesInvoice,
    isPaymentModesLoading,
    isPaymentModesError,
    paymentModesError,
    siSearchTerm,
    loading,
    loadingDraft,
    handleInputChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
    handleSalesInvoiceChange,
    handleRemoveSalesInvoice,
    setSiSearchTerm,
    calculateTotalAmountReceived,
    calculateTotalExcessAmountAmount,
    calculateTotalOutstandingAmountAmount,
    handleAddToExcess,
    calculateTotalAmountCollected,
  } = useSalesReceipt({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const formatTotals = useFormatCurrency({ showCurrency: false });

  const handleSubmitClick = (isSaveAsDraft) => {
    setIsDraftSubmission(isSaveAsDraft);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit(isDraftSubmission);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
    setIsDraftSubmission(false);
  };

  const getSelectedPaymentMode = () => {
    const mode = paymentModes?.find(
      (pm) => pm.paymentModeId === formData.paymentModeId
    );
    return mode?.mode || "N/A";
  };

  if (isPaymentModesLoading || isSalesInvoiceOptionsLoading) {
    return <LoadingSpinner />;
  }

  if (isPaymentModesError || isSalesInvoiceOptionsError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <div ref={alertRef}></div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              onClick={handleClose}
              className="btn btn-dark d-flex align-items-center gap-2 px-3"
              type="button"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="text-muted small">
              <i className="bi bi-clock me-2"></i>
              <CurrentDateTime />
            </div>
          </div>
          <div className="text-center">
            <h1 className="h2 fw-bold text-dark mb-1">Sales Receipt</h1>
          </div>
        </div>

        {/* Status Messages */}
        {submissionStatus === "successSubmitted" && (
          <div
            className="alert alert-success d-flex align-items-center shadow-sm mb-4"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-3 fs-4"></i>
            <div>
              <strong>Success!</strong> Sales receipt created successfully.
            </div>
          </div>
        )}
        {submissionStatus === "successSavedAsDraft" && (
          <div
            className="alert alert-info d-flex align-items-center shadow-sm mb-4"
            role="alert"
          >
            <i className="bi bi-save-fill me-3 fs-4"></i>
            <div>
              <strong>Saved as Draft!</strong> You can edit and create it later.
            </div>
          </div>
        )}
        {submissionStatus === "error" && (
          <div
            className="alert alert-danger d-flex align-items-center shadow-sm mb-4"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
            <div>
              <strong>Error!</strong> Failed to submit sales receipt. Please try
              again.
            </div>
          </div>
        )}

        <form>
          {/* Section 1 & 2: Receipt Info and Sales Invoices */}
          <div className="row g-4 mb-4">
            {/* Receipt Information */}
            <div className="col-lg-6">
              <div className="card shadow-sm mb-3 flex-fill h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-file-text me-2"></i>1. Receipt
                    Information
                  </h5>
                </div>

                <div className="card-body">
                  <div className="mb-4">
                    <label
                      htmlFor="receiptDate"
                      className="form-label fw-semibold small text-secondary mb-2"
                    >
                      Receipt Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        validFields.receiptDate ? "is-valid" : ""
                      } ${validationErrors.receiptDate ? "is-invalid" : ""}`}
                      id="receiptDate"
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

                  <div className="mb-4">
                    <label
                      htmlFor="paymentMode"
                      className="form-label fw-semibold small text-secondary mb-2"
                    >
                      Payment Mode <span className="text-danger">*</span>
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
                      {paymentModes.map((mode) => (
                        <option
                          key={mode.paymentModeId}
                          value={mode.paymentModeId}
                        >
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

                  <div className="mb-0">
                    <label
                      htmlFor="referenceNo"
                      className="form-label fw-semibold small text-secondary mb-2"
                    >
                      Payment Reference No{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        validFields.paymentReference ? "is-valid" : ""
                      } ${
                        validationErrors.paymentReference ? "is-invalid" : ""
                      }`}
                      id="paymentReference"
                      placeholder="Enter payment reference number"
                      value={formData.referenceNo}
                      onChange={(e) =>
                        handleInputChange("referenceNo", e.target.value)
                      }
                      required
                    />
                    {validationErrors.paymentReference && (
                      <div className="invalid-feedback">
                        {validationErrors.paymentReference}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Invoices */}
            <div className="col-lg-6">
              <div className="card shadow-sm mb-3 flex-fill h-100">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-box-seam me-2"></i>2. Sales Invoices
                  </h5>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <label
                      htmlFor="salesInvoices"
                      className="form-label fw-semibold small text-secondary mb-2"
                    >
                      Search & Select Invoice{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ${
                          validFields.trnId ? "is-valid" : ""
                        } ${validationErrors.trnId ? "is-invalid" : ""}`}
                        placeholder="Search for a sales invoice..."
                        value={siSearchTerm}
                        onChange={(e) => setSiSearchTerm(e.target.value)}
                        autoFocus={false}
                      />
                      {siSearchTerm && (
                        <button
                          className="btn btn-outline-secondary border-start-0"
                          type="button"
                          onClick={() => setSiSearchTerm("")}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>

                    {siSearchTerm && (
                      <div className="dropdown position-relative mt-1">
                        <ul className="dropdown-menu show w-100 shadow-sm border-0 rounded-3 overflow-hidden">
                          {salesInvoiceOptions
                            .filter((si) =>
                              si.referenceNo
                                ?.replace(/\s/g, "")
                                ?.toLowerCase()
                                .includes(
                                  siSearchTerm.toLowerCase().replace(/\s/g, "")
                                )
                            )
                            .map((si) => (
                              <li key={si.salesInvoiceId}>
                                <button
                                  type="button"
                                  className="dropdown-item d-flex align-items-center py-2"
                                  onClick={() =>
                                    handleSalesInvoiceChange(si.referenceNo)
                                  }
                                >
                                  <i className="bi bi-file-earmark-text text-primary me-3"></i>
                                  <span>{si?.referenceNo}</span>
                                </button>
                              </li>
                            ))}
                          {salesInvoiceOptions.filter((si) =>
                            si.referenceNo
                              ?.replace(/\s/g, "")
                              ?.toLowerCase()
                              .includes(
                                siSearchTerm.toLowerCase().replace(/\s/g, "")
                              )
                          ).length === 0 && (
                            <li className="dropdown-item text-center py-3 text-muted">
                              <i className="bi bi-emoji-frown me-2"></i>
                              No sales invoices found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {formData.selectedSalesInvoices?.length === 0 && (
                      <div className="mt-2">
                        {validationErrors.salesInvoiceId && (
                          <small className="text-danger d-block mb-1">
                            {validationErrors.salesInvoiceId}
                          </small>
                        )}
                        <small className="text-muted">
                          Please search for a sales invoice and select it
                        </small>
                      </div>
                    )}
                  </div>

                  {formData.salesInvoiceReferenceNumbers.length > 0 && (
                    <>
                      <label className="form-label fw-semibold small text-secondary mb-2 mt-4">
                        Selected Invoices (
                        {formData.salesInvoiceReferenceNumbers.length})
                      </label>
                      <ul className="list-group">
                        {formData.selectedSalesInvoices.map((si) => (
                          <li
                            key={si.salesInvoiceId}
                            className="list-group-item d-flex justify-content-between align-items-center px-3 py-2 border rounded mb-2"
                            style={{ backgroundColor: "#f8f9fa" }}
                          >
                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                              <i className="bi bi-check-square-fill text-success fs-5"></i>

                              <div className="d-flex align-items-center gap-4 flex-grow-1">
                                <span className="fw-semibold text-dark">
                                  {si.referenceNo}
                                </span>
                                <span className="text-muted flex-grow-1">
                                  {si.customer.customerName}
                                </span>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleRemoveSalesInvoice(si.referenceNo)
                              }
                              type="button"
                              title="Remove"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payments */}
          <div className="card shadow-sm mb-3 flex-fill h-100">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="bi bi-currency-exchange me-2"></i>3. Payments
              </h5>
            </div>

            <div className="card-body">
              {!formData.selectedSalesInvoices.length > 0 ? (
                <div
                  className="alert alert-warning d-flex align-items-center mb-0"
                  role="alert"
                >
                  <i className="bi bi-info-circle-fill me-3"></i>
                  <span>Please select sales invoices to make payment</span>
                </div>
              ) : (
                <div className="table-responsive">
                  <div
                    className="alert alert-info d-flex align-items-start mb-3 py-2 small"
                    role="alert"
                  >
                    <i className="bi bi-info-circle me-2 mt-1"></i>
                    <div>
                      <strong>Tip:</strong> When Amount Received exceeds Amount
                      Due, the Customer Balance shows the excess. Click{" "}
                      <strong>"Add"</strong> to apply it to the Excess Amount
                      column.
                    </div>
                  </div>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold small">SI Ref No</th>
                        <th className="fw-semibold small">Ref Number</th>
                        <th className="fw-semibold small">Invoice Total</th>
                        <th className="fw-semibold small">Amount Due</th>
                        <th className="fw-semibold small">Excess Amount</th>
                        <th className="fw-semibold small">
                          Outstanding Amount
                        </th>
                        <th className="fw-semibold small">Amount Received</th>
                        <th className="fw-semibold small text-end">
                          Customer Balance
                        </th>
                        <th
                          className="fw-semibold small text-center"
                          style={{ width: "100px" }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.selectedSalesInvoices.map((item, index) => (
                        <tr key={index}>
                          <td className="small">{item.referenceNo}</td>
                          <td className="small">{item?.referenceNumber}</td>
                          <td className="small">
                            {formatTotals(item.totalAmount.toFixed(2))}
                          </td>
                          <td className="small">
                            {formatTotals(item.amountDue.toFixed(2))}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={item.excessAmount.toFixed(2)}
                              onChange={(e) => {
                                const value = e.target.value;
                                const positiveValue = isNaN(value)
                                  ? 0
                                  : Math.max(0, value);
                                handleItemDetailsChange(
                                  index,
                                  "excessAmount",
                                  positiveValue
                                );
                              }}
                              step={0.01}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={item.outstandingAmount.toFixed(2)}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                const positiveValue = isNaN(value)
                                  ? 0
                                  : Math.max(0, value);
                                handleItemDetailsChange(
                                  index,
                                  "outstandingAmount",
                                  positiveValue
                                );
                              }}
                              step={0.01}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className={`form-control form-control-sm ${
                                validFields[`payment_${index}`]
                                  ? "is-valid"
                                  : ""
                              } ${
                                validationErrors[`payment_${index}`]
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={item.payment}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                const positiveValue = isNaN(value)
                                  ? 0
                                  : Math.max(0, value);
                                handleItemDetailsChange(
                                  index,
                                  "payment",
                                  positiveValue
                                );
                              }}
                              step={0.01}
                            />
                            {validationErrors[`payment_${index}`] && (
                              <div className="invalid-feedback small">
                                {validationErrors[`payment_${index}`]}
                              </div>
                            )}
                          </td>
                          <td className="text-end">
                            <span
                              className={`fw-semibold ${
                                item.customerBalance > 0
                                  ? "text-success"
                                  : "text-muted"
                              }`}
                            >
                              {formatTotals(item.customerBalance.toFixed(2))}
                            </span>
                            {item.customerBalance > 0 && (
                              <i
                                className="bi bi-arrow-right text-success ms-1"
                                title="Excess available"
                              ></i>
                            )}
                          </td>
                          <td className="text-center">
                            {item.customerBalance > 0 ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                onClick={() => handleAddToExcess(index)}
                                title={`Add ${formatTotals(
                                  item.customerBalance.toFixed(2)
                                )} to excess amount`}
                              >
                                <i className="bi bi-plus-circle"></i>
                                <span className="d-none d-lg-inline">Add</span>
                              </button>
                            ) : (
                              <i
                                className="bi bi-check-circle-fill text-success fs-5"
                                title="Payment settled"
                              ></i>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light border-top">
                      <tr>
                        <td colSpan="8" className="text-end fw-semibold">
                          Total Excess Amount:
                        </td>
                        <td className="fw-bold">
                          {formatTotals(
                            calculateTotalExcessAmountAmount().toFixed(2)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="8" className="text-end fw-semibold">
                          Total Outstanding Amount:
                        </td>
                        <td className="fw-bold">
                          {formatTotals(
                            calculateTotalOutstandingAmountAmount().toFixed(2)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="8" className="text-end fw-semibold">
                          Total Amount Received:
                        </td>
                        <td className="fw-bold">
                          {formatTotals(calculateTotalAmount().toFixed(2))}
                        </td>
                      </tr>
                      <tr className="table-primary">
                        <td colSpan="8" className="text-end fw-bold">
                          Total Amount Collected:
                        </td>
                        <td className="fw-bold fs-6">
                          {formatTotals(
                            calculateTotalAmountCollected().toFixed(2)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Attachments */}
          <div className="card shadow-sm mb-3 flex-fill h-100">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-paperclip me-2"></i>4. Attachments
              </h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-lg-6">
                  <label
                    htmlFor="attachment"
                    className="form-label fw-semibold small text-secondary mb-2"
                  >
                    Upload Files (Optional)
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
                  <small className="form-text text-muted d-block mt-1">
                    <i className="bi bi-info-circle me-1"></i>
                    File size limit: 10MB
                  </small>
                  {validationErrors.attachments && (
                    <div className="invalid-feedback">
                      {validationErrors.attachments}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 justify-content-start">
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={() => handleSubmitClick(false)}
                  disabled={
                    !formData.selectedSalesInvoices?.length > 0 ||
                    loading ||
                    loadingDraft ||
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
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => handleSubmitClick(true)}
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
                    <>
                      <i className="bi bi-save me-2"></i>
                      Save as Draft
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={handlePrint}
                  disabled={
                    loading || loadingDraft || submissionStatus !== null
                  }
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger px-4"
                  onClick={handleClose}
                  disabled={
                    loading || loadingDraft || submissionStatus !== null
                  }
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill"></i>
                    Confirm {isDraftSubmission ? "Draft" : "Submission"}
                  </h5>
                  {/* <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCancelSubmit}
                  ></button> */}
                </div>
                <div className="modal-body p-4">
                  <div className="alert alert-info d-flex align-items-start mb-4">
                    <i className="bi bi-info-circle-fill me-3 fs-4"></i>
                    <div>
                      Please review the receipt details before{" "}
                      {isDraftSubmission ? "saving as draft" : "submitting"}.
                    </div>
                  </div>

                  {/* <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <p className="text-muted small mb-1">Receipt Date</p>
                          <p className="fw-semibold mb-0">
                            {formData.receiptDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <p className="text-muted small mb-1">Payment Mode</p>
                          <p className="fw-semibold mb-0">
                            {getSelectedPaymentMode()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card bg-light border-0">
                        <div className="card-body">
                          <p className="text-muted small mb-1">
                            Payment Reference No
                          </p>
                          <p className="fw-semibold mb-0">
                            {formData.referenceNo || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Selected Invoices</h6>
                    <div className="list-group">
                      {formData.selectedSalesInvoices.map((si, index) => (
                        <div
                          key={index}
                          className="list-group-item border rounded mb-2"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">
                              {si.referenceNo}
                            </span>
                            <span className="badge bg-secondary">
                              {si.customer.customerName}
                            </span>
                          </div>
                          <div className="row g-2 small">
                            <div className="col-6">
                              <span className="text-muted">Amount Due:</span>
                              <span className="fw-semibold ms-2">
                                {formatTotals(si.amountDue.toFixed(2))}
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="text-muted">Payment:</span>
                              <span className="fw-semibold ms-2 text-success">
                                {formatTotals(si.payment.toFixed(2))}
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="text-muted">Excess:</span>
                              <span className="fw-semibold ms-2">
                                {formatTotals(si.excessAmount.toFixed(2))}
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="text-muted">Outstanding:</span>
                              <span className="fw-semibold ms-2 text-danger">
                                {formatTotals(si.outstandingAmount.toFixed(2))}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card bg-primary bg-opacity-10 border-primary">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-6">
                          <p className="text-muted small mb-1">
                            Total Amount Received
                          </p>
                          <p className="fs-5 fw-bold mb-0 text-primary">
                            {formatTotals(calculateTotalAmount().toFixed(2))}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted small mb-1">
                            Total Amount Collected
                          </p>
                          <p className="fs-5 fw-bold mb-0 text-success">
                            {formatTotals(
                              calculateTotalAmountCollected().toFixed(2)
                            )}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted small mb-1">
                            Total Excess Amount
                          </p>
                          <p className="fw-semibold mb-0">
                            {formatTotals(
                              calculateTotalExcessAmountAmount().toFixed(2)
                            )}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted small mb-1">
                            Total Outstanding Amount
                          </p>
                          <p className="fw-semibold mb-0 text-danger">
                            {formatTotals(
                              calculateTotalOutstandingAmountAmount().toFixed(2)
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelSubmit}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      isDraftSubmission ? "btn-secondary" : "btn-primary"
                    } px-4`}
                    onClick={handleConfirmSubmit}
                  >
                    <i
                      className={`bi ${
                        isDraftSubmission ? "bi-save" : "bi-check-circle"
                      } me-2`}
                    ></i>
                    {isDraftSubmission
                      ? "Confirm & Save Draft"
                      : "Confirm & Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default SalesReceipt;

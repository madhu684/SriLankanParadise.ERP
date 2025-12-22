import React, { useState } from "react";
import useSalesReceipt from "./useSalesReceipt";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import useFormatCurrency from "../../utility/useFormatCurrency";

const SalesReceipt = ({ handleClose, handleUpdated }) => {
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDraftSubmission, setIsDraftSubmission] = useState(false);

  const formatTotals = useFormatCurrency({ showCurrency: false });

  const handleSubmitClick = (isSaveAsDraft) => {
    setIsDraftSubmission(isSaveAsDraft);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    await handleSubmit(isDraftSubmission);
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
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
            onClick={handleClose}
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Sales Receipt</h1>
        <hr />
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
                        .filter((si) =>
                          si.referenceNo
                            ?.replace(/\s/g, "")
                            ?.toLowerCase()
                            .includes(
                              siSearchTerm.toLowerCase().replace(/\s/g, "")
                            )
                        )
                        .filter(
                          (si) =>
                            !formData.salesInvoiceReferenceNumbers.includes(
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
                      {salesInvoiceOptions.filter((si) =>
                        si.referenceNo
                          ?.replace(/\s/g, "")
                          ?.toLowerCase()
                          .includes(
                            siSearchTerm.toLowerCase().replace(/\s/g, "")
                          )
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
                      className="btn  btn-outline-danger btn-sm"
                      onClick={() => handleRemoveSalesInvoice(referenceNo)}
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
            <table
              className="table"
              style={{ minWidth: "1000px", overflowX: "auto" }}
            >
              <thead>
                <tr>
                  <th>SI Ref No</th>
                  <th>Ref Number</th>
                  <th>Invoice Total</th>
                  <th>Amount Due</th>
                  <th>Excess Amount</th>
                  <th>Outstanding Amount</th>
                  <th>Amount Received</th>
                  <th className="text-end">Customer Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.selectedSalesInvoices.map((item, index) => (
                  <tr key={index}>
                    <td>{item.referenceNo}</td>
                    <td>{item?.referenceNumber}</td>
                    <td className="small">{item.totalAmount.toFixed(2)}</td>
                    <td className="small">{item.amountDue.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.excessAmount.toFixed(2)}
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
                      />
                      {validationErrors[`payment_${index}`] && (
                        <div className="invalid-feedback">
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
              <tfoot>
                <tr>
                  <td colSpan="7"></td>
                  <th>Total Excess Amount</th>
                  <td className="text-end text-primary">
                    {calculateTotalExcessAmountAmount().toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="7"></td>
                  <th>Total Outstanding Amount</th>
                  <td className="text-end text-danger">
                    {calculateTotalOutstandingAmountAmount().toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="7"></td>
                  <th>Total Amount Received</th>
                  <td className="text-end">
                    {calculateTotalAmount().toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="7"></td>
                  <th>Total Amount Collected</th>
                  <td className="text-end">
                    {calculateTotalAmountCollected().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Attachments */}
        {/* <h4>4. Attachments</h4>
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
        </div> */}

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
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
              "Submit"
            )}
          </button>
          {/* <button
            type="button"
            className="btn btn-secondary me-2"
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
          </button> */}
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
                </div>
                <div className="modal-body p-4">
                  <div className="alert alert-info d-flex align-items-start mb-4">
                    <i className="bi bi-info-circle-fill me-3 fs-4"></i>
                    <div>
                      Please review the receipt details before{" "}
                      {isDraftSubmission ? "saving as draft" : "submitting"}.
                    </div>
                  </div>

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
                            {/* <span className="badge bg-secondary">
                              {si.customer.customerName}
                            </span> */}
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

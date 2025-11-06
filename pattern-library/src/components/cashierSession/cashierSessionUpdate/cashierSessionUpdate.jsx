import React from "react";
import { Modal, Button } from "react-bootstrap";
import useCashierSession from "./useCashierSessionUpdate";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";
import CollectionDetail from "./collectionDetail/collectionDetail";
import ExpenseOutDetail from "./expenseOutDetail/expenseOutDetail";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

import useFormatCurrency from "../../salesInvoice/helperMethods/useFormatCurrency";

const CashierSessionUpdate = ({
  show,
  handleClose,
  handleAddCashierSession,
  cashierSession,
}) => {
  const {
    validFields,
    validationErrors,
    submissionStatus,
    loading,
    alertRef,
    totalsByPaymentMode,
    salesReceipts,
    expenseOutTotal,
    expenseOuts,
    isDifferenceCashInHand,
    isDifferenceChequesInHand,
    reasonCashInHand,
    reasonChequesInHand,
    actualCashInHand,
    actualChequesInHand,
    selectedMode,
    showExpenseOutDetailModal,
    isLoadingSalesReceipts,
    isSalesReceiptsError,
    isLoadingCashierExpenseOuts,
    isCashierExpenseOutsError,
    handleSubmit,
    setReasonCashInHand,
    setReasonChequesInHand,
    setActualCashInHand,
    setActualChequesInHand,
    openCollectionDetailModal,
    closeCollectionDetailModal,
    handleExpenseOutDetailModal,
  } = useCashierSession({
    onFormSubmit: (responseData) => {
      handleClose();
      handleAddCashierSession(responseData);
    },
    cashierSession,
  });

  const formatTotals = useFormatCurrency({ showCurrency: false });

  return (
    <>
      {!(selectedMode !== null) && !showExpenseOutDetailModal && (
        <Modal
          show={show}
          onHide={handleClose}
          centered
          scrollable
          backdrop={!(loading || submissionStatus !== null) ? true : "static"}
          keyboard={!(loading || submissionStatus !== null)}
          size="lg"
        >
          <Modal.Header
            closeButton={!(loading || submissionStatus !== null)}
            className="bg-success bg-opacity-50 text-dark border-0"
          >
            <Modal.Title className="d-flex align-items-center gap-2">
              <i className="bi bi-cash-stack"></i>
              Close Cashier Session
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {isSalesReceiptsError && isCashierExpenseOutsError && (
              <ErrorComponent error={"Error fetching data"} />
            )}
            {isLoadingSalesReceipts && isLoadingCashierExpenseOuts && (
              <LoadingSpinner maxHeight="65vh" />
            )}
            {!isCashierExpenseOutsError &&
              !isLoadingCashierExpenseOuts &&
              !isSalesReceiptsError &&
              !isLoadingSalesReceipts && (
                <>
                  {/* Session Info Card */}
                  <div className="card bg-light border-0 shadow mb-4">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-start gap-2">
                            <i className="bi bi-clock-history text-primary mt-1"></i>
                            <div>
                              <p className="text-muted small mb-1">
                                Session Started
                              </p>
                              <p className="fw-semibold mb-0">
                                {moment
                                  .utc(cashierSession?.sessionIn)
                                  .tz("Asia/Colombo")
                                  .format("YYYY-MM-DD hh:mm:ss A")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start gap-2">
                            <i className="bi bi-wallet2 text-success mt-1"></i>
                            <div>
                              <p className="text-muted small mb-1">
                                Opening Balance
                              </p>
                              <p className="fw-bold mb-0 fs-5 text-success">
                                {formatTotals(
                                  cashierSession?.openingBalance.toFixed(2)
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collection Summary Card */}
                  <div className="card border-success shadow mb-4">
                    <div className="card-header bg-success bg-opacity-10 border-success">
                      <h6 className="mb-0 fw-semibold text-success d-flex align-items-center gap-2">
                        <i className="bi bi-collection"></i>
                        Collection Summary
                      </h6>
                    </div>
                    <div className="card-body">
                      {Object.keys(totalsByPaymentMode).length === 0 ? (
                        <div
                          className="alert alert-warning d-flex align-items-center mb-0"
                          role="alert"
                        >
                          <i className="bi bi-info-circle-fill me-3"></i>
                          <span>You haven't made any transactions yet.</span>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                              <tr>
                                <th className="fw-semibold">Payment Mode</th>
                                <th className="fw-semibold">Total</th>
                                <th className="fw-semibold text-end">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(totalsByPaymentMode).map(
                                (modeId) => {
                                  const totalAmount =
                                    totalsByPaymentMode[modeId];
                                  const mode = salesReceipts.find(
                                    (r) =>
                                      r.paymentMode.paymentModeId ===
                                      parseInt(modeId)
                                  );

                                  return (
                                    <tr key={modeId}>
                                      <td>
                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                          {mode.paymentMode.mode}
                                        </span>
                                      </td>
                                      <td className="fw-bold">
                                        {formatTotals(totalAmount.toFixed(2))}
                                      </td>
                                      <td className="text-end">
                                        <button
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() =>
                                            openCollectionDetailModal(modeId)
                                          }
                                        >
                                          <i className="bi bi-eye me-1"></i>
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expense Out Card */}
                  <div className="card bg-danger bg-opacity-10 border-danger shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-arrow-down-circle text-danger fs-4"></i>
                          <div>
                            <p className="text-muted small mb-1">
                              Total Cashier Expense Out
                            </p>
                            <p className="fw-bold mb-0 fs-5 text-danger">
                              {formatTotals(expenseOutTotal.toFixed(2))}
                            </p>
                          </div>
                        </div>
                        {expenseOutTotal !== 0 && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleExpenseOutDetailModal()}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total Cash Collection Card */}
                  <div className="card bg-primary bg-opacity-10 border-primary shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-cash-coin text-primary fs-4"></i>
                        <div>
                          <p className="text-muted small mb-1">
                            Total Cash Collection
                          </p>
                          <p className="fw-bold mb-0 fs-4 text-primary">
                            {formatTotals(
                              (
                                cashierSession?.openingBalance +
                                (totalsByPaymentMode[1] ?? 0) -
                                expenseOutTotal
                              ).toFixed(2)
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash In Hand Section */}
                  <div className="card border-warning shadow mb-4">
                    <div className="card-header border-warning bg-warning bg-opacity-50">
                      <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                        <i className="bi bi-currency-dollar text-success"></i>
                        Cash Verification
                      </h6>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row g-3">
                          <div
                            className={
                              isDifferenceCashInHand ? "col-md-6" : "col-md-12"
                            }
                          >
                            <label
                              htmlFor="actualCashInHand"
                              className="form-label fw-semibold small text-secondary"
                            >
                              Actual Cash In Hand{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-white">
                                <i className="bi bi-cash text-success"></i>
                              </span>
                              <input
                                type="number"
                                className={`form-control ${
                                  validFields.actualCashInHand ? "is-valid" : ""
                                } ${
                                  validationErrors.actualCashInHand
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="actualCashInHand"
                                value={actualCashInHand}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    setActualCashInHand(value);
                                  } else {
                                    setActualCashInHand(0);
                                  }
                                }}
                                placeholder="0.00"
                                step="0.01"
                              />
                              {validationErrors.actualCashInHand && (
                                <div className="invalid-feedback">
                                  {validationErrors.actualCashInHand}
                                </div>
                              )}
                            </div>
                          </div>
                          {isDifferenceCashInHand && (
                            <div className="col-md-6">
                              <label
                                htmlFor="reasonCashInHand"
                                className="form-label fw-semibold small text-secondary"
                              >
                                Reason for Difference{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className={`form-control ${
                                  validFields.reasonCashInHand ? "is-valid" : ""
                                } ${
                                  validationErrors.reasonCashInHand
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="reasonCashInHand"
                                placeholder="Please explain the cash difference..."
                                value={reasonCashInHand}
                                onChange={(e) =>
                                  setReasonCashInHand(e.target.value)
                                }
                                rows="3"
                                maxLength="250"
                              />
                              <div className="form-text">
                                {reasonCashInHand.length}/250 characters
                              </div>
                              {validationErrors.reasonCashInHand && (
                                <div className="invalid-feedback">
                                  {validationErrors.reasonCashInHand}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Cheques In Hand Section */}
                  <div className="card border-info shadow mb-4">
                    <div className="card-header border-info bg-info bg-opacity-50">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-check text-info"></i>
                          Cheques Verification
                        </h6>
                        {/* <span className="badge bg-dark bg-opacity-10 text-dark">
                          Expected: {(totalsByPaymentMode[2] ?? 0).toFixed(2)}
                        </span> */}
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row g-3">
                          <div
                            className={
                              isDifferenceChequesInHand
                                ? "col-md-6"
                                : "col-md-12"
                            }
                          >
                            <label
                              htmlFor="actualChequesInHand"
                              className="form-label fw-semibold small text-secondary"
                            >
                              Actual Cheques In Hand{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-white">
                                <i className="bi bi-file-earmark-text text-info"></i>
                              </span>
                              <input
                                type="number"
                                className={`form-control ${
                                  validFields.actualChequesInHand
                                    ? "is-valid"
                                    : ""
                                } ${
                                  validationErrors.actualChequesInHand
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="actualChequesInHand"
                                value={actualChequesInHand}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    setActualChequesInHand(value);
                                  } else {
                                    setActualChequesInHand(0);
                                  }
                                }}
                                placeholder="0.00"
                                step="0.01"
                              />
                              {validationErrors.actualChequesInHand && (
                                <div className="invalid-feedback">
                                  {validationErrors.actualChequesInHand}
                                </div>
                              )}
                            </div>
                          </div>
                          {isDifferenceChequesInHand && (
                            <div className="col-md-6">
                              <label
                                htmlFor="reasonChequesInHand"
                                className="form-label fw-semibold small text-secondary"
                              >
                                Reason for Difference{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className={`form-control ${
                                  validFields.reasonChequesInHand
                                    ? "is-valid"
                                    : ""
                                } ${
                                  validationErrors.reasonChequesInHand
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="reasonChequesInHand"
                                placeholder="Please explain the cheque difference..."
                                value={reasonChequesInHand}
                                onChange={(e) =>
                                  setReasonChequesInHand(e.target.value)
                                }
                                rows="3"
                                maxLength="250"
                              />
                              <div className="form-text">
                                {reasonChequesInHand.length}/250 characters
                              </div>
                              {validationErrors.reasonChequesInHand && (
                                <div className="invalid-feedback">
                                  {validationErrors.reasonChequesInHand}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  <div ref={alertRef}></div>

                  {/* Status Messages */}
                  {submissionStatus === "success" && (
                    <div
                      className="alert alert-success d-flex align-items-center shadow-sm mb-0"
                      role="alert"
                    >
                      <i className="bi bi-check-circle-fill me-3 fs-4"></i>
                      <div>
                        <strong>Success!</strong> Your cashier session is closed
                        now!
                      </div>
                    </div>
                  )}
                  {submissionStatus === "error" && (
                    <div
                      className="alert alert-danger d-flex align-items-center shadow-sm mb-0"
                      role="alert"
                    >
                      <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                      <div>
                        <strong>Error!</strong> Error closing your cashier
                        session. Please try again.
                      </div>
                    </div>
                  )}
                </>
              )}
          </Modal.Body>
          <Modal.Footer className="bg-light border-0">
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={loading || submissionStatus !== null}
              className="px-4"
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || submissionStatus !== null}
              className="px-4"
            >
              {loading && submissionStatus === null ? (
                <ButtonLoadingSpinner text="Closing Session..." />
              ) : (
                <>
                  <i className="bi bi-lock-fill me-2"></i>
                  Close Cashier Session
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <CollectionDetail
        show={selectedMode !== null}
        handleClose={closeCollectionDetailModal}
        modeId={selectedMode}
        salesReceipts={salesReceipts}
        thousandSeperator={formatTotals}
      />
      <ExpenseOutDetail
        show={showExpenseOutDetailModal}
        handleClose={handleExpenseOutDetailModal}
        expenseOuts={expenseOuts}
        thousandSeperator={formatTotals}
      />
    </>
  );
};

export default CashierSessionUpdate;

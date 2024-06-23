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
          <Modal.Header closeButton={!(loading || submissionStatus !== null)}>
            <Modal.Title>Close Cashier Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                  <p>
                    <strong>Cashier Session In:</strong>{" "}
                    {moment
                      .utc(cashierSession?.sessionIn)
                      .tz("Asia/Colombo")
                      .format("YYYY-MM-DD hh:mm:ss A")}
                  </p>
                  <p>
                    <strong>Cashier Session Opening Balance:</strong>{" "}
                    {cashierSession?.openingBalance.toFixed(2)}
                  </p>

                  <div className="card border-success mb-4">
                    <div className="card-header bg-transparent border-success">
                      <strong>Collection Summary</strong>
                    </div>
                    <div className="card-body">
                      {Object.keys(totalsByPaymentMode).length === 0 ? (
                        <div className="alert alert-warning" role="alert">
                          You haven't made any transactions yet.
                        </div>
                      ) : (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Payment Mode</th>
                              <th>Total</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(totalsByPaymentMode).map((modeId) => {
                              const totalAmount = totalsByPaymentMode[modeId];
                              const mode = salesReceipts.find(
                                (r) =>
                                  r.paymentMode.paymentModeId ===
                                  parseInt(modeId)
                              );

                              return (
                                <tr key={modeId}>
                                  <td>{mode.paymentMode.mode}</td>
                                  <td>{totalAmount.toFixed(2)}</td>
                                  <td>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        openCollectionDetailModal(modeId)
                                      }
                                    >
                                      <span className="bi bi-arrow-right"></span>{" "}
                                      View
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                  <p>
                    <strong>Total Cashier Expense Out:</strong>{" "}
                    {expenseOutTotal.toFixed(2)}{" "}
                    {expenseOutTotal !== 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleExpenseOutDetailModal()}
                      >
                        <span className="bi bi-arrow-right"></span> View
                      </button>
                    )}
                  </p>

                  <p>
                    <strong>Total Cash Collection:</strong>{" "}
                    {(
                      cashierSession?.openingBalance +
                      (totalsByPaymentMode[1] ?? 0) -
                      expenseOutTotal
                    ).toFixed(2)}
                  </p>

                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="actualCashInHand"
                            className="form-label"
                          >
                            Actual Cash In Hand:
                          </label>
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
                          <div className="mb-3">
                            <label htmlFor="reason" className="form-label">
                              Reason:
                            </label>
                            <textarea
                              className={`form-control ${
                                validFields.reasonCashInHand ? "is-valid" : ""
                              } ${
                                validationErrors.reasonCashInHand
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="reason"
                              placeholder="Enter Reason"
                              value={reasonCashInHand}
                              onChange={(e) =>
                                setReasonCashInHand(e.target.value)
                              }
                              rows="2"
                              maxLength="250"
                            />
                            {validationErrors.reasonCashInHand && (
                              <div className="invalid-feedback">
                                {validationErrors.reasonCashInHand}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>

                  <p>
                    <strong>Total Cheques Collection:</strong>{" "}
                    {(totalsByPaymentMode[2] ?? 0).toFixed(2)}
                  </p>

                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="actualchequesInHand"
                            className="form-label"
                          >
                            Actual Cheques In Hand:
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              validFields.actualChequesInHand ? "is-valid" : ""
                            } ${
                              validationErrors.actualChequesInHand
                                ? "is-invalid"
                                : ""
                            }`}
                            id="actualCashInHand"
                            value={actualChequesInHand}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                setActualChequesInHand(value);
                              } else {
                                setActualChequesInHand(0);
                              }
                            }}
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
                          <div className="mb-3">
                            <label htmlFor="reason" className="form-label">
                              Reason:
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
                              id="reason"
                              placeholder="Enter Reason"
                              value={reasonChequesInHand}
                              onChange={(e) =>
                                setReasonChequesInHand(e.target.value)
                              }
                              rows="2"
                              maxLength="250"
                            />
                            {validationErrors.reasonChequesInHand && (
                              <div className="invalid-feedback">
                                {validationErrors.reasonChequesInHand}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>

                  <div ref={alertRef}></div>
                  {/* Display success or error messages */}
                  {submissionStatus === "success" && (
                    <div className="alert alert-success mb-0" role="alert">
                      Your cashier session is closed now!
                    </div>
                  )}
                  {submissionStatus === "error" && (
                    <div className="alert alert-danger mb-0" role="alert">
                      Error closing your cashier session. Please try again.
                    </div>
                  )}
                </>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading || submissionStatus !== null}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || submissionStatus !== null}
            >
              {loading && submissionStatus === null ? (
                <ButtonLoadingSpinner text="Closing..." />
              ) : (
                "Close Cashier Session"
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
      />
      <ExpenseOutDetail
        show={showExpenseOutDetailModal}
        handleClose={handleExpenseOutDetailModal}
        expenseOuts={expenseOuts}
      />
    </>
  );
};

export default CashierSessionUpdate;

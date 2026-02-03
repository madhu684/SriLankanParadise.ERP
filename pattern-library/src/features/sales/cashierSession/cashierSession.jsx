import React from "react";
import { Modal, Button } from "react-bootstrap";
import useCashierSession from "./useCashierSession";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const CashierSession = ({ show, handleClose, handleAddCashierSession }) => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    loading,
    alertRef,
    handleInputChange,
    handleSubmit,
  } = useCashierSession({
    onFormSubmit: (responseData) => {
      handleClose();
      handleAddCashierSession(responseData);
    },
  });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      backdrop={!(loading || submissionStatus !== null) ? true : "static"}
      keyboard={!(loading || submissionStatus !== null)}
      size="md"
    >
      <Modal.Header
        closeButton={!(loading || submissionStatus !== null)}
        className="bg-primary bg-gradient text-white border-0"
      >
        <Modal.Title className="d-flex align-items-center">
          <i className="bi bi-cash-stack me-2 fs-4"></i>
          Open Cashier Session
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label
                  htmlFor="openingBalance"
                  className="form-label fw-semibold text-secondary"
                >
                  <i className="bi bi-wallet2 me-2"></i>
                  Opening Balance
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="text-muted">LKR</i>
                  </span>
                  <input
                    type="number"
                    className={`form-control border-start-0 ps-0 ${
                      validFields.openingBalance
                        ? "is-valid border-success"
                        : ""
                    } ${
                      validationErrors.openingBalance
                        ? "is-invalid border-danger"
                        : ""
                    }`}
                    id="openingBalance"
                    placeholder="0.00"
                    value={formData.openingBalance}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      const positiveValue = isNaN(value)
                        ? 0
                        : Math.max(0, value);
                      handleInputChange("openingBalance", positiveValue);
                    }}
                    step="0.01"
                    min="0"
                    required
                  />
                  {validFields.openingBalance && (
                    <span className="input-group-text bg-success-subtle border-success border-start-0">
                      <i className="bi bi-check-circle-fill text-success"></i>
                    </span>
                  )}
                  {validationErrors.openingBalance && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {validationErrors.openingBalance}
                    </div>
                  )}
                </div>
                <div className="form-text mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Enter the starting cash amount for this session
                </div>
              </div>
            </form>
          </div>
        </div>

        <div ref={alertRef}></div>

        {submissionStatus === "success" && (
          <div
            className="alert alert-success d-flex align-items-center mb-0 border-0 shadow-sm"
            role="alert"
          >
            <i className="bi bi-check-circle-fill fs-4 me-3"></i>
            <div>
              <strong>Success!</strong> Your cashier session is open now!
            </div>
          </div>
        )}

        {submissionStatus === "error" && (
          <div
            className="alert alert-danger d-flex align-items-center mb-0 border-0 shadow-sm"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
            <div>
              <strong>Error!</strong> Could not open your cashier session.
              Please try again.
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light border-0 p-3">
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
          className="px-4 shadow-sm"
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Opening..." />
          ) : (
            <>
              <i className="bi bi-unlock-fill me-2"></i>
              Open Session
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CashierSession;














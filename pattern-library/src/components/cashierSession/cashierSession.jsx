import React from "react";
import { Modal, Button } from "react-bootstrap";
import useCashierSession from "./useCashierSession";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

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
    >
      <Modal.Header
        // closeButton={!(loading || submissionStatus !== null)}
        className="bg-info bg-opacity-75 text-dark border-0"
      >
        <Modal.Title className="fw-bold d-flex align-items-center">
          <i className="bi bi-door-open me-2 fs-4"></i>
          Open Cashier Session
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="alert alert-info bg-info bg-opacity-10 border-info border-start border-4 mb-4">
          <div className="d-flex align-items-start">
            <i className="bi bi-info-circle-fill text-info me-3 fs-5"></i>
            <div>
              <p className="mb-0 small">
                Enter your opening balance to start a new cashier session. This
                amount should match the cash in your drawer.
              </p>
            </div>
          </div>
        </div>

        <form>
          <div className="card shadow-sm">
            <div className="card-body">
              <label
                htmlFor="openingBalance"
                className="form-label fw-semibold"
              >
                <i className="bi bi-cash-coin me-2 text-success"></i>
                Opening Balance
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi text-success">LKR</i>
                </span>
                <input
                  type="number"
                  className={`form-control border-start-0 ps-0 ${
                    validFields.openingBalance ? "is-valid" : ""
                  } ${validationErrors.openingBalance ? "is-invalid" : ""}`}
                  id="openingBalance"
                  placeholder="0.00"
                  value={formData.openingBalance}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    const positiveValue = isNaN(value) ? 0 : Math.max(0, value);

                    handleInputChange("openingBalance", positiveValue);
                  }}
                  required
                  step="0.01"
                  min="0"
                />
                {validationErrors.openingBalance && (
                  <div className="invalid-feedback">
                    {validationErrors.openingBalance}
                  </div>
                )}
                {validFields.openingBalance && (
                  <div className="valid-feedback">
                    Opening balance looks good!
                  </div>
                )}
              </div>
              <small className="text-muted d-block mt-2">
                <i className="bi bi-lightbulb me-1"></i>
                Tip: Count your cash drawer carefully before entering the amount
              </small>
            </div>
          </div>
        </form>

        <div ref={alertRef}></div>

        {submissionStatus === "success" && (
          <div
            className="alert alert-success border-0 shadow-sm d-flex align-items-center mb-0"
            role="alert"
          >
            <i className="bi bi-check-circle-fill fs-4 me-3"></i>
            <div>
              <strong className="d-block">Success!</strong>
              Your cashier session is opened now!
            </div>
          </div>
        )}
        {submissionStatus === "error" && (
          <div
            className="alert alert-danger border-0 shadow-sm d-flex align-items-center mb-0"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
            <div>
              <strong className="d-block">Error!</strong>
              Error opening your cashier session. Please try again.
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light border-0">
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || submissionStatus !== null}
          className="px-4"
        >
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={loading || submissionStatus !== null}
          className="px-4 shadow-sm"
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Opening..." />
          ) : (
            <>
              <i className="bi bi-door-open me-2"></i>
              Open Session
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CashierSession;

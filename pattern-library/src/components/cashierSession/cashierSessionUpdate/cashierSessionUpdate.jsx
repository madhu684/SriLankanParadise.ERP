import React from "react";
import { Modal, Button } from "react-bootstrap";
import useCashierSession from "./useCashierSessionUpdate";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const CashierSessionUpdate = ({
  show,
  handleClose,
  handleAddCashierSession,
  cashierSession,
}) => {
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
    cashierSession,
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
      <Modal.Header closeButton={!(loading || submissionStatus !== null)}>
        <Modal.Title>Close Cashier Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="closingBalance" className="form-label">
              Closing Balance
            </label>
            <input
              type="number"
              className={`form-control ${
                validFields.closingBalance ? "is-valid" : ""
              } ${validationErrors.closingBalance ? "is-invalid" : ""}`}
              id="ClosingBalance"
              placeholder="Enter Closing Balance"
              value={formData.closingBalance}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                const positiveValue = isNaN(value) ? 0 : Math.max(0, value);

                handleInputChange("closingBalance", positiveValue);
              }}
              required
            />
            {validationErrors.closingBalance && (
              <div className="invalid-feedback">
                {validationErrors.closingBalance}
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
  );
};

export default CashierSessionUpdate;

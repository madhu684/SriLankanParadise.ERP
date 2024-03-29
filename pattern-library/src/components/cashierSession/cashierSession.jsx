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
      <Modal.Header closeButton={!(loading || submissionStatus !== null)}>
        <Modal.Title>Open Cashier Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="openingBalance" className="form-label">
              Opening Balance
            </label>
            <input
              type="number"
              className={`form-control ${
                validFields.openingBalance ? "is-valid" : ""
              } ${validationErrors.openingBalance ? "is-invalid" : ""}`}
              id="openingBalance"
              placeholder="Enter Opening Balance"
              value={formData.openingBalance}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                const positiveValue = isNaN(value) ? 0 : Math.max(0, value);

                handleInputChange("openingBalance", positiveValue);
              }}
              required
            />
            {validationErrors.openingBalance && (
              <div className="invalid-feedback">
                {validationErrors.openingBalance}
              </div>
            )}
          </div>
        </form>
        <div ref={alertRef}></div>
        {/* Display success or error messages */}
        {submissionStatus === "success" && (
          <div className="alert alert-success mb-0" role="alert">
            Your cashier session is opend now!
          </div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger mb-0" role="alert">
            Error opening your cashier session. Please try again.
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
            <ButtonLoadingSpinner text="Opening..." />
          ) : (
            "Open Cashier Session"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CashierSession;

import React from "react";
import useExpenseOutRequisitionUpdate from "./useExpenseOutRequisitionUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";

const ExpenseOutRequisitionUpdate = ({
  handleClose,
  expenseOutRequisition,
  handleUpdated,
}) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    loading,
    handleInputChange,
    handleSubmit,
  } = useExpenseOutRequisitionUpdate({
    expenseOutRequisition,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <img src={companyLogoUrl} alt="Company Logo" height={30} />
          <p>
            {" "}
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Expense Out Request</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Expense out request updated successfully!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating expense out request. Please try again.
        </div>
      )}

      <form>
        {/* Cashier Expense Out Information */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>Expense Out Request Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="status" className="form-label">
                Amount
              </label>
              <input
                type="number"
                className={`form-control ${
                  validFields.amount ? "is-valid" : ""
                } ${validationErrors.amount ? "is-invalid" : ""}`}
                id="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const positiveValue = isNaN(value) ? 0 : Math.max(0, value);
                  handleInputChange("amount", positiveValue);
                }}
                required
              />
              {validationErrors.amount && (
                <div className="invalid-feedback">
                  {validationErrors.amount}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="reason" className="form-label">
                Reason
              </label>
              <textarea
                className={`form-control ${
                  validFields.reason ? "is-valid" : ""
                } ${validationErrors.reason ? "is-invalid" : ""}`}
                id="reason"
                placeholder="Enter Reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                required
                rows="2"
                maxLength="250"
              />
              {validationErrors.reason && (
                <div className="invalid-feedback">
                  {validationErrors.reason}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={handleSubmit}
            disabled={loading || submissionStatus !== null}
          >
            {loading && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Updating..." />
            ) : (
              "Update"
            )}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading || submissionStatus !== null}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseOutRequisitionUpdate;

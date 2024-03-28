import React from "react";
import useCashierExpenseOut from "./useCashierExpenseOut";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";

const CashierExpenseOut = () => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    handleInputChange,
    handleSubmit,
    handleClose,
  } = useCashierExpenseOut({
    onFormSubmit: () => {
      handleClose();
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
        <h1 className="mt-2 text-center">Cashier Expense Out</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Cashier expense out added successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Cashier expense out added as draft, you can edit and active it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error adding cashier expense out. Please try again.
        </div>
      )}

      <form>
        {/* Cashier Expense Out Information */}
        <div className="row mb-3">
          <div className="col-md-6">
            <h4>Cashier Expense Out Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.description ? "is-valid" : ""
                } ${validationErrors.description ? "is-invalid" : ""}`}
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
              {validationErrors.description && (
                <div className="invalid-feedback">
                  {validationErrors.description}
                </div>
              )}
            </div>

            <div className="mb-3">
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
              <ButtonLoadingSpinner text="Adding..." />
            ) : (
              "Add"
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

export default CashierExpenseOut;

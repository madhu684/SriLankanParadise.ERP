import React from "react";
import { Modal, Button } from "react-bootstrap";
import useUpdateCompanyForm from "./useUpdateCompanyForm";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const UpdateCompanyForm = ({
  show,
  handleClose,
  handleCompanyUpdated,
  companyData,
}) => {
  const {
    formData,
    subscriptionPlans,
    showSuccessAlert,
    validFields,
    validationErrors,
    companyLogoUrl,
    successAlertRef,
    loading,
    updateCompanySuccessfull,
    handleLogoChange,
    handleFormSubmit,
    handleChange,
    setShowSuccessAlert,
  } = useUpdateCompanyForm({
    onFormSubmit: () => {
      handleClose();
      handleCompanyUpdated();
    },
    companyData,
  });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
      backdrop={
        !(loading || updateCompanySuccessfull !== null) ? true : "static"
      }
      keyboard={!(loading || updateCompanySuccessfull !== null)}
    >
      <Modal.Header
        closeButton={!(loading || updateCompanySuccessfull !== null)}
      >
        <Modal.Title>Update Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="row g-3">
          <div className="col-md-8 mb-3">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              className={`form-control ${
                validFields.companyName ? "is-valid" : ""
              } ${validationErrors.companyName ? "is-invalid" : ""}`}
              id="companyName"
              placeholder="Enter company name"
              value={formData?.companyName ?? ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
            {validationErrors.companyName && (
              <div className="invalid-feedback">
                {validationErrors.companyName}
              </div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className={`form-select ${validFields.status ? "is-valid" : ""} ${
                validationErrors.status ? "is-invalid" : ""
              }`}
              id="status"
              value={formData?.status ?? false}
              onChange={(e) =>
                handleChange("status", e.target.value === "true")
              }
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            {validationErrors.status && (
              <div className="invalid-feedback">{validationErrors.status}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="subscriptionPlan" className="form-label">
              Subscription Plan
            </label>
            <select
              className={`form-select ${
                validFields.subscriptionPlan ? "is-valid" : ""
              } ${validationErrors.subscriptionPlan ? "is-invalid" : ""}`}
              id="subscriptionPlan"
              value={formData?.subscriptionPlan}
              onChange={(e) => handleChange("subscriptionPlan", e.target.value)}
            >
              <option value="">Select a subscription plan</option>
              <option value="Not Subscribed">Not Subscribed</option>
              {subscriptionPlans.map((item) => (
                <option key={item.subscriptionId} value={item.subscriptionId}>
                  {item.planName}
                </option>
              ))}
            </select>
            {validationErrors.subscriptionPlan && (
              <div className="invalid-feedback">
                {validationErrors.subscriptionPlan}
              </div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="maxUserCount" className="form-label">
              Maximum User Count
            </label>
            <input
              type="number"
              step="50"
              className="form-control"
              id="maxUserCount"
              placeholder="Max User Count"
              value={formData?.maxUserCount ?? 0}
              onWheel={(e) => e.target.blur()}
              onChange={(e) =>
                handleChange(
                  "maxUserCount",
                  e.target.value === "0" ? null : parseInt(e.target.value, 10)
                )
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="subscriptionExpiredDate" className="form-label">
              Subscription Expired Date
            </label>
            <input
              type="date"
              className="form-control"
              id="subscriptionExpiredDate"
              placeholder="Subscription Expired Date"
              value={formData?.subscriptionExpiredDate ?? ""}
              onChange={(e) =>
                handleChange("subscriptionExpiredDate", e.target.value)
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="batchStockType" className="form-label">
              Batch Stock Type
            </label>
            <select
              className={`form-select ${
                validFields.batchStockType ? "is-valid" : ""
              } ${validationErrors.batchStockType ? "is-invalid" : ""}`}
              id="batchStockType"
              value={formData.batchStockType}
              onChange={(e) => handleChange("batchStockType", e.target.value)}
            >
              <option value="">Select Batch Stock Type</option>
              <option value="FIFO">FIFO (first-in, first-out)</option>
              <option value="Average">Average</option>
            </select>
            {validationErrors.batchStockType && (
              <div className="invalid-feedback">
                {validationErrors.batchStockType}
              </div>
            )}
          </div>

          <div className="col-md-12 mb-3">
            <label htmlFor="logo" className="form-label">
              Logo
            </label>
            <input
              type="file"
              className={`form-control ${validFields.logo ? "is-valid" : ""} ${
                validationErrors.logo ? "is-invalid" : ""
              }`}
              id="logo"
              onChange={handleLogoChange}
            />
            {validationErrors.logo && (
              <div className="invalid-feedback">{validationErrors.logo}</div>
            )}
          </div>
          {formData.logo ? (
            <div>
              <img
                src={URL.createObjectURL(formData.logo)}
                alt="Supplier Logo"
                className="img-thumbnail mt-2"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div>
              <img
                src={companyLogoUrl}
                alt="Supplier Logo"
                className="img-thumbnail mt-2"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </form>
        <div ref={successAlertRef}></div>
        {showSuccessAlert && (
          <div
            className="alert alert-success mb-0 mt-3"
            role="alert"
            onClose={() => setShowSuccessAlert(false)}
          >
            Company updated successfully! Your data have been saved.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || updateCompanySuccessfull !== null}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleFormSubmit}
          disabled={loading || updateCompanySuccessfull !== null}
        >
          {loading && updateCompanySuccessfull === null ? (
            <ButtonLoadingSpinner text="Updating..." />
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateCompanyForm;















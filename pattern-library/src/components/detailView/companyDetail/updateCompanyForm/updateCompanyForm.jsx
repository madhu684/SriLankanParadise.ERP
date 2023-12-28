import React from "react";
import { Modal, Button } from "react-bootstrap";
import useUpdateCompanyForm from "./useUpdateCompanyForm";

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
    handleLogoChange,
    successAlertRef,
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
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
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
              className="form-select"
              id="status"
              value={formData?.status ?? false}
              onChange={(e) =>
                handleChange("status", e.target.value === "true")
              }
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
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
              value={formData?.subscriptionPlan ?? "Not Subscribed"}
              onChange={(e) =>
                handleChange(
                  "subscriptionPlan",
                  e.target.value === "Not Subscribed" ? null : e.target.value
                )
              }
            >
              <option value="" disabled>
                Select a subscription plan
              </option>
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
              onChange={(e) =>
                handleChange(
                  "maxUserCount",
                  e.target.value === "0" ? null : parseInt(e.target.value, 10)
                )
              }
            />
          </div>

          <div className="col-md-12 mb-3">
            <label htmlFor="subscriptionExpiredDate" className="form-label">
              Subscription Expired Date
            </label>
            <input
              type="text"
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
        </form>
        <div ref={successAlertRef}></div>
        {showSuccessAlert && (
          <div
            className="alert alert-success mb-0"
            role="alert"
            onClose={() => setShowSuccessAlert(false)}
          >
            Company updated successfully! Your data have been saved.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFormSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateCompanyForm;

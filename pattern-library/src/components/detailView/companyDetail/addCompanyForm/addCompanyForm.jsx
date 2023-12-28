import React from "react";
import { Modal, Button } from "react-bootstrap";
import useAddCompanyForm from "./useAddCompanyForm";

const AddCompanyForm = ({ show, handleClose, handleCompanyAdded }) => {
  const {
    setCompanyName,
    handleLogoChange,
    handleFormSubmit,
    setShowSuccessAlert,
    companyName,
    showSuccessAlert,
    validFields,
    validationErrors,
  } = useAddCompanyForm(() => {
    handleClose();
    handleCompanyAdded();
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
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
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            {validationErrors.companyName && (
              <div className="invalid-feedback">
                {validationErrors.companyName}
              </div>
            )}
          </div>
          <div className="mb-3">
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
        {showSuccessAlert && (
          <div
            className="alert alert-success mb-0"
            role="alert"
            onClose={() => setShowSuccessAlert(false)}
          >
            Company added successfully! Your data have been saved.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCompanyForm;

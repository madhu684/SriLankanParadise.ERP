import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSupplier from "./useSupplier";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const Supplier = ({ show, handleClose, handleAddSupplier }) => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    loading,
    alertRef,
    handleInputChange,
    handleSubmit,
  } = useSupplier({
    onFormSubmit: (responseData) => {
      handleClose();
      handleAddSupplier(responseData);
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
        <Modal.Title>Add New Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="SupplierName" className="form-label">
              Supplier Name
            </label>
            <input
              type="text"
              className={`form-control ${
                validFields.supplierName ? "is-valid" : ""
              } ${validationErrors.supplierName ? "is-invalid" : ""}`}
              id="SupplierName"
              placeholder="Enter Supplier name"
              value={formData.supplierName}
              onChange={(e) =>
                handleInputChange("supplierName", e.target.value)
              }
              required
            />
            {validationErrors.supplierName && (
              <div className="invalid-feedback">
                {validationErrors.supplierName}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="contactPerson" className="form-label">
              Contact Person
            </label>
            <input
              type="text"
              className={`form-control ${
                validFields.contactPerson ? "is-valid" : ""
              } ${validationErrors.contactPerson ? "is-invalid" : ""}`}
              id="contactPerson"
              placeholder="Enter contact person"
              value={formData.contactPerson}
              onChange={(e) =>
                handleInputChange("contactPerson", e.target.value)
              }
              required
            />
            {validationErrors.contactPerson && (
              <div className="invalid-feedback">
                {validationErrors.contactPerson}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className={`form-control ${validFields.phone ? "is-valid" : ""} ${
                validationErrors.phone ? "is-invalid" : ""
              }`}
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
            {validationErrors.phone && (
              <div className="invalid-feedback">{validationErrors.phone}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className={`form-control ${validFields.email ? "is-valid" : ""} ${
                validationErrors.email ? "is-invalid" : ""
              }`}
              id="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            {validationErrors.email && (
              <div className="invalid-feedback">{validationErrors.email}</div>
            )}
          </div>
        </form>
        <div ref={alertRef}></div>
        {/* Display success or error messages */}
        {submissionStatus === "success" && (
          <div className="alert alert-success mb-0" role="alert">
            Supplier added successfully!
          </div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger mb-0" role="alert">
            Error adding supplier. Please try again.
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
            <ButtonLoadingSpinner text="Saving..." />
          ) : (
            "Save"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Supplier;

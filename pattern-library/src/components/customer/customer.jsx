import React from "react";
import { Modal, Button } from "react-bootstrap";
import useCustomer from "./useCustomer";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const Customer = ({ show, handleClose, handleAddCustomer }) => {
  const {
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    loading,
    alertRef,
    handleInputChange,
    handleSubmit,
  } = useCustomer({
    onFormSubmit: (responseData) => {
      handleClose();
      handleAddCustomer(responseData);
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
        <Modal.Title>Add New Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="customerName" className="form-label">
              Customer Name
            </label>
            <input
              type="text"
              className={`form-control ${
                validFields.customerName ? "is-valid" : ""
              } ${validationErrors.customerName ? "is-invalid" : ""}`}
              id="customerName"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={(e) =>
                handleInputChange("customerName", e.target.value)
              }
              required
            />
            {validationErrors.customerName && (
              <div className="invalid-feedback">
                {validationErrors.customerName}
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
            Customer added successfully!
          </div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger mb-0" role="alert">
            Error adding custormer. Please try again.
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

export default Customer;

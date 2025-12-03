import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaSave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useSalesPerson from "./useSalesPerson";

const SalesPerson = ({ handleClose }) => {
  const {
    formData,
    validFields,
    validationErrors,
    handleInputChange,
    handleSubmit,
    loading,
  } = useSalesPerson({
    onFormSubmit: () => {
      handleClose();
    },
  });

  const getInputClassName = (fieldName) => {
    if (validFields[fieldName] === true) {
      return "form-control is-valid";
    } else if (validFields[fieldName] === false) {
      return "form-control is-invalid";
    }
    return "form-control";
  };

  return (
    <div className="min-vh-100 bg-light py-4 px-3">
      <div className="container-fluid" style={{ maxWidth: "1400px" }}>
        {/* Header */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-3">
            <i
              class="bi bi-arrow-left"
              onClick={handleClose}
              className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
            ></i>
            <div className="small">
              <CurrentDateTime />
            </div>
          </div>
          <div className="text-center">
            <h1 className="fw-bold mb-2 text-dark">
              <FaUser className="me-2" />
              Sales Person Registration
            </h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="row g-4">
          {/* Main Form Card */}
          <div className="col-lg-12">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 fw-semibold">
                  <FaIdCard className="me-2" />
                  Personal Information
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Sales Person Code */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Sales Person Code
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaIdCard className="text-dark" />
                      </span>
                      <input
                        type="text"
                        className={getInputClassName("salesPersonCode")}
                        placeholder="Eg:- SP-0001"
                        value={formData.salesPersonCode}
                        onChange={(e) =>
                          handleInputChange("salesPersonCode", e.target.value)
                        }
                      />
                      {validFields.salesPersonCode === true && (
                        <span className="input-group-text bg-success text-white">
                          <FaCheckCircle />
                        </span>
                      )}
                      {validFields.salesPersonCode === false && (
                        <span className="input-group-text bg-danger text-white">
                          <FaTimesCircle />
                        </span>
                      )}
                    </div>
                    {validationErrors.salesPersonCode && (
                      <div className="text-danger small mt-1">
                        {validationErrors.salesPersonCode}
                      </div>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      First Name
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaUser className="text-dark" />
                      </span>
                      <input
                        type="text"
                        className={getInputClassName("firstName")}
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                      {validFields.firstName === true && (
                        <span className="input-group-text bg-success text-white">
                          <FaCheckCircle />
                        </span>
                      )}
                      {validFields.firstName === false && (
                        <span className="input-group-text bg-danger text-white">
                          <FaTimesCircle />
                        </span>
                      )}
                    </div>
                    {validationErrors.firstName && (
                      <div className="text-danger small mt-1">
                        {validationErrors.firstName}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Last Name
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaUser className="text-dark" />
                      </span>
                      <input
                        type="text"
                        className={getInputClassName("lastName")}
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                      {validFields.lastName === true && (
                        <span className="input-group-text bg-success text-white">
                          <FaCheckCircle />
                        </span>
                      )}
                      {validFields.lastName === false && (
                        <span className="input-group-text bg-danger text-white">
                          <FaTimesCircle />
                        </span>
                      )}
                    </div>
                    {validationErrors.lastName && (
                      <div className="text-danger small mt-1">
                        {validationErrors.lastName}
                      </div>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Contact Number
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaPhone className="text-dark" />
                      </span>
                      <input
                        type="tel"
                        className={getInputClassName("contactNo")}
                        placeholder="Enter contact number"
                        value={formData.contactNo}
                        onChange={(e) =>
                          handleInputChange("contactNo", e.target.value)
                        }
                      />
                      {validFields.contactNo === true && (
                        <span className="input-group-text bg-success text-white">
                          <FaCheckCircle />
                        </span>
                      )}
                      {validFields.contactNo === false && (
                        <span className="input-group-text bg-danger text-white">
                          <FaTimesCircle />
                        </span>
                      )}
                    </div>
                    {validationErrors.contactNo && (
                      <div className="text-danger small mt-1">
                        {validationErrors.contactNo}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Email Address
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaEnvelope className="text-dark" />
                      </span>
                      <input
                        type="email"
                        className={getInputClassName("email")}
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                      {validFields.email === true && (
                        <span className="input-group-text bg-success text-white">
                          <FaCheckCircle />
                        </span>
                      )}
                      {validFields.email === false && (
                        <span className="input-group-text bg-danger text-white">
                          <FaTimesCircle />
                        </span>
                      )}
                    </div>
                    {validationErrors.email && (
                      <div className="text-danger small mt-1">
                        {validationErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Active Status */}
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          handleInputChange("isActive", e.target.checked)
                        }
                        style={{ width: "48px", height: "24px" }}
                      />
                      <label
                        className="form-check-label fw-semibold ms-2"
                        htmlFor="isActive"
                      >
                        Active Status
                        <small className="d-block text-muted fw-normal">
                          {formData.isActive
                            ? "Sales person is active"
                            : "Sales person is inactive"}
                        </small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-3 shadow p-4">
            <div className="d-flex flex-wrap gap-3 justify-content-start">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary px-5"
              >
                {loading ? (
                  <ButtonLoadingSpinner text="Creating..." />
                ) : (
                  "Create"
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="btn btn-secondary px-5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPerson;

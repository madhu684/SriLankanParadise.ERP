import React from "react";
import useCustomerUpdate from "./useCustomerUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const CustomerUpdate = ({ handleClose, customer }) => {
  const {
    customerTypes,
    formData,
    validFields,
    validationErrors,
    submissionStatus,
    alertRef,
    loading,
    salesPersonSearchTerm,
    setSalesPersonSearchTerm,
    validateForm,
    handleInputChange,
    handleFormSubmit,
    addDeliveryAddress,
    removeDeliveryAddress,
    handleDeliveryAddressChange,
    handleSelectSalesPerson,
    handleResetSalesPerson,
  } = useCustomerUpdate({
    customer,
    onFormSubmit: () => handleClose(),
  });

  return (
    <div className="min-vh-100 bg-light py-4 px-3">
      <div className="container-fluid" style={{ maxWidth: "1400px" }}>
        {/* Header */}
        <div className="bg-white rounded-3 shadow p-4 mb-4">
          <div ref={alertRef}></div>
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
            <h1 className="fw-bold mb-2">Customer Update</h1>
          </div>
        </div>

        {/* Status Messages */}
        {submissionStatus === "success" && (
          <div
            className="alert alert-success border-start border-5 border-success d-flex align-items-center mb-4 shadow-sm"
            role="alert"
          >
            <i className="bi bi-check-circle-fill fs-4 me-3"></i>
            <div>
              <strong>Success!</strong> Customer Updated successfully!
            </div>
          </div>
        )}

        {submissionStatus === "error" && (
          <div
            className="alert alert-danger border-start border-5 border-danger d-flex align-items-center mb-4 shadow-sm"
            role="alert"
          >
            <i className="bi bi-x-circle-fill fs-4 me-3"></i>
            <div>
              <strong>Error!</strong> Error updating customer. Please try again.
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="row g-4 mb-4">
          {/* Basic Information */}
          <div className="col-lg-6">
            <div className="bg-white rounded-3 shadow p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-2">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                  <i className="bi bi-person-fill text-primary fs-6"></i>
                </div>
                <h2 className="h5 fw-bold text-dark mb-0">Basic Information</h2>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Customer Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control ${
                    validFields.customerType ? "is-valid" : ""
                  } ${validationErrors.customerType ? "is-invalid" : ""}`}
                  value={formData.customerType}
                  onChange={(e) =>
                    handleInputChange("customerType", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select customer type
                  </option>
                  {customerTypes.map((customerType) => (
                    <option key={customerType.value} value={customerType.value}>
                      {customerType.label}
                    </option>
                  ))}
                </select>
                {validationErrors.customerName && (
                  <div className="invalid-feedback">
                    {validationErrors.customerName}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Customer Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.customerName ? "is-valid" : ""
                  } ${validationErrors.customerName ? "is-invalid" : ""}`}
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                />
                {validationErrors.customerName && (
                  <div className="invalid-feedback">
                    {validationErrors.customerName}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Customer Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.customerCode ? "is-valid" : ""
                  } ${validationErrors.customerCode ? "is-invalid" : ""}`}
                  placeholder="Enter customer code"
                  value={formData.customerCode}
                  onChange={(e) =>
                    handleInputChange("customerCode", e.target.value)
                  }
                />
                {validationErrors.customerCode && (
                  <div className="invalid-feedback">
                    {validationErrors.customerCode}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label ">
                  Contact Person <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${
                    validFields.contactPerson ? "is-valid" : ""
                  } ${validationErrors.contactPerson ? "is-invalid" : ""}`}
                  placeholder="Enter contact person"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                />
                {validationErrors.contactPerson && (
                  <div className="invalid-feedback">
                    {validationErrors.contactPerson}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label ">
                  <i className="bi bi-telephone-fill me-2"></i>Phone Number{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${
                    validFields.phone ? "is-valid" : ""
                  } ${validationErrors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                {validationErrors.phone && (
                  <div className="invalid-feedback">
                    {validationErrors.phone}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label ">
                  <i className="bi bi-envelope-fill me-2"></i>Email{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control  ${
                    validFields.email ? "is-valid" : ""
                  } ${validationErrors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {validationErrors.email && (
                  <div className="invalid-feedback">
                    {validationErrors.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="col-lg-6">
            <div className="bg-white rounded-3 shadow p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-2 border-purple">
                <div
                  className="p-2 rounded-3"
                  style={{ backgroundColor: "rgba(111, 66, 193, 0.1)" }}
                >
                  <i
                    className="bi bi-building-fill fs-6"
                    style={{ color: "#6f42c1" }}
                  ></i>
                </div>
                <h2 className="h5 fw-bold text-dark mb-0">
                  Business Information
                </h2>
              </div>

              <div className="mb-3">
                <label className="form-label ">
                  <i className="bi bi-file-text-fill me-2"></i>License Number{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${
                    validFields.lisenNumber ? "is-valid" : ""
                  } ${validationErrors.lisenNumber ? "is-invalid" : ""}`}
                  placeholder="Enter license number"
                  value={formData.lisenNumber}
                  onChange={(e) =>
                    handleInputChange("lisenNumber", e.target.value)
                  }
                />
                {validationErrors.lisenNumber && (
                  <div className="invalid-feedback">
                    {validationErrors.lisenNumber}
                  </div>
                )}
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label ">
                    <i className="bi bi-calendar-fill me-2"></i>License Start
                    Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control  ${
                      validFields.lisenStartDate ? "is-valid" : ""
                    } ${validationErrors.lisenStartDate ? "is-invalid" : ""}`}
                    value={formData.lisenStartDate}
                    onChange={(e) =>
                      handleInputChange("lisenStartDate", e.target.value)
                    }
                  />
                  {validationErrors.lisenStartDate && (
                    <div className="invalid-feedback">
                      {validationErrors.lisenStartDate}
                    </div>
                  )}
                </div>

                <div className="col-6">
                  <label className="form-label ">
                    <i className="bi bi-calendar-fill me-2"></i>License End Date{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control  ${
                      validFields.lisenEndDate ? "is-valid" : ""
                    } ${validationErrors.lisenEndDate ? "is-invalid" : ""}`}
                    value={formData.lisenEndDate}
                    onChange={(e) =>
                      handleInputChange("lisenEndDate", e.target.value)
                    }
                  />
                  {validationErrors.lisenEndDate && (
                    <div className="invalid-feedback">
                      {validationErrors.lisenEndDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label ">
                  Business Registration No{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${
                    validFields.businessRegNo ? "is-valid" : ""
                  } ${validationErrors.businessRegNo ? "is-invalid" : ""}`}
                  placeholder="Enter business registration number"
                  value={formData.businessRegNo}
                  onChange={(e) =>
                    handleInputChange("businessRegNo", e.target.value)
                  }
                />
                {validationErrors.businessRegNo && (
                  <div className="invalid-feedback">
                    {validationErrors.businessRegNo}
                  </div>
                )}
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label ">
                    <i className="bi bi-credit-card-fill me-2"></i>Credit Limit
                    (LKR) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control  ${
                      validFields.creditLimit ? "is-valid" : ""
                    } ${validationErrors.creditLimit ? "is-invalid" : ""}`}
                    placeholder="0.00"
                    value={formData.creditLimit}
                    onChange={(e) =>
                      handleInputChange("creditLimit", e.target.value)
                    }
                  />
                  {validationErrors.creditLimit && (
                    <div className="invalid-feedback">
                      {validationErrors.creditLimit}
                    </div>
                  )}
                </div>

                <div className="col-6">
                  <label className="form-label ">
                    Credit Duration (Days){" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control  ${
                      validFields.creditDuration ? "is-valid" : ""
                    } ${validationErrors.creditDuration ? "is-invalid" : ""}`}
                    placeholder="0"
                    value={formData.creditDuration}
                    onChange={(e) =>
                      handleInputChange("creditDuration", e.target.value)
                    }
                  />
                  {validationErrors.creditDuration && (
                    <div className="invalid-feedback">
                      {validationErrors.creditDuration}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3 p-3 bg-light rounded-3">
                <label className="form-label  mb-3">
                  Is VAT Registered? <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="isVatRegistered"
                      value="1"
                      id="vatRegisteredYes"
                      checked={formData.isVatRegistered === "1"}
                      onChange={(e) =>
                        handleInputChange("isVatRegistered", e.target.value)
                      }
                    />
                    <label
                      className="form-check-label "
                      htmlFor="vatRegisteredYes"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="isVatRegistered"
                      value="0"
                      id="vatRegistrationNo"
                      checked={formData.isVatRegistered === "0"}
                      onChange={(e) =>
                        handleInputChange("isVatRegistered", e.target.value)
                      }
                    />
                    <label
                      className="form-check-label "
                      htmlFor="vatRegistrationNo"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>

              {formData.isVatRegistered === "1" && (
                <div className="mb-3">
                  <label className="form-label ">
                    VAT Registration No <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      validFields.vatRegistrationNo ? "is-valid" : ""
                    } ${
                      validationErrors.vatRegistrationNo ? "is-invalid" : ""
                    }`}
                    placeholder="Enter VAT registration number"
                    value={formData.vatRegistrationNo}
                    onChange={(e) =>
                      handleInputChange("vatRegistrationNo", e.target.value)
                    }
                  />
                  {validationErrors.vatRegistrationNo && (
                    <div className="invalid-feedback">
                      {validationErrors.vatRegistrationNo}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-3 shadow p-4">
          <div className="d-flex flex-wrap gap-3 justify-content-start">
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={loading || submissionStatus !== null}
              className="btn btn-primary px-5"
            >
              {loading && submissionStatus === null ? (
                <ButtonLoadingSpinner text="Updating..." />
              ) : (
                "Update Customer"
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
  );
};

export default CustomerUpdate;

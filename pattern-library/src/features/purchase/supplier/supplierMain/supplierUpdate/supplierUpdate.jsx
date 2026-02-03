import React from "react";
import useSupplierUpdate from "./useSupplierUpdate";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import LoadingSpinner from "common/components/loadingSpinner/loadingSpinner";
import ErrorComponent from "common/components/errorComponent/errorComponent";
import { API_BASE_URL } from "common/utility/api";
import DefaultSupplierLogo from "assets/images/supplier-defaulf-logo.svg";
import ButtonLoadingSpinner from "common/components/loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import { ListGroup } from "react-bootstrap";

const SupplierUpdate = ({ handleClose, supplier, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    categories,
    unitOptions,
    itemTypes,
    isLoading,
    error,
    isError,
    loading,
    loadingDraft,
    companyTypes,
    isCompanyTypesLoading,
    isCompanyTypesError,
    businessTypes,
    isBusinessTypesLoading,
    isBusinessTypesError,
    isLoadingSupplierLogo,
    isSupplierLogoError,
    supplierLogo,
    attachmentsToDelete,
    handleInputChange,
    handleSubmit,
    handleRemoveCategory,
    handleLogoUpload,
    handleAttachmentChange,
    handleDeleteAttachment,
  } = useSupplierUpdate({
    supplier,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  if (isLoading || isCompanyTypesLoading || isBusinessTypesLoading) {
    return <LoadingSpinner />;
  }

  if (isError || isCompanyTypesError || isBusinessTypesError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            class="bi bi-arrow-left"
            onClick={handleClose}
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Supplier</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Supplier updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Supplier saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating supplier. Please try again.
        </div>
      )}

      <form>
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Basic Information */}
            <h4>1. Basic Information</h4>
            <div className="mb-3 mt-3">
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
              <label htmlFor="AddressLine1" className="form-label">
                Address Line 1
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.addressLine1 ? "is-valid" : ""
                } ${validationErrors.addressLine1 ? "is-invalid" : ""}`}
                id="AddressLine1"
                placeholder="Enter Address Line 1"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
                required
              />
              {validationErrors.addressLine1 && (
                <div className="invalid-feedback">
                  {validationErrors.addressLine1}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="AddressLine2" className="form-label">
                Address Line 2
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.addressLine2 ? "is-valid" : ""
                } ${validationErrors.addressLine2 ? "is-invalid" : ""}`}
                id="AddressLine2"
                placeholder="Enter Address Line 2"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                }
                required
              />
              {validationErrors.addressLine2 && (
                <div className="invalid-feedback">
                  {validationErrors.addressLine2}
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
                Mobile Number
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.phone ? "is-valid" : ""
                } ${validationErrors.phone ? "is-invalid" : ""}`}
                id="phone"
                placeholder="Enter mobile number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
              {validationErrors.phone && (
                <div className="invalid-feedback">{validationErrors.phone}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">
                Office contact number
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.contactNumber ? "is-valid" : ""
                } ${validationErrors.contactNumber ? "is-invalid" : ""}`}
                id="contactNumber"
                placeholder="Enter office contact number"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                required
              />
              {validationErrors.contactNumber && (
                <div className="invalid-feedback">
                  {validationErrors.contactNumber}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className={`form-control ${
                  validFields.email ? "is-valid" : ""
                } ${validationErrors.email ? "is-invalid" : ""}`}
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
            <div className="mb-3">
              <label htmlFor="categories" className="form-label">
                Category
              </label>
              <select
                id="categories"
                className="form-select"
                multiple
                value={formData.categories}
                onChange={(e) =>
                  handleInputChange(
                    "categories",
                    Array.from(e.target.selectedOptions, (option) =>
                      parseInt(option.value),
                    ),
                  )
                }
                size="4"
              >
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <small className="form-text text-muted">
                Multiple categories can be selected
              </small>
            </div>
            {/* Display selected categories */}
            {formData.categories.length >= 1 && (
              <div>
                <p>Selected Categories:</p>
                <ListGroup>
                  {formData.categories?.map((categoryId) => {
                    const selectedCategory = categories.find(
                      (category) =>
                        category.categoryId === parseInt(categoryId),
                    );
                    return (
                      <ListGroup.Item
                        key={categoryId}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {selectedCategory?.categoryName}
                        {/* Remove button (x icon) */}
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveCategory(categoryId)}
                        >
                          <i className="bi bi-x text-danger fs-5"></i>
                        </span>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            )}
          </div>

          <div className="col-md-5">
            {/* Business Information */}
            <h4>2. Business Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="BusinessRegistrationNo" className="form-label">
                Business Registration No
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.businessRegistrationNo ? "is-valid" : ""
                } ${
                  validationErrors.businessRegistrationNo ? "is-invalid" : ""
                }`}
                id="BusinessRegistrationNo"
                placeholder="Enter Business Registration No"
                value={formData.businessRegistrationNo}
                onChange={(e) =>
                  handleInputChange("businessRegistrationNo", e.target.value)
                }
                required
              />
              {validationErrors.businessRegistrationNo && (
                <div className="invalid-feedback">
                  {validationErrors.businessRegistrationNo}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="VATRegistrationNo" className="form-label">
                VAT Registration No
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.vatRegistrationNo ? "is-valid" : ""
                } ${validationErrors.vatRegistrationNo ? "is-invalid" : ""}`}
                id="VATRegistrationNo"
                placeholder="Enter VAT Registration No"
                value={formData.vatRegistrationNo}
                onChange={(e) =>
                  handleInputChange("vatRegistrationNo", e.target.value)
                }
                required
              />
              {validationErrors.vatRegistrationNo && (
                <div className="invalid-feedback">
                  {validationErrors.vatRegistrationNo}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="CompanyTypeId" className="form-label">
                Company Type
              </label>
              <select
                id="CompanyTypeId"
                className={`form-select ${
                  validFields.companyTypeId ? "is-valid" : ""
                } ${validationErrors.companyTypeId ? "is-invalid" : ""}`}
                onChange={(e) =>
                  handleInputChange("companyTypeId", e.target.value)
                }
                value={formData.companyTypeId}
                required
              >
                <option value="">Select Company Type</option>
                {/* Populate dropdown options dynamically */}
                {companyTypes?.map((type) => (
                  <option key={type.companyTypeId} value={type.companyTypeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              {validationErrors.companyTypeId && (
                <div className="invalid-feedback">
                  {validationErrors.companyTypeId}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="BusinessTypeId" className="form-label">
                Nature of Business
              </label>
              <select
                id="BusinessTypeId"
                className={`form-select ${
                  validFields.businessTypeId ? "is-valid" : ""
                } ${validationErrors.businessTypeId ? "is-invalid" : ""}`}
                onChange={(e) =>
                  handleInputChange("businessTypeId", e.target.value)
                }
                value={formData.businessTypeId}
                required
              >
                <option value="">Select Business Type</option>
                {/* Populate dropdown options dynamically */}
                {businessTypes?.map((type) => (
                  <option key={type.businessTypeId} value={type.businessTypeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              {validationErrors.businessTypeId && (
                <div className="invalid-feedback">
                  {validationErrors.businessTypeId}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="supplierLogo" className="form-label">
                Supplier Logo
              </label>
              <input
                type="file"
                className={`form-control ${
                  validFields.supplierLogo ? "is-valid" : ""
                } ${validationErrors.supplierLogo ? "is-invalid" : ""}`}
                id="supplierLogo"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e.target.files[0])}
              />
              <div className="mb-2">
                <small className="form-text text-muted">
                  File size limit: 1MB
                </small>
              </div>

              {formData.supplierLogo ? (
                <img
                  src={URL.createObjectURL(formData.supplierLogo)}
                  alt="Supplier Logo"
                  className="img-thumbnail mt-2"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <img
                  src={supplierLogo || DefaultSupplierLogo}
                  alt="Default Supplier Logo"
                  className="img-thumbnail mt-2"
                  width="100px"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              )}
              {validationErrors.supplierLogo && (
                <div className="invalid-feedback">
                  {validationErrors.supplierLogo}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="Rating" className="form-label">
                Rating (out of 5)
              </label>
              <input
                type="range"
                id="Rating"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  handleInputChange("rating", parseFloat(e.target.value))
                }
                className={`form-range ${
                  validFields.rating ? "is-valid" : ""
                } ${validationErrors.rating ? "is-invalid" : ""}`}
              />
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  const fillPercentage = (formData.rating - index) * 100;
                  const starFill = fillPercentage >= 100 ? 100 : fillPercentage;
                  return (
                    <span key={index}>
                      <svg
                        key={index}
                        className="bi bi-star-fill"
                        width="1.8em"
                        height="1.8em"
                        viewBox="0 0 20 20"
                        fill={"var(--bs-gray-300)"}
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => handleInputChange("rating", ratingValue)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                        />
                        <defs>
                          <linearGradient
                            id={`fill-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset={`${starFill}%`}
                              style={{ stopColor: "gold" }}
                            />
                            <stop
                              offset={`${starFill}%`}
                              style={{ stopColor: "transparent" }}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          fill={`url(#fill-${index})`}
                          fillRule="evenodd"
                          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                        />
                      </svg>{" "}
                    </span>
                  );
                })}
                <span className="rating-number" style={{ fontSize: "1.1rem" }}>
                  {"  "}
                  {formData.rating.toFixed(1)}
                </span>
              </div>
              {validationErrors.rating && (
                <div className="invalid-feedback">
                  {validationErrors.rating}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="Remarks" className="form-label">
                Remarks
              </label>
              <textarea
                className={`form-control ${
                  validFields.remarks ? "is-valid" : ""
                } ${validationErrors.remarks ? "is-invalid" : ""}`}
                id="Remarks"
                placeholder="Enter Remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                maxLength={200}
              />
              {validationErrors.remarks && (
                <div className="invalid-feedback">
                  {validationErrors.remarks}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <h4>3. Status</h4>
        <div className="col-md-6 mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className={`form-select ${validFields.status ? "is-valid" : ""} ${
              validationErrors.status ? "is-invalid" : ""
            }`}
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <option value="">Select status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
            <option value="99">Blacklist</option>
          </select>
          {validationErrors.status && (
            <div className="invalid-feedback">{validationErrors.status}</div>
          )}
        </div>

        {/* Attachments */}
        <h4>4. Attachments</h4>
        <div className="col-md-6 mb-3">
          <label htmlFor="attachment" className="form-label">
            Attachments (if any)
          </label>
          <input
            type="file"
            className={`form-control ${
              validFields.attachments ? "is-valid" : ""
            } ${validationErrors.attachments ? "is-invalid" : ""}`}
            id="attachment"
            onChange={(e) => handleAttachmentChange(e.target.files)}
            multiple
          />
          <small className="form-text text-muted">File size limit: 10MB</small>
          {validationErrors.attachments && (
            <div className="invalid-feedback">
              {validationErrors.attachments}
            </div>
          )}
        </div>
        <div className="list-group mt-2 mb-3">
          {supplier.supplierAttachments?.length === 0 ? (
            <p className="list-group-item list-group-item-action text-muted">
              No attachments found
            </p>
          ) : (
            supplier.supplierAttachments
              ?.filter(
                (attachment) =>
                  !attachmentsToDelete.includes(
                    attachment.supplierAttachmentId,
                  ),
              )
              .map((attachment, index) => {
                // Split the attachment path by the directory separator
                const parts = attachment.attachmentPath.split("\\");
                // Extract the last part, which is the file name
                const fileName = parts[parts.length - 1];

                return (
                  <div
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center "
                  >
                    <div>
                      <a
                        href={`${API_BASE_URL}/supplierAttachment/attachment/${attachment.supplierAttachmentId}`} // Replace '/' with the appropriate URL prefix
                        className="d-flex align-items-center"
                        target="_blank" // Open link in a new tab
                      >
                        <i
                          className="bi bi-file-earmark-text text-info me-2"
                          style={{ marginRight: "0.5rem" }}
                        ></i>
                        {fileName}
                      </a>
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      type="button"
                      onClick={() =>
                        handleDeleteAttachment(attachment.supplierAttachmentId)
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                );
              })
          )}
        </div>

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => handleSubmit(false)}
            disabled={loading || loadingDraft || submissionStatus !== null}
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
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierUpdate;

import React from "react";
import useItemMasterUpdate from "./useItemMasterUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const ItemMasterUpdate = ({ handleClose, itemMaster, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    categoryOptions,
    unitOptions,
    itemTypes,
    loading,
    loadingDraft,
    handleInputChange,
    handleSubmit,
  } = useItemMasterUpdate({
    itemMaster,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <img
            src="path/to/your/logo.png"
            alt="Company Logo"
            className="img-fluid"
          />
          <p>
            {" "}
            Date and Time: <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Item Master</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Item master updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Item master updated and saved as draft, you can edit and create it
          later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error updating item master. Please try again.
        </div>
      )}

      <form>
        {/* Item Master Information */}
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>Item Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="itemName" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.itemName ? "is-valid" : ""
                } ${validationErrors.itemName ? "is-invalid" : ""}`}
                id="itemName"
                placeholder="Enter Item Name"
                value={formData.itemName}
                onChange={(e) => handleInputChange("itemName", e.target.value)}
                required
              />
              {validationErrors.itemName && (
                <div className="invalid-feedback">
                  {validationErrors.itemName}
                </div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="itemType" className="form-label">
                Item Type
              </label>
              <select
                className={`form-select ${
                  validFields.itemTypeId ? "is-valid" : ""
                } ${validationErrors.itemTypeId ? "is-invalid" : ""}`}
                id="itemType"
                value={formData.itemTypeId}
                onChange={(e) =>
                  handleInputChange("itemTypeId", e.target.value)
                }
                required
              >
                <option value="">Select Item Type</option>
                {/* Assuming you have an array of item types */}
                {itemTypes.map((type) => (
                  <option key={type.itemTypeId} value={type.itemTypeId}>
                    {type.name}
                  </option>
                ))}
              </select>
              {validationErrors.itemTypeId && (
                <div className="invalid-feedback">
                  {validationErrors.itemTypeId}
                </div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="categoryId" className="form-label">
                Category
              </label>
              <select
                className={`form-select ${
                  validFields.categoryId ? "is-valid" : ""
                } ${validationErrors.categoryId ? "is-invalid" : ""}`}
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  handleInputChange("categoryId", e.target.value)
                }
                required
              >
                <option value="">Select Category</option>
                {categoryOptions?.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {validationErrors.categoryId && (
                <div className="invalid-feedback">
                  {validationErrors.categoryId}
                </div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="unitId" className="form-label">
                Unit
              </label>
              <select
                className={`form-select ${
                  validFields.unitId ? "is-valid" : ""
                } ${validationErrors.unitId ? "is-invalid" : ""}`}
                id="unitId"
                value={formData.unitId}
                onChange={(e) => handleInputChange("unitId", e.target.value)}
                required
              >
                <option value="">Select Unit</option>
                {unitOptions?.map((unit) => (
                  <option key={unit.unitId} value={unit.unitId}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
              {validationErrors.unitId && (
                <div className="invalid-feedback">
                  {validationErrors.unitId}
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
            className="btn btn-secondary me-2"
            onClick={() => handleSubmit(true)}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            {loadingDraft && submissionStatus === null ? (
              <ButtonLoadingSpinner text="Saving as Draft..." />
            ) : (
              "Save as Draft"
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

export default ItemMasterUpdate;

import React from "react";
import useItemMaster from "./useItemMaster";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";

const ItemMaster = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    validFields,
    validationErrors,
    categoryOptions,
    unitOptions,
    itemTypes,
    submissionStatus,
    alertRef,
    loading,
    loadingDraft,
    isError,
    isLoading,
    error,
    isMeasurementTypesLoading,
    isMeasurementTypesError,
    measurementTypes,
    isItemsLoading,
    isItemsError,
    itemsError,
    availableItems,
    searchTerm,
    selectedParentItem,
    setSearchTerm,
    handleInputChange,
    handleSubmit,
    handleSelectItem,
    handleResetParentItem,
  } = useItemMaster({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={error} />;
  }

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
        <h1 className="mt-2 text-center">Item Master</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Item master created successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Item master saved as draft, you can edit and create it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error creating item master. Please try again.
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
              <label htmlFor="itemCode" className="form-label">
                Item Code
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.itemCode ? "is-valid" : ""
                } ${validationErrors.itemCode ? "is-invalid" : ""}`}
                id="itemCode"
                placeholder="Enter Item Code"
                value={formData.itemCode}
                onChange={(e) => handleInputChange("itemCode", e.target.value)}
                required
              />
              {validationErrors.itemCode && (
                <div className="invalid-feedback">
                  {validationErrors.itemCode}
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
                {itemTypes?.map((type) => (
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
              <label htmlFor="measurementType" className="form-label">
                Measurement Type
              </label>
              <select
                className={`form-select ${
                  validFields.measurementType ? "is-valid" : ""
                } ${validationErrors.measurementType ? "is-invalid" : ""}`}
                id="measurementType"
                value={formData.measurementType}
                onChange={(e) =>
                  handleInputChange("measurementType", e.target.value)
                }
                required
              >
                <option value="">Select measurement Type</option>
                {/* Assuming you have an array of measurement types */}
                {measurementTypes?.map((type) => (
                  <option
                    key={type.measurementTypeId}
                    value={type.measurementTypeId}
                  >
                    {type.name}
                  </option>
                ))}
              </select>
              {validationErrors.measurementType && (
                <div className="invalid-feedback">
                  {validationErrors.measurementType}
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
                disabled={formData.measurementType === ""}
              >
                <option value="">Select Unit</option>
                {unitOptions
                  ?.filter(
                    (u) =>
                      u.measurementTypeId === parseInt(formData.measurementType)
                  )
                  .map((unit) => (
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
            <h4>Inventory Valuation</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="inventoryMeasurementType" className="form-label">
                Measurement Type
              </label>
              <select
                className={`form-select ${
                  validFields.inventoryMeasurementType ? "is-valid" : ""
                } ${
                  validationErrors.inventoryMeasurementType ? "is-invalid" : ""
                }`}
                id="inventoryMeasurementType"
                value={formData.inventoryMeasurementType}
                onChange={(e) =>
                  handleInputChange("inventoryMeasurementType", e.target.value)
                }
                required
                disabled={selectedParentItem !== ""}
              >
                <option value="">Select measurement Type</option>
                {/* Assuming you have an array of measurement types */}
                {measurementTypes?.map((type) => (
                  <option
                    key={type.measurementTypeId}
                    value={type.measurementTypeId}
                  >
                    {type.name}
                  </option>
                ))}
              </select>
              {validationErrors.inventoryMeasurementType && (
                <div className="invalid-feedback">
                  {validationErrors.inventoryMeasurementType}
                </div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="inventoryUnitId" className="form-label">
                Unit
              </label>
              <select
                className={`form-select ${
                  validFields.inventoryUnitId ? "is-valid" : ""
                } ${validationErrors.inventoryUnitId ? "is-invalid" : ""}`}
                id="inventoryUnitId"
                value={formData.inventoryUnitId}
                onChange={(e) =>
                  handleInputChange("inventoryUnitId", e.target.value)
                }
                required
                disabled={
                  formData.inventoryMeasurementType === "" ||
                  selectedParentItem !== ""
                }
              >
                <option value="">Select Unit</option>
                {unitOptions
                  ?.filter(
                    (u) =>
                      u.measurementTypeId ===
                      parseInt(formData.inventoryMeasurementType)
                  )
                  .map((unit) => (
                    <option key={unit.unitId} value={unit.unitId}>
                      {unit.unitName}
                    </option>
                  ))}
              </select>
              {validationErrors.inventoryUnitId && (
                <div className="invalid-feedback">
                  {validationErrors.inventoryUnitId}
                </div>
              )}
            </div>
            {formData.inventoryUnitId && formData.unitId && (
              <div className="mb-3 mt-3">
                <label htmlFor="conversionValue" className="form-label">
                  How many{" "}
                  <span className="fw-bold text-primary">
                    {unitOptions
                      .find(
                        (u) => u.unitId === parseInt(formData.inventoryUnitId)
                      )
                      .unitName.toLowerCase()}
                  </span>{" "}
                  in one{" "}
                  <span className="fw-bold text-primary">
                    {unitOptions
                      .find((u) => u.unitId === parseInt(formData.unitId))
                      .unitName.toLowerCase()}
                  </span>
                  ?
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    validFields.conversionValue ? "is-valid" : ""
                  } ${validationErrors.conversionValue ? "is-invalid" : ""}`}
                  id="conversionValue"
                  value={formData.conversionValue}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    const positiveValue = isNaN(value) ? 0 : Math.max(0, value);
                    handleInputChange("conversionValue", positiveValue);
                  }}
                  required
                />

                {validationErrors.conversionValue && (
                  <div className="invalid-feedback">
                    {validationErrors.conversionValue}
                  </div>
                )}
              </div>
            )}

            <div className="mb-3 mt-3">
              <label htmlFor="reorderLevel" className="form-label">
                Reorder level
              </label>
              <input
                type="number"
                className={`form-control ${
                  validFields.reorderLevel ? "is-valid" : ""
                } ${validationErrors.reorderLevel ? "is-invalid" : ""}`}
                id="reorderLevel"
                placeholder="Enter Reorder Level"
                value={formData.reorderLevel}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const positiveValue = isNaN(value) ? 0 : Math.max(0, value);
                  handleInputChange("reorderLevel", positiveValue);
                }}
                required
              />
              {validationErrors.reorderLevel && (
                <div className="invalid-feedback">
                  {validationErrors.reorderLevel}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-5">
            <h4>Item Hierarchy</h4>
            {/* Other form fields */}
            <div className="mb-3 mt-3">
              <label htmlFor="itemHierarchy" className="form-label">
                Hierarchy Type (Main Item/ Sub Item)?
              </label>
              <select
                className={`form-select ${
                  validFields.itemHierarchy ? "is-valid" : ""
                } ${validationErrors.itemHierarchy ? "is-invalid" : ""}`}
                id="itemHierarchy"
                value={formData.itemHierarchy}
                onChange={(e) =>
                  handleInputChange("itemHierarchy", e.target.value)
                }
                required
              >
                <option value="">Select Item Type</option>
                <option value="main">Main Item</option>
                <option value="sub">Sub Item</option>
              </select>
              {validationErrors.itemHierarchy && (
                <div className="invalid-feedback">
                  {validationErrors.itemHierarchy}
                </div>
              )}
            </div>

            {formData.itemHierarchy === "sub" && selectedParentItem === "" && (
              <div className="mb-3 mt-4">
                {/* Item Search */}
                <div className="mb-0 mt-3">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for a parent item..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <span
                        className="input-group-text bg-transparent"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </span>
                    )}
                  </div>

                  {/* Dropdown for filtered items */}
                  {searchTerm && (
                    <div className="dropdown" style={{ width: "100%" }}>
                      <ul
                        className="dropdown-menu"
                        style={{
                          display: "block",
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {isItemsLoading ? (
                          <li className="dropdown-item">
                            <ButtonLoadingSpinner text="Searching..." />
                          </li>
                        ) : isItemsError ? (
                          <li className="dropdown-item">
                            Error: {itemsError.message}
                          </li>
                        ) : availableItems === null ? (
                          <li className="dropdown-item">
                            <span className="me-3">
                              <i className="bi bi-emoji-frown"></i>
                            </span>
                            No items found
                          </li>
                        ) : (
                          availableItems?.map((item) => (
                            <li key={item.itemMasterId}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => handleSelectItem(item)}
                              >
                                <span className="me-3">
                                  <i className="bi bi-cart4"></i>
                                </span>{" "}
                                {item.itemName}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="form-text text-muted">
                      Please search for a parent item for this sub item and add
                      it
                    </small>
                  </div>
                  {validationErrors.selectedParentItem && (
                    <div className="text-danger">
                      {validationErrors.selectedParentItem}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedParentItem && (
              <div className="card border-success mb-3 mt-4">
                <div className="card-header">Selected Parent Item</div>
                <div className="card-body">
                  <p>Item Name: {selectedParentItem.itemName}</p>
                  <p>Item Type: {selectedParentItem.itemType?.name}</p>
                  <p>Category: {selectedParentItem.category.categoryName}</p>
                  <hr />
                  <p>
                    Measurement Type:{" "}
                    {selectedParentItem.unit?.measurementType?.name}
                  </p>
                  <p>Unit: {selectedParentItem.unit?.unitName}</p>
                  <button
                    type="button"
                    className="btn btn-outline-danger float-end"
                    onClick={handleResetParentItem}
                  >
                    Reset Parent Item
                  </button>
                </div>
              </div>
            )}
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
              <ButtonLoadingSpinner text="Creating..." />
            ) : (
              "Create"
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

export default ItemMaster;

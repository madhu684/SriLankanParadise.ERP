import React from "react";
import useItemMaster from "./useItemMaster";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";

const ItemMaster = ({ handleClose, handleUpdated, setShowCreateIMForm }) => {
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
    isChildItemsLoading,
    isItemsError,
    isChildItemsError,
    itemsError,
    childItemsError,
    availableItems,
    availableChildItems,
    searchTerm,
    searchChildTerm,
    selectedParentItem,
    selectedChildItems,
    itemCode,
    supplierSearchTerm,
    availableSuppliers,
    isSuppliersLoading,
    isSuppliersError,
    suppliersError,
    isSupplierSelected,
    handleSupplierChange,
    handleResetSupplier,
    setSearchTerm,
    setSupplierSearchTerm,
    setSearchChildTerm,
    handleInputChange,
    handleSubmit,
    handleSelectItem,
    handleResetParentItem,
    handleSelectSubItem,
    handleRemoveChildItem,
    handleChildItemQuantityChange,
  } = useItemMaster({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const handleBack = () => {
    setShowCreateIMForm(false);
  };

  // NEW CODE: Check if selected item type is Service
  const isServiceItemType = () => {
    const selectedItemType = itemTypes?.find(
      (type) => type.itemTypeId === parseInt(formData.itemTypeId)
    );
    return selectedItemType?.name === "Service";
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={error} />;
  }

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
          <i
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
            onClick={handleClose}
          ></i>
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
          Item master created successfully! Item Code : {formData.itemCode}
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

            {!isServiceItemType() && (
              <>
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
                    onChange={(e) =>
                      handleInputChange("unitId", e.target.value)
                    }
                    required
                    disabled={formData.measurementType === ""}
                  >
                    <option value="">Select Unit</option>
                    {unitOptions
                      ?.filter(
                        (u) =>
                          u.measurementTypeId ===
                          parseInt(formData.measurementType)
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
              </>
            )}

            <div className="mb-3 mt-3">
              <label htmlFor="unitPrice" className="form-label">
                Unit Price
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.unitPrice ? "is-valid" : ""
                } ${validationErrors.unitPrice ? "is-invalid" : ""}`}
                id="unitPrice"
                placeholder="Enter Unit Price"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                required
              />
              {validationErrors.unitPrice && (
                <div className="invalid-feedback">
                  {validationErrors.unitPrice}
                </div>
              )}
            </div>
            {!isServiceItemType() && (
              <div>
                <h4>Inventory Valuation</h4>
                <div className="mb-3 mt-3">
                  <label
                    htmlFor="inventoryMeasurementType"
                    className="form-label"
                  >
                    Measurement Type
                  </label>
                  <select
                    className={`form-select ${
                      validFields.inventoryMeasurementType ? "is-valid" : ""
                    } ${
                      validationErrors.inventoryMeasurementType
                        ? "is-invalid"
                        : ""
                    }`}
                    id="inventoryMeasurementType"
                    value={formData.inventoryMeasurementType}
                    onChange={(e) =>
                      handleInputChange(
                        "inventoryMeasurementType",
                        e.target.value
                      )
                    }
                    required
                    disabled={selectedParentItem !== ""}
                  >
                    <option value="">Select measurement Type</option>
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
                            (u) =>
                              u.unitId === parseInt(formData.inventoryUnitId)
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
                      } ${
                        validationErrors.conversionValue ? "is-invalid" : ""
                      }`}
                      id="conversionValue"
                      value={formData.conversionValue}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const positiveValue = isNaN(value)
                          ? 0
                          : Math.max(0, value);
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

                {/* <div className="mb-3 mt-3">
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
                      const positiveValue = isNaN(value)
                        ? 0
                        : Math.max(0, value);
                      handleInputChange("reorderLevel", positiveValue);
                    }}
                    required
                  />
                  {validationErrors.reorderLevel && (
                    <div className="invalid-feedback">
                      {validationErrors.reorderLevel}
                    </div>
                  )}
                </div> */}

                {/* Supplier tagging */}
                <h4>Supplier Tagging</h4>
                <div className="mb-3 mt-3">
                  <label htmlFor="itemHierarchy" className="form-label">
                    Supplier
                  </label>

                  <div className="mb-0">
                    {!isSupplierSelected && (
                      <div className="input-group">
                        <span className="input-group-text bg-transparent">
                          <i className="bi bi-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search for a supplier..."
                          value={supplierSearchTerm}
                          onChange={(e) =>
                            setSupplierSearchTerm(e.target.value)
                          }
                          autoFocus={false}
                        />
                        {supplierSearchTerm && (
                          <span
                            className="input-group-text bg-transparent"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => setSupplierSearchTerm("")}
                          >
                            <i className="bi bi-x"></i>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Dropdown for filtered suppliers */}
                    {supplierSearchTerm && (
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
                          {availableSuppliers?.map((supplier) => (
                            <li key={supplier.supplierId}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleSupplierChange(supplier)}
                              >
                                <span className="me-3">
                                  <i className="bi bi-file-earmark-text"></i>
                                </span>{" "}
                                {supplier.supplierName}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {supplierSearchTerm === null && (
                      <div className="mb-3">
                        <small className="form-text text-muted">
                          {/* {validationErrors.trnId && (
                        <div className="text-danger mb-1">
                          {validationErrors.trnId}
                        </div>
                      )} */}
                          Please search for a supplier and select it
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Supplier Information */}
                {isSupplierSelected && (
                  <div className="card mb-3">
                    <div className="card-header">Selected Supplier</div>
                    <div className="card-body">
                      <p>
                        <strong>Supplier Name:</strong>{" "}
                        {formData.supplier.supplierName}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.supplier.email}
                      </p>
                      <p>
                        <strong>Contact No:</strong> {formData.supplier.phone}
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-danger float-end"
                        onClick={handleResetSupplier}
                      >
                        Reset Supplier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-md-5">
            {!isServiceItemType() && (
              <>
                <h4>Item Prices</h4>
                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="costRatio"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Cost Ratio :
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.costRatio ? "is-valid" : ""
                    } ${validationErrors.costRatio ? "is-invalid" : ""}`}
                    id="costRatio"
                    placeholder="Enter Cost Ratio"
                    value={formData.costRatio}
                    onChange={(e) =>
                      handleInputChange("costRatio", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="fobInUSD"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    FOB In USD :
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.fobInUSD ? "is-valid" : ""
                    } ${validationErrors.fobInUSD ? "is-invalid" : ""}`}
                    id="fobInUSD"
                    placeholder="Enter FOB In USD"
                    value={formData.fobInUSD}
                    onChange={(e) =>
                      handleInputChange("fobInUSD", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="landedCost"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Landed Cost :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="landedCost"
                    placeholder="Enter Landed Cost"
                    value={formData.landedCost}
                    onChange={(e) =>
                      handleInputChange("landedCost", e.target.value)
                    }
                    readOnly
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="minNetSellingPrice"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Min Net Selling Price :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="minNetSellingPrice"
                    placeholder="Enter Min Net Selling Price"
                    value={formData.minNetSellingPrice}
                    onChange={(e) =>
                      handleInputChange("minNetSellingPrice", e.target.value)
                    }
                    readOnly
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="sellingPrice"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Selling Price :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sellingPrice"
                    placeholder="Enter Selling Price"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      handleInputChange("sellingPrice", e.target.value)
                    }
                    readOnly
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="mrp"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    MRP :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="mrp"
                    placeholder="Enter MRP"
                    value={formData.mrp}
                    onChange={(e) => handleInputChange("mrp", e.target.value)}
                    readOnly
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="competitorPrice"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Competitor Price :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="competitorPrice"
                    placeholder="Enter Competitor Price"
                    value={formData.competitorPrice}
                    onChange={(e) =>
                      handleInputChange("competitorPrice", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="labelPrice"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Label Price :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="labelPrice"
                    placeholder="Enter Label Price"
                    value={formData.labelPrice}
                    onChange={(e) =>
                      handleInputChange("labelPrice", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="averageSellingPrice"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Average Selling Price :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="averageSellingPrice"
                    placeholder="Enter Average Selling Price"
                    value={formData.averageSellingPrice}
                    onChange={(e) =>
                      handleInputChange("averageSellingPrice", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="stockClearance"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Stock Clearance :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="stockClearance"
                    placeholder="Enter Stock Clearance Price"
                    value={formData.stockClearance}
                    onChange={(e) =>
                      handleInputChange("stockClearance", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3 mt-3 d-flex align-items-center">
                  <label
                    htmlFor="bulkPrice"
                    className="form-label me-2 mb-0"
                    style={{ minWidth: "200px" }}
                  >
                    Bulk Price :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bulkPrice"
                    placeholder="Enter Bulk Price"
                    value={formData.bulkPrice}
                    onChange={(e) =>
                      handleInputChange("bulkPrice", e.target.value)
                    }
                  />
                </div>
              </>
            )}
            {!isServiceItemType() && (
              <>
                <h4>Item Hierarchy</h4>
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

                {formData.itemHierarchy === "sub" &&
                  selectedParentItem === "" && (
                    <div className="mb-3 mt-4">
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
                            Please search for a parent item for this sub item
                            and add it
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
                      <p>
                        Category: {selectedParentItem.category.categoryName}
                      </p>
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

                <div className="mb-3 mt-5">
                  <label htmlFor="itemHierarchy" className="form-label">
                    Sub Items
                  </label>

                  <div className="mb-0">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a sub item..."
                        value={searchChildTerm}
                        onChange={(e) => setSearchChildTerm(e.target.value)}
                      />
                      {searchChildTerm && (
                        <span
                          className="input-group-text bg-transparent"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => setSearchChildTerm("")}
                        >
                          <i className="bi bi-x"></i>
                        </span>
                      )}
                    </div>

                    {searchChildTerm && (
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
                          {isChildItemsLoading ? (
                            <li className="dropdown-item">
                              <ButtonLoadingSpinner text="Searching..." />
                            </li>
                          ) : isChildItemsError ? (
                            <li className="dropdown-item">
                              Error: {childItemsError.message}
                            </li>
                          ) : availableChildItems === null ? (
                            <li className="dropdown-item">
                              <span className="me-3">
                                <i className="bi bi-emoji-frown"></i>
                              </span>
                              No items found
                            </li>
                          ) : (
                            availableChildItems
                              .filter(
                                (item) =>
                                  !selectedChildItems.some(
                                    (selectedItem) =>
                                      selectedItem.itemMasterId ===
                                      item.itemMasterId
                                  )
                              )
                              ?.map((item) => (
                                <li key={item.itemMasterId}>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => handleSelectSubItem(item)}
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
                        Please search for sub items for the selected item and
                        add it
                      </small>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedChildItems.length > 0 && (
              <div className="table-responsive mb-2">
                <table className="table mt-2">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Unit</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChildItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemName}</td>
                        <td>{item.unit.unitName}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control rounded-4"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChildItemQuantityChange(
                                item.itemMasterId,
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleRemoveChildItem(index)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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

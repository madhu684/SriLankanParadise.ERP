import React from "react";
import useItemMaster from "./useItemMaster";

const ItemMaster = () => {
  const {
    formData,
    validFields,
    validationErrors,
    categoryOptions,
    unitOptions,
    formatDateTime,
    handleInputChange,
    handleSubmit,
  } = useItemMaster();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <img
            src="path/to/your/logo.png"
            alt="Company Logo"
            className="img-fluid"
          />
          <p>Date and Time: {formatDateTime()}</p>
        </div>
        <h1 className="mt-2 text-center">Item Master</h1>
        <hr />
      </div>

      <form>
        {/* Item Master Information */}
        <div className="row g-3 mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>Item Information</h4>

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
                <option value="" disabled>
                  Select Unit
                </option>
                {unitOptions.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              {validationErrors.unitId && (
                <div className="invalid-feedback">
                  {validationErrors.unitId}
                </div>
              )}
            </div>

            <div className="mb-3">
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
                <option value="" disabled>
                  Select Category
                </option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {validationErrors.categoryId && (
                <div className="invalid-feedback">
                  {validationErrors.categoryId}
                </div>
              )}
            </div>

            <div className="mb-3">
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
          </div>

          <div className="col-md-5">
            <h4>Stock Information</h4>

            <div className="mb-3 mt-3">
              <label htmlFor="stockQuantity" className="form-label">
                Stock Quantity
              </label>
              <input
                type="number"
                className={`form-control ${
                  validFields.stockQuantity ? "is-valid" : ""
                } ${validationErrors.stockQuantity ? "is-invalid" : ""}`}
                id="stockQuantity"
                placeholder="Enter Stock Quantity"
                value={formData.stockQuantity}
                onChange={(e) =>
                  handleInputChange("stockQuantity", e.target.value)
                }
                required
              />
              {validationErrors.stockQuantity && (
                <div className="invalid-feedback">
                  {validationErrors.stockQuantity}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="sellingPrice" className="form-label">
                Selling Price
              </label>
              <input
                type="number"
                className={`form-control ${
                  validFields.sellingPrice ? "is-valid" : ""
                } ${validationErrors.sellingPrice ? "is-invalid" : ""}`}
                id="sellingPrice"
                placeholder="Enter Selling Price"
                value={formData.sellingPrice}
                onChange={(e) =>
                  handleInputChange("sellingPrice", e.target.value)
                }
                required
              />
              {validationErrors.sellingPrice && (
                <div className="invalid-feedback">
                  {validationErrors.sellingPrice}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="costPrice" className="form-label">
                Cost Price
              </label>
              <input
                type="number"
                className={`form-control ${
                  validFields.costPrice ? "is-valid" : ""
                } ${validationErrors.costPrice ? "is-invalid" : ""}`}
                id="costPrice"
                placeholder="Enter Cost Price"
                value={formData.costPrice}
                onChange={(e) => handleInputChange("costPrice", e.target.value)}
                required
              />
              {validationErrors.costPrice && (
                <div className="invalid-feedback">
                  {validationErrors.costPrice}
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
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button type="button" className="btn btn-danger">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemMaster;

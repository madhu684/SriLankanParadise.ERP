import { memo, useCallback } from "react";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useItemPriceList from "./useItemPriceList";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const ItemSearchDropdown = memo(
  ({
    searchTerm,
    isItemsLoading,
    isItemsError,
    itemsError,
    availableItems,
    handleSelectItem,
  }) => {
    if (!searchTerm) return null;

    return (
      <div className="dropdown w-50 position-relative">
        <ul
          className="dropdown-menu show w-100 shadow-lg border-0 position-absolute"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1050,
          }}
        >
          {isItemsLoading ? (
            <li className="dropdown-item text-center py-3">
              <ButtonLoadingSpinner text="Searching..." />
            </li>
          ) : isItemsError ? (
            <li className="dropdown-item text-center py-3 text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Error: {itemsError.message}
            </li>
          ) : availableItems.length === 0 ? (
            <li className="dropdown-item text-center py-3">
              <i className="bi bi-emoji-frown fs-3 text-muted d-block mb-2"></i>
              <span className="text-muted">No items found</span>
            </li>
          ) : (
            availableItems.map((item) => (
              <li key={item.itemMasterId}>
                <button
                  type="button"
                  className="dropdown-item py-2 d-flex align-items-center"
                  onClick={() => handleSelectItem(item)}
                >
                  <i className="bi bi-cart4 text-success me-3 fs-5"></i>
                  <div>
                    <div className="fw-semibold">{item.itemCode}</div>
                    <small className="text-muted">{item.itemName}</small>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
);

ItemSearchDropdown.displayName = "ItemSearchDropdown";

// Memoized item row component
const ItemRow = memo(
  ({ item, index, validFields, validationErrors, onItemChange, onRemove }) => {
    const handleCostPriceChange = useCallback(
      (e) => {
        onItemChange(index, "costPrice", e.target.value);
      },
      [index, onItemChange]
    );

    const handleVATAddedPriceChange = useCallback(
      (e) => {
        onItemChange(index, "vatAddedPrice", e.target.value);
      },
      [index, onItemChange]
    );

    const handleRemove = useCallback(() => {
      onRemove(index);
    }, [index, onRemove]);

    return (
      <tr>
        <td className="ps-4 fw-semibold">{item.name}</td>
        <td>
          <input
            type="number"
            className={`form-control form-control-sm ${
              validFields[`costPrice_${index}`] ? "is-valid" : ""
            } ${validationErrors[`costPrice_${index}`] ? "is-invalid" : ""}`}
            placeholder="Enter price"
            value={item.costPrice || ""}
            onChange={handleCostPriceChange}
            min="0"
            step="0.01"
          />
          {validationErrors[`costPrice_${index}`] && (
            <div className="invalid-feedback">
              {validationErrors[`costPrice_${index}`]}
            </div>
          )}
        </td>
        <td>
          <input
            type="number"
            className={`form-control form-control-sm ${
              validFields[`vatAddedPrice_${index}`] ? "is-valid" : ""
            } ${
              validationErrors[`vatAddedPrice_${index}`] ? "is-invalid" : ""
            }`}
            placeholder="Auto-calculated"
            value={item.vatAddedPrice || ""} // FIXED: Changed from item.costPrice to item.vatAddedPrice
            onChange={handleVATAddedPriceChange}
            min="0"
            step="0.01"
            readOnly // Optional: make it read-only since it's auto-calculated
          />
          {validationErrors[`vatAddedPrice_${index}`] && (
            <div className="invalid-feedback">
              {validationErrors[`vatAddedPrice_${index}`]}
            </div>
          )}
        </td>
        <td className="text-end pe-4">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger border-0"
            onClick={handleRemove}
            title="Delete item"
          >
            <i className="bi bi-trash3-fill"></i>
          </button>
        </td>
      </tr>
    );
  }
);

ItemRow.displayName = "ItemRow";

const ItemPriceList = ({ handleClose }) => {
  const {
    formData,
    statusOptions,
    availableItems,
    isItemsLoading,
    allItemsLoading,
    isItemsError,
    itemsError,
    searchTerm,
    isSubmitting,
    validFields,
    validationErrors,
    setSearchTerm,
    handleSelectItem,
    handleItemDetailsChange,
    handleInputChange,
    handleLoadAllItems,
    handleRemoveItem,
    handleSubmit,
  } = useItemPriceList(handleClose);

  // Memoize event handlers
  const handleListNameChange = useCallback(
    (e) => handleInputChange("listName", e.target.value),
    [handleInputChange]
  );

  const handleStatusChange = useCallback(
    (e) => handleInputChange("status", e.target.value),
    [handleInputChange]
  );

  const handleEffectiveDateChange = useCallback(
    (e) => handleInputChange("effectiveDate", e.target.value),
    [handleInputChange]
  );

  const handleRemarkChange = useCallback(
    (e) => handleInputChange("remark", e.target.value),
    [handleInputChange]
  );

  const handleSearchChange = useCallback(
    (e) => setSearchTerm(e.target.value),
    [setSearchTerm]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              onClick={handleClose}
              className="btn btn-dark d-flex align-items-center gap-2 px-3"
              type="button"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="text-muted small">
              <i className="bi bi-clock me-2"></i>
              <CurrentDateTime />
            </div>
          </div>
          <div className="text-center">
            <h1 className="h2 fw-bold text-dark mb-1">Item Price List</h1>
          </div>
        </div>

        <form>
          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="card shadow-sm mb-3 flex-fill h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-file-text me-2"></i> Basic Information
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-building-check me-2"></i>
                          List Name
                        </label>
                        <input
                          id="listName"
                          className={`form-control ${
                            validFields.listName ? "is-valid" : ""
                          } ${validationErrors.listName ? "is-invalid" : ""}`}
                          type="text"
                          placeholder="Enter name"
                          value={formData.listName}
                          onChange={handleListNameChange}
                        />
                        {validationErrors.listName && (
                          <div className="invalid-feedback">
                            {validationErrors.listName}
                          </div>
                        )}
                      </div>
                      {/* <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-distribute-vertical me-2"></i>
                          Status
                        </label>
                        <select
                          id="status"
                          className={`form-control ${
                            validFields.status ? "is-valid" : ""
                          } ${validationErrors.status ? "is-invalid" : ""}`}
                          value={formData.status}
                          onChange={handleStatusChange}
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {validationErrors.status && (
                          <div className="invalid-feedback">
                            {validationErrors.status}
                          </div>
                        )}
                      </div> */}
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-file-earmark me-2"></i>
                          Remarks
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter remarks (Min 150 words)"
                          maxLength={150}
                          value={formData.remark}
                          onChange={handleRemarkChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-calendar2-check me-2"></i>
                          Effective Date
                        </label>
                        <input
                          id="effectiveDate"
                          className={`form-control ${
                            validFields.effectiveDate ? "is-valid" : ""
                          } ${
                            validationErrors.effectiveDate ? "is-invalid" : ""
                          }`}
                          type="date"
                          value={formData.effectiveDate}
                          onChange={handleEffectiveDateChange}
                        />
                        {validationErrors.effectiveDate && (
                          <div className="invalid-feedback">
                            {validationErrors.effectiveDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Item Details */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-box-seam me-2"></i>Item Details
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="row g-3 align-items-end">
                  {/* Search Input */}
                  <div className="col-lg-8 col-xl-9">
                    <label
                      htmlFor="itemSearch"
                      className="form-label fw-semibold"
                    >
                      <i className="bi bi-search me-2"></i>Search Items
                    </label>
                    <div className="input-group w-50">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        id="itemSearch"
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search for an item..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-start-0"
                          onClick={handleClearSearch}
                          aria-label="Clear search"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>

                    <ItemSearchDropdown
                      searchTerm={searchTerm}
                      isItemsLoading={isItemsLoading}
                      isItemsError={isItemsError}
                      itemsError={itemsError}
                      availableItems={availableItems}
                      handleSelectItem={handleSelectItem}
                    />
                  </div>

                  {/* Load All Items Button - Aligned to bottom */}
                  <div className="col-lg-4 col-xl-3">
                    <button
                      type="button"
                      className="btn btn-primary w-75 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      onClick={handleLoadAllItems}
                      disabled={allItemsLoading}
                      style={{ height: "40px" }}
                    >
                      {allItemsLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-down-circle"></i>
                          <span>Load All Items</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              {formData.itemDetails.length > 0 && (
                <div className="table-responsive rounded border">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-4">
                          Item Name
                        </th>
                        <th
                          scope="col"
                          className="text-center"
                          style={{ width: "200px" }}
                        >
                          Cost Price
                        </th>
                        <th
                          scope="col"
                          className="text-center"
                          style={{ width: "200px" }}
                        >
                          VAT Added Price
                        </th>
                        <th
                          scope="col"
                          className="text-end pe-4"
                          style={{ width: "120px" }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.itemDetails.map((item, index) => (
                        <ItemRow
                          key={`${item.itemMasterId}-${index}`}
                          item={item}
                          index={index}
                          validFields={validFields}
                          validationErrors={validationErrors}
                          onItemChange={handleItemDetailsChange}
                          onRemove={handleRemoveItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {formData.itemDetails.length === 0 && !allItemsLoading && (
                <div className="alert alert-info text-center" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  No items added yet. Search and select items to add to the
                  Price List.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ButtonLoadingSpinner text="Submitting..." />
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Submit List
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(ItemPriceList);

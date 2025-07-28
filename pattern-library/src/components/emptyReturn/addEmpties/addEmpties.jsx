import React, { useState, useEffect } from "react";
import { AddEmptiesManagement } from "./addEmpties";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const AddEmpties = ({ show, handleClose }) => {
  const {
    formData,
    warehouses,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    searchItem,
    validFields,
    validationErrors,
    alertRef,
    loading,
    submissionStatus,
    setSubmissionStatus,
    handleCancel,
    setFormData,
    setSearchItem,
    handleSelectItem,
    handleItemDetailsChange,
    handleRemoveItem,
    handleSubmit,
    handleWarehouseLocationChange,

    errors,
  } = AddEmptiesManagement(handleClose);
  console.log("Fetched warehouses dinusha:", warehouses);
  console.log("Fetched items:", availableItems);

  useEffect(() => {
    if (submissionStatus !== null) {
      const timer = setTimeout(() => {
        setSubmissionStatus(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show d-block" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Add Empties</h5>
              <button className="btn-close" onClick={handleCancel} />
            </div>
            <div className="modal-body">
              <h5>Warehouses</h5>
              <div className="mb-3">
                {/* <label>Warehouse</label> */}
                <select
                  className="form-select"
                  value={formData.warehouseLocation}
                  onChange={(e) =>
                    handleWarehouseLocationChange(parseInt(e.target.value))
                  }
                >
                  <option value="">Select Warehouse</option>
                  {/* {warehouses
                    .filter((w) => w.locationType?.name === "Warehouse") // ✅ filter here
                    .map((w) => (
                      <option key={w.locationId} value={w.locationId}>
                        {w.locationName}
                      </option>
                    ))} */}

                  {warehouses
                    .filter(
                      (w) => w.location.locationType?.name === "Warehouse"
                    )
                    .map((w) => (
                      <option
                        key={w.location.locationId}
                        value={w.location.locationId}
                      >
                        {w.location.locationName}
                      </option>
                    ))}
                </select>
                {errors.warehouseLocation && (
                  <div className="text-danger mb-2">
                    {errors.warehouseLocation}
                  </div>
                )}
              </div>

              {/* Search for items */}
              <h5>Item Details</h5>
              <div className="mb-3 mt-3">
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for an item..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                  />
                  {searchItem && (
                    <span
                      className="input-group-text bg-transparent"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => setSearchItem("")}
                    >
                      <i className="bi bi-x"></i>
                    </span>
                  )}
                </div>
                {/* Dropdown for filtered items */}
                {searchItem && (
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
                      ) : availableItems === null ||
                        availableItems?.filter(
                          (item) =>
                            !formData.itemDetails?.some(
                              (detail) => detail.id === item.itemMasterId
                            )
                        ).length === 0 ? (
                        <li className="dropdown-item">
                          <span className="me-3">
                            <i className="bi bi-emoji-frown"></i>
                          </span>
                          No items found
                        </li>
                      ) : (
                        availableItems
                          ?.filter(
                            (item) =>
                              !formData.itemDetails?.some(
                                (detail) => detail.id === item.itemMasterId
                              )
                          )
                          .map((item) => (
                            <li key={item.itemMasterId}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleSelectItem(item)}
                              >
                                <span className="me-3">
                                  <i className="bi bi-cart4"></i>
                                </span>
                                {item.itemName}
                              </button>
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                )}

                {!formData.itemDetails?.length > 0 && (
                  <div className="mb-3">
                    <small className="form-text text-muted">
                      Please search for an item and add it
                    </small>
                  </div>
                )}
              </div>

              {/* Item details table */}
              {formData.itemDetails?.length > 0 && (
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
                      {formData.itemDetails.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.unit}</td>
                          <td>
                            <input
                              type="number"
                              className={`form-control ${
                                validFields[`quantity_${index}`]
                                  ? "is-valid"
                                  : ""
                              } ${
                                validationErrors[`quantity_${index}`]
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemDetailsChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            />
                            {validationErrors[`quantity_${index}`] && (
                              <div className="invalid-feedback">
                                {validationErrors[`quantity_${index}`]}
                              </div>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => handleRemoveItem(index)}
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

              {submissionStatus === "success" && (
                <div
                  className="alert alert-success d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Items successfully submitted!
                </div>
              )}

              {submissionStatus === "error" && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Error submitting items. Please try again.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={() => handleSubmit(false)}
                disabled={
                  !formData.itemDetails?.length > 0 ||
                  loading ||
                  submissionStatus !== null
                }
              >
                {loading && submissionStatus === null ? (
                  <ButtonLoadingSpinner text="Submitting..." />
                ) : (
                  "Submit"
                )}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={loading || submissionStatus !== null}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmpties;

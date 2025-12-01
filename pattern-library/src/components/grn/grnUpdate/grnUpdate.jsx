import React from "react";
import useGrnUpdate from "./useGrnUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const GrnUpdate = ({ handleClose, grn, handleUpdated }) => {
  const {
    formData,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    selectedPurchaseRequisition,
    selectedSupplyReturn,
    selectedSupplier,
    purchaseOrders,
    purchaseRequisitions,
    statusOptions,
    submissionStatus,
    alertRef,
    isLoading,
    isError,
    suppliers,
    supplyReturns,
    loading,
    loadingDraft,
    grnTypeOptions,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    locations,
    isLocationsLoading,
    isLocationsError,
    locationsError,
    searchByPO,
    searchByPR,
    setSearchByPO,
    setSearchByPR,
    handleInputChange,
    handlePurchaseRequisitionChange,
    handleItemDetailsChange,
    handlePrint,
    handleSubmit,
    handleStatusChange,
    setSelectedPurchaseOrder,
    setSelectedPurchaseRequisition,
    setSearchTerm,
    handleSelectItem,
    handleRemoveItem,
  } = useGrnUpdate({
    grn,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container mt-4 pb-5">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handleClose}
            className="btn btn-dark d-flex align-items-center gap-2"
            type="button"
          >
            <i className="bi bi-arrow-left"></i>
            {/* <span className="d-none d-sm-inline">Back</span> */}
          </button>

          <div className="text-muted small">
            <CurrentDateTime />
          </div>
        </div>
        <h1 className="text-center fw-bold mb-2">Update Goods Received Note</h1>
        {/* <p className="text-center text-muted mb-3">
          <i className="bi bi-pencil-square me-2"></i>
          Edit and update existing GRN details
        </p> */}
        <hr className="border-2 opacity-50" />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div
          className="alert alert-success alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          GRN updated successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div
          className="alert alert-info alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          GRN updated and saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error updating GRN. Please try again.
        </div>
      )}

      {/* GRN Information & Purchase Details */}
      <div className="row g-4 mb-4">
        {/* GRN Information */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-file-text me-2"></i>1. GRN Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6 mb-3">
                  <label htmlFor="grnDate" className="form-label fw-semibold">
                    GRN Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      validFields.grnDate ? "is-valid" : ""
                    } ${validationErrors.grnDate ? "is-invalid" : ""}`}
                    id="grnDate"
                    value={formData.grnDate}
                    onChange={(e) =>
                      handleInputChange("grnDate", e.target.value)
                    }
                    required
                  />
                  {validationErrors.grnDate && (
                    <div className="invalid-feedback">
                      {validationErrors.grnDate}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label
                    htmlFor="receivedDate"
                    className="form-label fw-semibold"
                  >
                    Received Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      validFields.receivedDate ? "is-valid" : ""
                    } ${validationErrors.receivedDate ? "is-invalid" : ""}`}
                    id="receivedDate"
                    value={formData.receivedDate}
                    onChange={(e) =>
                      handleInputChange("receivedDate", e.target.value)
                    }
                    required
                  />
                  {validationErrors.receivedDate && (
                    <div className="invalid-feedback">
                      {validationErrors.receivedDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6 mb-3">
                  <label
                    htmlFor="custdeckNo"
                    className="form-label fw-semibold"
                  >
                    Cust Deck No <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.custdeckNo ? "is-valid" : ""
                    } ${validationErrors.custdeckNo ? "is-invalid" : ""}`}
                    id="custdeckNo"
                    placeholder="Eg:- S-00009"
                    value={formData.custdeckNo}
                    onChange={(e) =>
                      handleInputChange("custdeckNo", e.target.value)
                    }
                    required
                  />
                  {validationErrors.custdeckNo && (
                    <div className="invalid-feedback">
                      {validationErrors.custdeckNo}
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label
                    htmlFor="receivedBy"
                    className="form-label fw-semibold"
                  >
                    Received By <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.receivedBy ? "is-valid" : ""
                    } ${validationErrors.receivedBy ? "is-invalid" : ""}`}
                    id="receivedBy"
                    placeholder="Enter name"
                    value={formData.receivedBy}
                    onChange={(e) =>
                      handleInputChange("receivedBy", e.target.value)
                    }
                    required
                  />
                  {validationErrors.receivedBy && (
                    <div className="invalid-feedback">
                      {validationErrors.receivedBy}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="grnType" className="form-label fw-semibold">
                  GRN Type <span className="text-danger">*</span>
                </label>
                <select
                  id="grnType"
                  className={`form-select ${
                    validFields.grnType ? "is-valid" : ""
                  } ${validationErrors.grnType ? "is-invalid" : ""}`}
                  value={formData.grnType}
                  onChange={(e) => handleInputChange("grnType", e.target.value)}
                  required
                  disabled
                >
                  <option value="">Select GRN Type</option>
                  {grnTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.grnType && (
                  <div className="invalid-feedback">
                    {validationErrors.grnType}
                  </div>
                )}
                <small className="form-text text-muted d-block mt-1">
                  <i className="bi bi-lock me-1"></i>
                  GRN Type cannot be changed after creation
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label fw-semibold">
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  id="status"
                  className={`form-select ${
                    validFields.status ? "is-valid" : ""
                  } ${validationErrors.status ? "is-invalid" : ""}`}
                  value={formData.status}
                  onChange={(e) =>
                    handleStatusChange(
                      statusOptions.find(
                        (option) => option.id === e.target.value
                      )
                    )
                  }
                  required
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
              </div>

              <div className="mb-0">
                <label
                  htmlFor="warehouseLocation"
                  className="form-label fw-semibold"
                >
                  Warehouse Location <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    validFields.warehouseLocation ? "is-valid" : ""
                  } ${validationErrors.warehouseLocation ? "is-invalid" : ""}`}
                  id="warehouseLocation"
                  value={formData?.warehouseLocation ?? ""}
                  onChange={(e) =>
                    handleInputChange("warehouseLocation", e.target.value)
                  }
                >
                  <option value="">Select Warehouse</option>
                  {locations
                    ?.filter(
                      (location) =>
                        location.locationType.name === "Warehouse" &&
                        location.alias !== "DMG"
                    )
                    ?.map((location) => (
                      <option
                        key={location.locationId}
                        value={location.locationId}
                      >
                        {location.locationName}
                      </option>
                    ))}
                </select>
                {validationErrors.warehouseLocation && (
                  <div className="invalid-feedback">
                    {validationErrors.warehouseLocation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Details */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart-check me-2"></i>2. Purchase Details
              </h5>
            </div>
            <div className="card-body">
              {/* Purchase Order Display */}
              {!["finishedGoodsIn", "directPurchase"].includes(
                formData?.grnType
              ) &&
                selectedPurchaseOrder && (
                  <div className="mb-3">
                    <div className="card border-primary">
                      <div className="card-header bg-primary text-white">
                        <i className="bi bi-check-circle me-2"></i>Purchase
                        Order
                      </div>
                      <div className="card-body">
                        <div className="mb-2">
                          <strong>Reference No:</strong>{" "}
                          <span className="text-primary">
                            {selectedPurchaseOrder?.referenceNo}
                          </span>
                        </div>
                        <div className="mb-2">
                          <strong>Supplier:</strong>{" "}
                          {selectedPurchaseOrder?.supplier?.supplierName}
                        </div>
                        <div className="mb-0">
                          <strong>Order Date:</strong>{" "}
                          {selectedPurchaseOrder?.orderDate?.split("T")[0] ??
                            ""}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Finished Goods In Alert */}
              {formData.grnType === "finishedGoodsIn" && (
                <div
                  className="alert alert-warning d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <div>
                    This is a "Finished Goods In", no purchase order required.
                  </div>
                </div>
              )}

              {/* Direct Purchase Alert */}
              {formData.grnType === "directPurchase" && (
                <div
                  className="alert alert-warning d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <div>
                    This is a "Direct Purchase", no purchase order required.
                  </div>
                </div>
              )}

              {/* Purchase Requisition Display */}
              {selectedPurchaseRequisition && selectedSupplier && (
                <>
                  <div className="mb-3">
                    <div className="card border-success">
                      <div className="card-header bg-success text-white">
                        <i className="bi bi-check-circle me-2"></i>Purchase
                        Requisition
                      </div>
                      <div className="card-body">
                        <div className="mb-2">
                          <strong>Reference No:</strong>{" "}
                          <span className="text-success">
                            {selectedPurchaseRequisition?.referenceNo}
                          </span>
                        </div>
                        <div className="mb-2">
                          <strong>Requested By:</strong>{" "}
                          {selectedPurchaseRequisition?.requestedBy}
                        </div>
                        <div className="mb-0">
                          <strong>Requisition Date:</strong>{" "}
                          {selectedPurchaseRequisition?.requisitionDate?.split(
                            "T"
                          )[0] ?? ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="card border-info">
                      <div className="card-header bg-info text-white">
                        <i className="bi bi-check-circle me-2"></i>Supplier
                      </div>
                      <div className="card-body">
                        <div className="mb-2">
                          <strong>Supplier Name:</strong>{" "}
                          {selectedSupplier?.supplierName}
                        </div>
                        <div className="mb-2">
                          <strong>Email:</strong> {selectedSupplier?.email}
                        </div>
                        <div className="mb-0">
                          <strong>Contact No:</strong> {selectedSupplier?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Supply Return Display */}
              {selectedSupplyReturn && (
                <div className="mb-3">
                  <div className="card border-warning">
                    <div className="card-header bg-warning text-dark">
                      <i className="bi bi-check-circle me-2"></i>Supply Return
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Reference No:</strong>{" "}
                        <span className="text-warning">
                          {selectedSupplyReturn?.referenceNo}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Returned By:</strong>{" "}
                        {selectedSupplyReturn?.returnedBy}
                      </div>
                      <div className="mb-0">
                        <strong>Return Date:</strong>{" "}
                        {selectedSupplyReturn?.returnDate?.split("T")[0] ?? ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!selectedPurchaseOrder &&
                !selectedPurchaseRequisition &&
                !selectedSupplyReturn &&
                !["finishedGoodsIn", "directPurchase"].includes(
                  formData?.grnType
                ) && (
                  <div
                    className="alert alert-light border d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi bi-inbox me-2 text-muted"></i>
                    <div className="text-muted">
                      No purchase details associated with this GRN
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">
            <i className="bi bi-box-seam me-2"></i>3. Item Details
          </h5>
        </div>
        <div className="card-body">
          {formData.itemDetails.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-semibold">Item Name</th>
                    <th className="fw-semibold">Unit</th>
                    {!["finishedGoodsIn", "directPurchase"].includes(
                      formData?.grnType
                    ) && <th className="fw-semibold">Ordered Qty</th>}
                    <th className="fw-semibold">Received Qty</th>
                    <th className="fw-semibold">Rejected Qty</th>
                    <th className="fw-semibold">Free Qty</th>
                    <th className="fw-semibold">Expiry Date</th>
                    <th className="fw-semibold">Unit Cost Price</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.itemDetails.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="fw-medium">{item.name}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {item.unit}
                          </span>
                        </td>
                        {!["finishedGoodsIn", "directPurchase"].includes(
                          formData?.grnType
                        ) && (
                          <td>
                            <span className="badge bg-info">
                              {item.quantity}
                            </span>
                          </td>
                        )}
                        <td>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validFields[`receivedQuantity_${index}`]
                                ? "is-valid"
                                : ""
                            } ${
                              validationErrors[`receivedQuantity_${index}`]
                                ? "is-invalid"
                                : ""
                            }`}
                            value={item.receivedQuantity}
                            onChange={(e) =>
                              handleItemDetailsChange(
                                index,
                                "receivedQuantity",
                                e.target.value
                              )
                            }
                          />
                          {validationErrors[`receivedQuantity_${index}`] && (
                            <div className="invalid-feedback">
                              {validationErrors[`receivedQuantity_${index}`]}
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validFields[`rejectedQuantity_${index}`]
                                ? "is-valid"
                                : ""
                            } ${
                              validationErrors[`rejectedQuantity_${index}`]
                                ? "is-invalid"
                                : ""
                            }`}
                            value={item.rejectedQuantity}
                            onChange={(e) =>
                              handleItemDetailsChange(
                                index,
                                "rejectedQuantity",
                                e.target.value
                              )
                            }
                          />
                          {validationErrors[`rejectedQuantity_${index}`] && (
                            <div className="invalid-feedback">
                              {validationErrors[`rejectedQuantity_${index}`]}
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.freeQuantity}
                            onChange={(e) =>
                              handleItemDetailsChange(
                                index,
                                "freeQuantity",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={item.expiryDate || ""}
                            onChange={(e) =>
                              handleItemDetailsChange(
                                index,
                                "expiryDate",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validFields[`unitPrice_${index}`]
                                ? "is-valid"
                                : ""
                            } ${
                              validationErrors[`unitPrice_${index}`]
                                ? "is-invalid"
                                : ""
                            }`}
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemDetailsChange(
                                index,
                                "unitPrice",
                                e.target.value
                              )
                            }
                          />
                          {validationErrors[`unitPrice_${index}`] && (
                            <div className="invalid-feedback">
                              {validationErrors[`unitPrice_${index}`]}
                            </div>
                          )}
                        </td>
                      </tr>
                      {parseFloat(item.rejectedQuantity) > 0 && (
                        <tr>
                          <td
                            colSpan={
                              !["finishedGoodsIn", "directPurchase"].includes(
                                formData?.grnType
                              )
                                ? "9"
                                : "8"
                            }
                            className="bg-light"
                          >
                            <div className="px-2 py-2">
                              <label className="form-label fw-semibold mb-1 small">
                                <i className="bi bi-chat-left-text me-1"></i>
                                Rejection Reason
                              </label>
                              <input
                                type="text"
                                className={`form-control form-control-sm ${
                                  validFields[`rejectionReason_${index}`]
                                    ? "is-valid"
                                    : ""
                                } ${
                                  validationErrors[`rejectionReason_${index}`]
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="Enter reason for rejection..."
                                value={item.rejectionReason || ""}
                                onChange={(e) =>
                                  handleItemDetailsChange(
                                    index,
                                    "rejectionReason",
                                    e.target.value
                                  )
                                }
                              />
                              {validationErrors[`rejectionReason_${index}`] && (
                                <div className="invalid-feedback">
                                  {validationErrors[`rejectionReason_${index}`]}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="alert alert-light border d-flex align-items-center"
              role="alert"
            >
              <i className="bi bi-inbox me-2 text-muted"></i>
              <div className="text-muted">No items added to this GRN</div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-wrap gap-2 pb-4">
        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={() => handleSubmit(false)}
          disabled={
            !formData.itemDetails.length > 0 ||
            loading ||
            loadingDraft ||
            submissionStatus !== null
          }
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Updating..." />
          ) : (
            <>
              <i className="bi bi-arrow-up-circle me-2"></i>Update and Submit
            </>
          )}
        </button>
        {/* <button
          type="button"
          className="btn btn-secondary px-4"
          onClick={() => handleSubmit(true)}
          disabled={
            !formData.itemDetails.length > 0 ||
            loading ||
            loadingDraft ||
            submissionStatus !== null
          }
        >
          {loadingDraft && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Saving as Draft..." />
          ) : (
            <>
              <i className="bi bi-save me-2"></i>Save as Draft
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-success px-4"
          onClick={handlePrint}
          disabled={loading || loadingDraft || submissionStatus !== null}
        >
          <i className="bi bi-printer me-2"></i>Print
        </button> */}
        <button
          type="button"
          className="btn btn-danger px-4"
          onClick={handleClose}
          disabled={loading || loadingDraft || submissionStatus !== null}
        >
          <i className="bi bi-x-circle me-2"></i>Cancel
        </button>
      </div>
    </div>
  );
};

export default GrnUpdate;

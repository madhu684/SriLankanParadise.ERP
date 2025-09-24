import React from "react";
import useGrnUpdate from "./useGrnUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";
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
  } = useGrnUpdate({
    grn,
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
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div ref={alertRef}></div>
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <img src={companyLogoUrl} alt="Company Logo" height={30} />
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Goods Received Note</h1>
        <hr />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          GRN submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          GRN updated and saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting GRN. Please try again.
        </div>
      )}

      <form>
        {/* GRN Information */}
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. GRN Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                GRN Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.grnDate ? "is-valid" : ""
                } ${validationErrors.grnDate ? "is-invalid" : ""}`}
                id="grnDate"
                placeholder="Enter GRN date"
                value={formData.grnDate}
                onChange={(e) => handleInputChange("grnDate", e.target.value)}
                required
              />
              {validationErrors.grnDate && (
                <div className="invalid-feedback">
                  {validationErrors.grnDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="receivedBy" className="form-label">
                Received By
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
            <div className="mb-3">
              <label htmlFor="receivedDate" className="form-label">
                Received Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.receivedDate ? "is-valid" : ""
                } ${validationErrors.receivedDate ? "is-invalid" : ""}`}
                id="receivedDate"
                placeholder="Enter received date"
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
            {/* GRN Type Dropdown */}
            <div className="mb-3">
              <label htmlFor="grnType" className="form-label">
                GRN Type
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
            </div>

            {/* Status Dropdown */}
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`form-select ${
                  validFields.status ? "is-valid" : ""
                } ${validationErrors.status ? "is-invalid" : ""}`}
                value={formData.status}
                onChange={(e) =>
                  handleStatusChange(
                    statusOptions.find((option) => option.id === e.target.value)
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

            <div className="mb-3 mt-3">
              <label htmlFor="warehouseLocation" className="form-label">
                Warehouse Location
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
                {/* Filter out warehouse locations based on the locationType being "Warehouse" */}
                {locations
                  ?.filter(
                    (location) => location.locationType.name === "Warehouse"
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

          {/* Purchase Order ID Selection */}
          <div className="col-md-5">
            <h4>2. Purchase Details</h4>

            {selectedPurchaseOrder && (
              <div className="mt-3">
                <label htmlFor="purchaseOrder" className="form-label">
                  Purchase Order
                </label>
              </div>
            )}

            {/* Additional Purchase Order Information */}
            {!["finishedGoodsIn", "directPurchase"].includes(
              formData?.grnType
            ) &&
              selectedPurchaseOrder && (
                <div className="card mb-3">
                  <div className="card-header">Selected Purchase Order</div>
                  <div className="card-body">
                    <p>
                      Purchase Order Reference No:{" "}
                      {selectedPurchaseOrder?.referenceNo}
                    </p>
                    <p>
                      Supplier: {selectedPurchaseOrder?.supplier?.supplierName}
                    </p>
                    <p>
                      Order Date:{" "}
                      {selectedPurchaseOrder?.orderDate?.split("T")[0] ?? ""}
                    </p>
                  </div>
                </div>
              )}
            {formData.grnType === "finishedGoodsIn" && (
              <div className="alert alert-warning" role="alert">
                This is a "Finished Goods In", no need a purchase order.
              </div>
            )}
            {formData.grnType === "directPurchase" && (
              <div className="alert alert-warning" role="alert">
                This is a "Direct Purchase", no need a purchase order.
              </div>
            )}

            {selectedPurchaseRequisition && selectedSupplier && (
              <div className="mt-3">
                <label htmlFor="purchaseRequisition" className="form-label">
                  Purchase Requisition
                </label>
              </div>
            )}

            {selectedPurchaseRequisition && selectedSupplier && (
              <div className="mt-3">
                <label htmlFor="supplier" className="form-label">
                  Supplier
                </label>
              </div>
            )}

            {selectedPurchaseRequisition && selectedSupplier && (
              <div className="card mb-3">
                <div className="card-header">Selected Purchase Requisition</div>
                <div className="card-body">
                  <p>
                    Purchase Requisition Reference No:{" "}
                    {selectedPurchaseRequisition?.referenceNo}
                  </p>
                  <p>
                    Requested By: {selectedPurchaseRequisition?.requestedBy}
                  </p>
                  <p>
                    Requisition Date:{" "}
                    {selectedPurchaseRequisition?.requisitionDate?.split(
                      "T"
                    )[0] ?? ""}
                  </p>
                </div>
              </div>
            )}

            {selectedPurchaseRequisition && selectedSupplier && (
              <div className="card mb-3">
                <div className="card-header">Selected Supplier</div>
                <div className="card-body">
                  <p>Supplier Name : {selectedSupplier?.supplierName}</p>
                  <p>Supplier Email : {selectedSupplier?.email}</p>
                  <p>Contact No : {selectedSupplier?.phone}</p>
                </div>
              </div>
            )}

            {selectedSupplyReturn && (
              <div className="mt-3">
                <label htmlFor="supplyReturn" className="form-label">
                  Supply Return
                </label>
              </div>
            )}

            {selectedSupplyReturn && (
              <div className="card mb-3 mt-3">
                <div className="card-header">Selected Supply Return</div>
                <div className="card-body">
                  <p>
                    Supply Retrurn Reference No:{" "}
                    {selectedSupplyReturn?.referenceNo}
                  </p>
                  <p>Returned By: {selectedSupplyReturn?.returnedBy}</p>
                  <p>
                    Return Date:{" "}
                    {selectedSupplyReturn?.returnDate?.split("T")[0] ?? ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Item Details */}
            <h4>3. Item Details</h4>
            {/* Item Search */}
            {false && (
              <div className="mb-0 mt-3">
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for an item..."
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
                      ) : availableItems === null ||
                        availableItems?.filter(
                          (item) =>
                            !formData.itemDetails.some(
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
                              !formData.itemDetails.some(
                                (detail) => detail.id === item.itemMasterId
                              )
                          ) // Filter out items that are already in itemDetails
                          .map((item) => (
                            <li key={item.itemMasterId}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleSelectItem(item)}
                              >
                                <span className="me-3">
                                  <i className="bi bi-cart4"></i>
                                </span>{" "}
                                {item.itemCode} - {item.itemName}
                              </button>
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                )}

                {!formData.itemDetails.length > 0 && (
                  <div className="mb-3">
                    <small className="form-text text-muted">
                      Please search for an item and add it
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {formData.itemDetails.length > 0 && formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  {!["finishedGoodsIn", "directPurchase"].includes(
                    formData?.grnType
                  ) && (
                    <>
                      <th>Ordered Quantity</th>
                      {/* <th>Remaining Quantity</th> */}
                    </>
                  )}
                  <th>Received Quantity</th>
                  <th>Rejected Quantity</th>
                  <th>Free Quantity</th>
                  {/* <th>Expiry Date</th> */}
                  <th>Item Barcode</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    {!["finishedGoodsIn", "directPurchase"].includes(
                      formData?.grnType
                    ) && (
                      <>
                        <td>{item.quantity}</td>
                        {/* <td>{item.remainingQuantity}</td> */}
                      </>
                    )}
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
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
                        className={`form-control ${
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
                        className="form-control"
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
                    {/* <td>
                      <input
                        type="date"
                        className={`form-control ${
                          validFields[`expiryDate_${index}`] ? 'is-valid' : ''
                        } ${
                          validationErrors[`expiryDate_${index}`]
                            ? 'is-invalid'
                            : ''
                        }`}
                        value={item.expiryDate}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            'expiryDate',
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`expiryDate_${index}`] && (
                        <div className="invalid-feedback">
                          {validationErrors[`expiryDate_${index}`]}
                        </div>
                      )}
                    </td> */}
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        id="itemBarcode"
                        placeholder="Enter Item Barcode"
                        value={item.itemBarcode || ""}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "itemBarcode",
                            e.target.value
                          )
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
                          validFields[`unitPrice_${index}`] ? "is-valid" : ""
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-2"
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
              "Update and Submit"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary me-2"
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
              "Save as Draft"
            )}
          </button>
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handlePrint}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            Print
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

export default GrnUpdate;

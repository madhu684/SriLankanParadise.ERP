import React from "react";
import useGrn from "./useGrn";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const Grn = ({ handleClose, handleUpdated, setShowCreateGrnForm }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    selectedPurchaseRequisition,
    selectedSupplyReturn,
    purchaseOrders,
    purchaseRequisitions,
    approvedSupplyReturnMasters,
    statusOptions,
    alertRef,
    isLoading,
    isError,
    purchaseOrderSearchTerm,
    purchaseRequisitionSearchTerm,
    supplyReturnSearchTerm,
    supplierSearchTerm,
    loading,
    loadingDraft,
    grnTypeOptions,
    suppliers,
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
    searchBySR,
    setSearchByPO,
    setSearchByPR,
    setSearchBySR,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handleSubmit,
    handlePrint,
    handlePurchaseOrderChange,
    handlePurchaseRequisitionChange,
    handleSupplyReturnChange,
    handleStatusChange,
    setPurchaseOrderSearchTerm,
    setPurchaseRequisitionSearchTerm,
    setSupplyReturnSearchTerm,
    setSupplierSearchTerm,
    handleResetPurchaseOrder,
    handleResetSupplyReturn,
    handleResetSupplier,
    handleResetPurchaseRequisition,
    handleSelectSupplier,
    setSearchTerm,
    handleSelectItem,
  } = useGrn({
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

  const handleBack = () => {
    setShowCreateGrnForm(false);
  };

  return (
    <div className="container mt-4 pb-5">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handleBack}
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
        <h1 className="text-center fw-bold mb-3">Goods Received Note</h1>
        <hr className="border-2 opacity-50" />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div
          className="alert alert-success alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          GRN submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div
          className="alert alert-info alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          GRN saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error submitting GRN. Please try again.
        </div>
      )}

      <form>
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
                    onChange={(e) =>
                      handleInputChange("grnType", e.target.value)
                    }
                    disabled
                    required
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
                    } ${
                      validationErrors.warehouseLocation ? "is-invalid" : ""
                    }`}
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
                {/* Search Options */}
                <div className="mb-3">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="searchByPOCheckbox"
                      checked={searchByPO}
                      onChange={() => {
                        setSearchByPO(true);
                        setSearchByPR(false);
                        setSearchBySR(false);
                      }}
                      disabled={formData.grnType === "directPurchase"}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="searchByPOCheckbox"
                    >
                      <i className="bi bi-file-earmark-text me-1"></i>
                      Search By Purchase Order
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="searchByPRCheckbox"
                      checked={searchByPR}
                      onChange={() => {
                        setSearchByPO(false);
                        setSearchByPR(true);
                        setSearchBySR(false);
                      }}
                      disabled={formData.grnType === "directPurchase"}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="searchByPRCheckbox"
                    >
                      <i className="bi bi-clipboard-check me-1"></i>
                      Search By Purchase Requisition
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="searchBySRCheckbox"
                      checked={searchBySR}
                      onChange={() => {
                        setSearchByPO(false);
                        setSearchByPR(false);
                        setSearchBySR(true);
                      }}
                      disabled={formData.grnType === "directPurchase"}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="searchBySRCheckbox"
                    >
                      <i className="bi bi-arrow-return-left me-1"></i>
                      Search By Supply Return
                    </label>
                  </div>
                </div>

                {/* Purchase Order Search */}
                {searchByPO && (
                  <div className="mt-3">
                    {!["finishedGoodsIn", "directPurchase"].includes(
                      formData?.grnType
                    ) &&
                      selectedPurchaseOrder === null && (
                        <div className="mb-3">
                          <label
                            htmlFor="purchaseOrder"
                            className="form-label fw-semibold"
                          >
                            Purchase Order
                          </label>
                          <div className="position-relative">
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-search text-muted"></i>
                              </span>
                              <input
                                type="text"
                                className={`form-control border-start-0 ${
                                  validFields.purchaseOrderId ? "is-valid" : ""
                                } ${
                                  validationErrors.purchaseOrderId
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="Search for a purchase order..."
                                value={purchaseOrderSearchTerm}
                                onChange={(e) =>
                                  setPurchaseOrderSearchTerm(e.target.value)
                                }
                              />
                              {purchaseOrderSearchTerm && (
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => setPurchaseOrderSearchTerm("")}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              )}
                            </div>

                            {purchaseOrderSearchTerm && (
                              <div
                                className="position-absolute w-100 mt-1 shadow-lg"
                                style={{ zIndex: 1000 }}
                              >
                                <ul
                                  className="list-group rounded-bottom overflow-auto"
                                  style={{ maxHeight: "200px" }}
                                >
                                  {purchaseOrders
                                    .filter((purchaseOrder) =>
                                      purchaseOrder.referenceNo
                                        ?.replace(/\s/g, "")
                                        ?.toLowerCase()
                                        .includes(
                                          purchaseOrderSearchTerm
                                            .toLowerCase()
                                            .replace(/\s/g, "")
                                        )
                                    )
                                    .map((purchaseOrder) => (
                                      <li
                                        key={purchaseOrder.purchaseOrderId}
                                        className="list-group-item list-group-item-action"
                                      >
                                        <button
                                          className="btn btn-link text-decoration-none text-start w-100 p-0"
                                          type="button"
                                          onClick={() =>
                                            handlePurchaseOrderChange(
                                              purchaseOrder.referenceNo
                                            )
                                          }
                                        >
                                          <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                                          {purchaseOrder?.referenceNo}
                                        </button>
                                      </li>
                                    ))}
                                  {purchaseOrders.filter((purchaseOrder) =>
                                    purchaseOrder.referenceNo
                                      ?.replace(/\s/g, "")
                                      ?.toLowerCase()
                                      .includes(
                                        purchaseOrderSearchTerm
                                          .toLowerCase()
                                          .replace(/\s/g, "")
                                      )
                                  ).length === 0 && (
                                    <li className="list-group-item text-center text-muted">
                                      <i className="bi bi-emoji-frown me-2"></i>
                                      No purchase orders found
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          {selectedPurchaseOrder === null && (
                            <small className="form-text text-muted d-block mt-1">
                              {validationErrors.purchaseOrderId && (
                                <span className="text-danger">
                                  {validationErrors.purchaseOrderId}
                                </span>
                              )}
                              {!validationErrors.purchaseOrderId &&
                                "Please search for a purchase order and select it"}
                            </small>
                          )}
                        </div>
                      )}

                    {formData.grnType === "finishedGoodsIn" && (
                      <div
                        className="alert alert-warning d-flex align-items-center"
                        role="alert"
                      >
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <div>
                          This is a "Finished Goods In", no need a purchase
                          order.
                        </div>
                      </div>
                    )}

                    {formData.grnType === "directPurchase" && (
                      <div
                        className="alert alert-warning d-flex align-items-center"
                        role="alert"
                      >
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <div>
                          This is a "Direct Purchase", no need a purchase order.
                        </div>
                      </div>
                    )}

                    {selectedPurchaseOrder && (
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <i className="bi bi-check-circle me-2"></i>Selected
                          Purchase Order
                        </div>
                        <div className="card-body">
                          <div className="mb-2">
                            <strong>Reference No:</strong>{" "}
                            {selectedPurchaseOrder?.referenceNo}
                          </div>
                          <div className="mb-2">
                            <strong>Supplier:</strong>{" "}
                            {selectedPurchaseOrder?.supplier?.supplierName}
                          </div>
                          <div className="mb-3">
                            <strong>Order Date:</strong>{" "}
                            {selectedPurchaseOrder?.orderDate?.split("T")[0] ??
                              ""}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleResetPurchaseOrder}
                          >
                            <i className="bi bi-x-circle me-1"></i>Reset
                            Purchase Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Purchase Requisition Search */}
                {searchByPR && (
                  <div className="mt-3">
                    <div className="mb-3">
                      <label
                        htmlFor="purchaseRequisition"
                        className="form-label fw-semibold"
                      >
                        Purchase Requisition
                      </label>
                      <div className="position-relative">
                        {selectedPurchaseRequisition === null && (
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0"
                              placeholder="Search for a purchase requisition..."
                              value={purchaseRequisitionSearchTerm}
                              onChange={(e) =>
                                setPurchaseRequisitionSearchTerm(e.target.value)
                              }
                            />
                            {purchaseRequisitionSearchTerm && (
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() =>
                                  setPurchaseRequisitionSearchTerm("")
                                }
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            )}
                          </div>
                        )}

                        {purchaseRequisitionSearchTerm && (
                          <div
                            className="position-absolute w-100 mt-1 shadow-lg"
                            style={{ zIndex: 1000 }}
                          >
                            <ul
                              className="list-group rounded-bottom overflow-auto"
                              style={{ maxHeight: "200px" }}
                            >
                              {purchaseRequisitions
                                .filter((pr) =>
                                  pr.referenceNo
                                    ?.replace(/\s/g, "")
                                    ?.toLowerCase()
                                    .includes(
                                      purchaseRequisitionSearchTerm
                                        .toLowerCase()
                                        .replace(/\s/g, "")
                                    )
                                )
                                .map((purchaseRequisition) => (
                                  <li
                                    key={
                                      purchaseRequisition.purchaseRequisitionId
                                    }
                                    className="list-group-item list-group-item-action"
                                  >
                                    <button
                                      className="btn btn-link text-decoration-none text-start w-100 p-0"
                                      type="button"
                                      onClick={() =>
                                        handlePurchaseRequisitionChange(
                                          purchaseRequisition.referenceNo
                                        )
                                      }
                                    >
                                      <i className="bi bi-file-earmark-text me-2 text-success"></i>
                                      {purchaseRequisition?.referenceNo}
                                    </button>
                                  </li>
                                ))}
                              {purchaseRequisitions.filter((pr) =>
                                pr.referenceNo
                                  ?.replace(/\s/g, "")
                                  ?.toLowerCase()
                                  .includes(
                                    purchaseRequisitionSearchTerm
                                      .toLowerCase()
                                      .replace(/\s/g, "")
                                  )
                              ).length === 0 && (
                                <li className="list-group-item text-center text-muted">
                                  <i className="bi bi-emoji-frown me-2"></i>
                                  No purchase requisition found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      {selectedPurchaseRequisition === null && (
                        <small className="form-text text-muted d-block mt-1">
                          {validationErrors.purchaseRequisitionId && (
                            <span className="text-danger">
                              {validationErrors.purchaseRequisitionId}
                            </span>
                          )}
                          {!validationErrors.purchaseRequisitionId &&
                            "Please search for a purchase requisition and select it"}
                        </small>
                      )}
                    </div>

                    {selectedPurchaseRequisition && (
                      <div className="card border-success mb-3">
                        <div className="card-header bg-success text-white">
                          <i className="bi bi-check-circle me-2"></i>Selected
                          Purchase Requisition
                        </div>
                        <div className="card-body">
                          <div className="mb-2">
                            <strong>Reference No:</strong>{" "}
                            {selectedPurchaseRequisition?.referenceNo}
                          </div>
                          <div className="mb-2">
                            <strong>Requested By:</strong>{" "}
                            {selectedPurchaseRequisition?.requestedBy}
                          </div>
                          <div className="mb-3">
                            <strong>Requisition Date:</strong>{" "}
                            {selectedPurchaseRequisition?.requisitionDate?.split(
                              "T"
                            )[0] ?? ""}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleResetPurchaseRequisition}
                          >
                            <i className="bi bi-x-circle me-1"></i>Reset
                            Purchase Requisition
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Supplier Search */}
                    <div className="mb-3">
                      <label
                        htmlFor="supplierDetails"
                        className="form-label fw-semibold"
                      >
                        Supplier
                      </label>
                      <div className="position-relative">
                        {formData?.selectedSupplier === null && (
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className={`form-control border-start-0 ${
                                validFields.supplierId ? "is-valid" : ""
                              } ${
                                validationErrors.supplierId ? "is-invalid" : ""
                              }`}
                              placeholder="Search for a supplier..."
                              value={supplierSearchTerm}
                              onChange={(e) =>
                                setSupplierSearchTerm(e.target.value)
                              }
                            />
                            {supplierSearchTerm && (
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setSupplierSearchTerm("")}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            )}
                          </div>
                        )}

                        {supplierSearchTerm && (
                          <div
                            className="position-absolute w-100 mt-1 shadow-lg"
                            style={{ zIndex: 1000 }}
                          >
                            <ul
                              className="list-group rounded-bottom overflow-auto"
                              style={{ maxHeight: "200px" }}
                            >
                              {suppliers
                                ?.filter(
                                  (supplier) =>
                                    supplier.supplierName
                                      .toLowerCase()
                                      .includes(
                                        supplierSearchTerm.toLowerCase()
                                      ) ||
                                    supplier.phone
                                      .replace(/\s/g, "")
                                      .includes(
                                        supplierSearchTerm.replace(/\s/g, "")
                                      )
                                )
                                .map((supplier) => (
                                  <li
                                    key={supplier.supplierId}
                                    className="list-group-item list-group-item-action"
                                  >
                                    <button
                                      className="btn btn-link text-decoration-none text-start w-100 p-0"
                                      type="button"
                                      onClick={() =>
                                        handleSelectSupplier(supplier)
                                      }
                                    >
                                      <i className="bi bi-shop me-2 text-info"></i>
                                      {supplier?.supplierName} -{" "}
                                      {supplier?.phone}
                                    </button>
                                  </li>
                                ))}
                              {suppliers?.filter(
                                (supplier) =>
                                  supplier.supplierName
                                    .toLowerCase()
                                    .includes(
                                      supplierSearchTerm.toLowerCase()
                                    ) ||
                                  supplier.phone
                                    .replace(/\s/g, "")
                                    .includes(
                                      supplierSearchTerm.replace(/\s/g, "")
                                    )
                              ).length === 0 && (
                                <li className="list-group-item text-center text-muted">
                                  <i className="bi bi-emoji-frown me-2"></i>
                                  No suppliers found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      {formData.selectedSupplier === "" && (
                        <small className="form-text text-muted d-block mt-1">
                          {validationErrors.supplierId && (
                            <span className="text-danger">
                              {validationErrors.supplierId}
                            </span>
                          )}
                          {!validationErrors.supplierId &&
                            "Please search for a supplier and select it"}
                        </small>
                      )}
                    </div>

                    {formData.selectedSupplier && (
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <i className="bi bi-check-circle me-2"></i>Selected
                          Supplier
                        </div>
                        <div className="card-body">
                          <div className="mb-2">
                            <strong>Supplier Name:</strong>{" "}
                            {formData.selectedSupplier.supplierName}
                          </div>
                          <div className="mb-3">
                            <strong>Phone:</strong>{" "}
                            {formData.selectedSupplier.phone}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleResetSupplier}
                          >
                            <i className="bi bi-x-circle me-1"></i>Reset
                            Supplier
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Supply Return Search */}
                {searchBySR && (
                  <div className="mt-3">
                    <div className="mb-3">
                      <label
                        htmlFor="supplyReturn"
                        className="form-label fw-semibold"
                      >
                        Supply Return
                      </label>
                      <div className="position-relative">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-search text-muted"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search for a supply return..."
                            value={supplyReturnSearchTerm}
                            onChange={(e) =>
                              setSupplyReturnSearchTerm(e.target.value)
                            }
                          />
                          {supplyReturnSearchTerm && (
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setSupplyReturnSearchTerm("")}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          )}
                        </div>

                        {supplyReturnSearchTerm && (
                          <div
                            className="position-absolute w-100 mt-1 shadow-lg"
                            style={{ zIndex: 1000 }}
                          >
                            <ul
                              className="list-group rounded-bottom overflow-auto"
                              style={{ maxHeight: "200px" }}
                            >
                              {approvedSupplyReturnMasters
                                .filter((supplyReturn) =>
                                  supplyReturn.referenceNo
                                    ?.replace(/\s/g, "")
                                    ?.toLowerCase()
                                    .includes(
                                      supplyReturnSearchTerm
                                        .toLowerCase()
                                        .replace(/\s/g, "")
                                    )
                                )
                                .map((supplyReturn) => (
                                  <li
                                    key={supplyReturn.supplyReturnMasterId}
                                    className="list-group-item list-group-item-action"
                                  >
                                    <button
                                      className="btn btn-link text-decoration-none text-start w-100 p-0"
                                      type="button"
                                      onClick={() =>
                                        handleSupplyReturnChange(
                                          supplyReturn.referenceNo
                                        )
                                      }
                                    >
                                      <i className="bi bi-file-earmark-text me-2 text-warning"></i>
                                      {supplyReturn?.referenceNo}
                                    </button>
                                  </li>
                                ))}
                              {approvedSupplyReturnMasters.filter(
                                (supplyReturn) =>
                                  supplyReturn.referenceNo
                                    ?.replace(/\s/g, "")
                                    ?.toLowerCase()
                                    .includes(
                                      supplyReturnSearchTerm
                                        .toLowerCase()
                                        .replace(/\s/g, "")
                                    )
                              ).length === 0 && (
                                <li className="list-group-item text-center text-muted">
                                  <i className="bi bi-emoji-frown me-2"></i>
                                  No supply return found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      {selectedSupplyReturn === null && (
                        <small className="form-text text-muted d-block mt-1">
                          {validationErrors.supplyReturnMasterId && (
                            <span className="text-danger">
                              {validationErrors.supplyReturnMasterId}
                            </span>
                          )}
                          {!validationErrors.supplyReturnMasterId &&
                            "Please search for a supply return and select it"}
                        </small>
                      )}
                    </div>

                    {selectedSupplyReturn && (
                      <div className="card border-warning">
                        <div className="card-header bg-warning text-dark">
                          <i className="bi bi-check-circle me-2"></i>Selected
                          Supply Return
                        </div>
                        <div className="card-body">
                          <div className="mb-2">
                            <strong>Reference No:</strong>{" "}
                            {selectedSupplyReturn?.referenceNo}
                          </div>
                          <div className="mb-2">
                            <strong>Supplier:</strong>{" "}
                            {selectedSupplyReturn?.supplier?.supplierName}
                          </div>
                          <div className="mb-3">
                            <strong>Returned Date:</strong>{" "}
                            {selectedSupplyReturn?.returnDate?.split("T")[0] ??
                              ""}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleResetSupplyReturn}
                          >
                            <i className="bi bi-x-circle me-1"></i>Reset Supply
                            Return
                          </button>
                        </div>
                      </div>
                    )}
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
            {["finishedGoodsIn", "directPurchase"].includes(
              formData?.grnType
            ) && (
              <div className="mb-3">
                <div className="position-relative">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search for an item..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>

                  {searchTerm && (
                    <div
                      className="position-absolute w-100 mt-1 shadow-lg"
                      style={{ zIndex: 1000 }}
                    >
                      <ul
                        className="list-group rounded-bottom overflow-auto"
                        style={{ maxHeight: "200px" }}
                      >
                        {isItemsLoading ? (
                          <li className="list-group-item">
                            <ButtonLoadingSpinner text="Searching..." />
                          </li>
                        ) : isItemsError ? (
                          <li className="list-group-item text-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Error: {itemsError.message}
                          </li>
                        ) : availableItems === null ||
                          availableItems?.filter(
                            (item) =>
                              !formData.itemDetails.some(
                                (detail) => detail.id === item.itemMasterId
                              )
                          ).length === 0 ? (
                          <li className="list-group-item text-center text-muted">
                            <i className="bi bi-emoji-frown me-2"></i>
                            No items found
                          </li>
                        ) : (
                          availableItems
                            ?.filter(
                              (item) =>
                                !formData.itemDetails.some(
                                  (detail) => detail.id === item.itemMasterId
                                )
                            )
                            .map((item) => (
                              <li
                                key={item.itemMasterId}
                                className="list-group-item list-group-item-action"
                              >
                                <button
                                  className="btn btn-link text-decoration-none text-start w-100 p-0"
                                  type="button"
                                  onClick={() => handleSelectItem(item)}
                                >
                                  <i className="bi bi-cart4 me-2"></i>
                                  <span className="text-dark">
                                    {item.itemCode} - {item.itemName}
                                  </span>
                                </button>
                              </li>
                            ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {!formData.itemDetails.length > 0 && (
                  <small className="form-text text-muted d-block mt-2">
                    <i className="bi bi-info-circle me-1"></i>
                    Please search for an item and add it
                  </small>
                )}
              </div>
            )}

            {!["finishedGoodsIn", "directPurchase"].includes(
              formData?.grnType
            ) &&
              selectedPurchaseOrder === null && (
                <div
                  className="alert alert-info d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <div>
                    Please select a purchase order or purchase requisition to
                    add item details.
                  </div>
                </div>
              )}

            {selectedPurchaseOrder !== null &&
              formData.itemDetails.length === 0 && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    Selected purchase order has no remaining items to receive.
                  </div>
                </div>
              )}

            {formData.itemDetails.length > 0 && (
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
                      <th className="fw-semibold text-center">Action</th>
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
                              value={item.expiryDate}
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
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <i className="bi bi-trash me-1"></i>
                            </button>
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
                                {validationErrors[
                                  `rejectionReason_${index}`
                                ] && (
                                  <div className="invalid-feedback">
                                    {
                                      validationErrors[
                                        `rejectionReason_${index}`
                                      ]
                                    }
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
              <ButtonLoadingSpinner text="Submitting..." />
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>Submit
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
      </form>
    </div>
  );
};

export default Grn;

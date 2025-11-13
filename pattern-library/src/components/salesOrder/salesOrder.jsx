import React from "react";
import useSalesOrder from "./useSalesOrder";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import Customer from "../customer/customer";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import BatchSelectionModal from "../batchSelectionModal/batchSelectionModal";
import useFormatCurrency from "../salesInvoice/helperMethods/useFormatCurrency";

const SalesOrder = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    customers,
    salesPersons,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    showCreateCustomerModal,
    showCreateCustomerMoalInParent,
    directOrder,
    isError,
    isLoading,
    error,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    selectedBatch,
    itemBatches,
    customerSearchTerm,
    salesPersonSearchTerm,
    isCustomersLoading,
    isSalesPersonsLoading,
    isCustomersError,
    isSalesPersonsError,
    customersError,
    salesPersonsError,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    loading,
    loadingDraft,
    isCompanyLoading,
    isCompanyError,
    showModal,
    company,
    closeModal,
    handleShowCreateCustomerModal,
    handleCloseCreateCustomerModal,
    handleInputChange,
    handleCustomerChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    calculateSubTotal,
    handleAddCustomer,
    setDirectOrder,
    setSearchTerm,
    handleSelectItem,
    handleBatchSelection,
    handleResetCustomer,
    handleResetSalesPerson,
    handleSelectCustomer,
    handleSelectSalesPerson,
    setCustomerSearchTerm,
    setSalesPersonSearchTerm,
    renderColumns,
    renderSubColumns,
  } = useSalesOrder({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const formatTotals = useFormatCurrency({ showCurrency: false });

  if (
    isCustomersLoading ||
    isSalesPersonsLoading ||
    isLoadingchargesAndDeductions ||
    isLoadingTransactionTypes ||
    isCompanyLoading
  ) {
    return <LoadingSpinner />;
  }

  if (
    isCustomersError ||
    isSalesPersonsError ||
    ischargesAndDeductionsError ||
    isTransactionTypesError ||
    isCustomersError
  ) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handleClose}
            className="btn btn-dark d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="text-muted small">
            <CurrentDateTime />
          </div>
        </div>
        <h2 className="text-center mb-3 fw-bold">Sales Order</h2>
        <hr className="mb-4" />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div
          className="alert alert-success mb-3 d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>
            <strong>Success!</strong> Sales order submitted successfully!
            <div className="mt-1">
              Reference Number:{" "}
              <span className="badge bg-success">{referenceNo}</span>
            </div>
          </div>
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div
          className="alert alert-info mb-3 d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2 fs-5"></i>
          <div>
            <strong>Saved as Draft!</strong> You can edit and submit it later.
            <div className="mt-1">
              Reference Number:{" "}
              <span className="badge bg-info">{referenceNo}</span>
            </div>
          </div>
        </div>
      )}
      {submissionStatus === "error" && (
        <div
          className="alert alert-danger mb-3 d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>
            <strong>Error!</strong> Failed to submit sales order. Please try
            again.
          </div>
        </div>
      )}

      <form>
        {/* Section 1: Order Type and Customer Details */}
        <div className="row mb-4 g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-cart-check me-2"></i>Order Type and
                  Customer Details
                </h5>
              </div>
              <div className="card-body">
                {/* Order Type Checkbox */}
                <div className="form-check mb-4 p-3 bg-light rounded">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="directOrderCheckbox"
                    checked={directOrder}
                    onChange={() => setDirectOrder(!directOrder)}
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="directOrderCheckbox"
                  >
                    <i className="bi bi-lightning-fill text-warning me-2"></i>
                    Direct Order (No Customer Selection)
                  </label>
                </div>

                {/* Customer Information */}
                {!directOrder && (
                  <div className="mb-4">
                    <label
                      htmlFor="customerId"
                      className="form-label fw-semibold"
                    >
                      <i className="bi bi-person-fill me-2"></i>Customer
                    </label>
                    {formData.selectedCustomer === "" && (
                      <div className="position-relative">
                        <div className="input-group mb-2">
                          <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control border-start-0 ps-0 ${
                              validFields.supplierId ? "is-valid" : ""
                            } ${
                              validationErrors.supplierId ? "is-invalid" : ""
                            }`}
                            placeholder="Search by name or phone..."
                            value={customerSearchTerm}
                            onChange={(e) =>
                              setCustomerSearchTerm(e.target.value)
                            }
                            autoFocus={false}
                          />
                          {customerSearchTerm && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setCustomerSearchTerm("")}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          )}
                        </div>

                        {/* Dropdown for filtered customers */}
                        {customerSearchTerm && (
                          <div className="dropdown w-100">
                            <ul
                              className="dropdown-menu show w-100 shadow-lg border-0"
                              style={{ maxHeight: "300px", overflowY: "auto" }}
                            >
                              {customers
                                .filter(
                                  (customer) =>
                                    customer.customerName
                                      .toLowerCase()
                                      .includes(
                                        customerSearchTerm.toLowerCase()
                                      ) ||
                                    customer.phone
                                      .replace(/\s/g, "")
                                      .includes(
                                        customerSearchTerm.replace(/\s/g, "")
                                      )
                                )
                                .map((customer) => (
                                  <li key={customer.customerId}>
                                    <button
                                      type="button"
                                      className="dropdown-item py-2 d-flex align-items-center"
                                      onClick={() =>
                                        handleSelectCustomer(customer)
                                      }
                                    >
                                      <i className="bi bi-person-lines-fill text-primary me-3 fs-5"></i>
                                      <div>
                                        <div className="fw-semibold">
                                          {customer?.customerName}
                                        </div>
                                        <small className="text-muted">
                                          {customer?.phone}
                                        </small>
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              {customers.filter(
                                (customer) =>
                                  customer.customerName
                                    .toLowerCase()
                                    .includes(
                                      customerSearchTerm.toLowerCase()
                                    ) ||
                                  customer.phone
                                    .replace(/\s/g, "")
                                    .includes(
                                      customerSearchTerm.replace(/\s/g, "")
                                    )
                              ).length === 0 && (
                                <>
                                  <li className="dropdown-item text-center text-muted">
                                    <i className="bi bi-emoji-frown me-2"></i>
                                    No customers found
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        )}
                        {formData.selectedCustomer === "" && (
                          <div>
                            <small className="form-text text-muted">
                              {validationErrors.customerId && (
                                <div className="text-danger mb-1 fw-semibold">
                                  <i className="bi bi-exclamation-circle me-1"></i>
                                  {validationErrors.customerId}
                                </div>
                              )}
                              Please search and select a customer
                            </small>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Selected Customer Card */}
                    {formData.selectedCustomer && (
                      <div className="card border-success">
                        <div className="card-header bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
                          <span className="fw-semibold text-success">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Selected Customer
                          </span>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            {/* Left Column: Customer Name & Contact Person */}
                            <div className="col-12 col-md-6">
                              <div className="mb-2">
                                <small className="text-muted d-block">
                                  Customer Name
                                </small>
                                <span className="fw-semibold">
                                  {formData.selectedCustomer.customerName}
                                </span>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted d-block">
                                  Contact Person
                                </small>
                                <span>
                                  {formData.selectedCustomer.contactPerson}
                                </span>
                              </div>
                            </div>

                            {/* Right Column: Phone & Email */}
                            <div className="col-12 col-md-6">
                              <div className="mb-2">
                                <small className="text-muted d-block">
                                  Phone
                                </small>
                                <span>
                                  <i className="bi bi-telephone me-1"></i>
                                  {formData.selectedCustomer.phone}
                                </span>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted d-block">
                                  Email
                                </small>
                                <span>
                                  <i className="bi bi-envelope me-1"></i>
                                  {formData.selectedCustomer.email}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Reset Button - Full width on small screens, centered */}
                          <div className="mt-3">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={handleResetCustomer}
                            >
                              <i className="bi bi-x-circle me-1"></i>Reset
                              Customer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Order Information */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-file-text me-2"></i>Order Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6 mb-3">
                    <label
                      htmlFor="orderDate"
                      className="form-label fw-semibold"
                    >
                      <i className="bi bi-calendar-event me-2"></i>Order Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        validFields.orderDate ? "is-valid" : ""
                      } ${validationErrors.orderDate ? "is-invalid" : ""}`}
                      id="orderDate"
                      placeholder="Enter order date"
                      value={formData.orderDate}
                      onChange={(e) =>
                        handleInputChange("orderDate", e.target.value)
                      }
                      required
                    />
                    {validationErrors.orderDate && (
                      <div className="invalid-feedback">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {validationErrors.orderDate}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label
                      htmlFor="deliveryDate"
                      className="form-label fw-semibold"
                    >
                      <i className="bi bi-truck me-2"></i>Delivery Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        validFields.deliveryDate ? "is-valid" : ""
                      } ${validationErrors.deliveryDate ? "is-invalid" : ""}`}
                      id="deliveryDate"
                      placeholder="Enter delivery date"
                      value={formData.deliveryDate}
                      onChange={(e) =>
                        handleInputChange("deliveryDate", e.target.value)
                      }
                      required
                    />
                    {validationErrors.deliveryDate && (
                      <div className="invalid-feedback">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {validationErrors.deliveryDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sales Person Information */}
                <div>
                  <label
                    htmlFor="salesPersonId"
                    className="form-label fw-semibold"
                  >
                    <i className="bi bi-person-badge-fill me-2"></i>Sales Person
                  </label>
                  {formData.selectedSalesPerson === null && (
                    <div className="position-relative">
                      <div className="input-group mb-2">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ps-0 ${
                            validFields.salesPersonId ? "is-valid" : ""
                          } ${
                            validationErrors.salesPersonId ? "is-invalid" : ""
                          }`}
                          placeholder="Search by name or contact..."
                          value={salesPersonSearchTerm}
                          onChange={(e) =>
                            setSalesPersonSearchTerm(e.target.value)
                          }
                        />
                        {salesPersonSearchTerm && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setSalesPersonSearchTerm("")}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>

                      {/* Dropdown for filtered sales persons */}
                      {salesPersonSearchTerm && (
                        <div className="dropdown w-100">
                          <ul
                            className="dropdown-menu show w-100 shadow-lg border-0"
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                          >
                            {salesPersons
                              .filter(
                                (salesPerson) =>
                                  salesPerson.firstname
                                    .toLowerCase()
                                    .includes(
                                      salesPersonSearchTerm.toLowerCase()
                                    ) ||
                                  salesPerson.contactNo
                                    .replace(/\s/g, "")
                                    .includes(
                                      salesPersonSearchTerm.replace(/\s/g, "")
                                    )
                              )
                              .map((salesPerson) => (
                                <li key={salesPerson.salesPersonId}>
                                  <button
                                    type="button"
                                    className="dropdown-item py-2 d-flex align-items-center"
                                    onClick={() =>
                                      handleSelectSalesPerson(salesPerson)
                                    }
                                  >
                                    <i className="bi bi-person-lines-fill text-primary me-3 fs-5"></i>
                                    <div>
                                      <div className="fw-semibold">
                                        {salesPerson?.firstname}
                                      </div>
                                      <small className="text-muted">
                                        {salesPerson?.contactNo}
                                      </small>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            {salesPersons.filter(
                              (salesPerson) =>
                                salesPerson.firstname
                                  .toLowerCase()
                                  .includes(
                                    salesPersonSearchTerm.toLowerCase()
                                  ) ||
                                salesPerson.contactNo
                                  .replace(/\s/g, "")
                                  .includes(
                                    salesPersonSearchTerm.replace(/\s/g, "")
                                  )
                            ).length === 0 && (
                              <li className="dropdown-item text-center py-3">
                                <i className="bi bi-emoji-frown fs-3 text-muted d-block mb-2"></i>
                                <span className="text-muted">
                                  No sales person found
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sales Person Details */}
                  {formData.selectedSalesPerson && (
                    <div className="card border-success">
                      <div className="card-header bg-success bg-opacity-10">
                        <span className="fw-semibold text-success">
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Selected Sales Person
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          {/* Left Column: Sales Person Name */}
                          <div className="col-12 col-md-6">
                            <div className="mb-2">
                              <small className="text-muted d-block">
                                Sales Person Name
                              </small>
                              <span className="fw-semibold">
                                {formData.selectedSalesPerson.firstname}
                              </span>
                            </div>
                          </div>

                          {/* Right Column: Contact No & Email */}
                          <div className="col-12 col-md-6">
                            <div className="mb-2">
                              <small className="text-muted d-block">
                                Contact No
                              </small>
                              <span>
                                <i className="bi bi-telephone me-1"></i>
                                {formData.selectedSalesPerson.contactNo}
                              </span>
                            </div>
                            {/* <div className="mb-3">
                              <small className="text-muted d-block">
                                Email
                              </small>
                              <span>
                                <i className="bi bi-envelope me-1"></i>
                                {formData.selectedSalesPerson.email}
                              </span>
                            </div> */}
                          </div>
                        </div>

                        {/* Reset Button - Full width, spaced from content */}
                        <div className="mt-3">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={handleResetSalesPerson}
                          >
                            <i className="bi bi-x-circle me-1"></i>Reset Sales
                            Person
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
            <div className="row">
              <div className="col-lg-6">
                {/* Item Search */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Search Items</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for an item..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={formData.selectedSalesPerson === null}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm("")}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>

                  {/* Dropdown for filtered items */}
                  {searchTerm && (
                    <div className="dropdown w-100 position-relative">
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
                        ) : availableItems === null ||
                          availableItems.length === 0 ||
                          availableItems.filter((item) => {
                            if (company.batchStockType === "FIFO") {
                              return !formData.itemDetails.some(
                                (detail) =>
                                  detail.itemMasterId === item.itemMasterId
                              );
                            }
                            return true;
                          }).length === 0 ? (
                          <li className="dropdown-item text-center py-3">
                            <i className="bi bi-emoji-frown fs-3 text-muted d-block mb-2"></i>
                            <span className="text-muted">No items found</span>
                          </li>
                        ) : (
                          availableItems
                            .filter((item) => {
                              if (company.batchStockType === "FIFO") {
                                return !formData.itemDetails.some(
                                  (detail) =>
                                    detail.itemMasterId === item.itemMasterId
                                );
                              }
                              return true;
                            })
                            .map((item) => (
                              <li key={item.itemMasterId}>
                                <button
                                  type="button"
                                  className="dropdown-item py-2 d-flex align-items-center"
                                  onClick={() => handleSelectItem(item)}
                                >
                                  <i className="bi bi-cart4 text-success me-3 fs-5"></i>
                                  <div>
                                    <div className="fw-semibold">
                                      {item.itemCode}
                                    </div>
                                    <small className="text-muted">
                                      {item.itemName}
                                    </small>
                                  </div>
                                </button>
                              </li>
                            ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            {formData.itemDetails.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Item Name</th>
                      <th>Unit</th>
                      {company.batchStockType !== "FIFO" && (
                        <th className="fw-semibold">Batch Ref</th>
                      )}
                      <th className="text-center">Stock In Hand</th>
                      <th className="fw-end">Quantity</th>
                      <th className="text-center">Unit Price</th>
                      {renderColumns()}
                      <th className="text-end">Total Price</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.itemDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {item.packSize} ml
                          </span>
                        </td>
                        {company.batchStockType !== "FIFO" && (
                          <td>
                            <span className="badge bg-info">
                              {item.batchRef}
                            </span>
                          </td>
                        )}
                        <td className="text-center">
                          <span className="fw-semibold">
                            {formatTotals(item.tempQuantity)}
                          </span>
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validFields[`quantity_${index}`] ? "is-valid" : ""
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
                        <td className="text-end">
                          {formatTotals(item.unitPrice.toFixed(2))}
                        </td>
                        {item.chargesAndDeductions.map(
                          (charge, chargeIndex) => (
                            <td key={chargeIndex}>
                              <input
                                className="form-control"
                                type="number"
                                value={charge.value}
                                onChange={(e) => {
                                  let newValue = parseFloat(e.target.value);

                                  if (isNaN(newValue)) {
                                    newValue = 0;
                                  } else {
                                    if (charge.isPercentage) {
                                      newValue = Math.min(
                                        100,
                                        Math.max(0, newValue)
                                      );
                                    } else {
                                      newValue = Math.max(0, newValue);
                                    }
                                  }

                                  handleItemDetailsChange(
                                    index,
                                    `chargesAndDeductions_${chargeIndex}_value`,
                                    newValue
                                  );
                                }}
                              />
                            </td>
                          )
                        )}
                        <td className="text-end fw-semibold">
                          {formatTotals(item.totalPrice.toFixed(2))}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td
                        colSpan={
                          6 +
                          formData.itemDetails[0].chargesAndDeductions.length -
                          (company.batchStockType === "FIFO" ? 1 : 0)
                        }
                      ></td>
                      <th className="text-end">Sub Total</th>
                      <td className="text-end fw-bold">
                        {formatTotals(calculateSubTotal().toFixed(2))}
                      </td>
                    </tr>
                    {renderSubColumns()}
                    <tr className="table-primary">
                      <td
                        colSpan={
                          6 +
                          formData.itemDetails[0].chargesAndDeductions.length -
                          (company.batchStockType === "FIFO" ? 1 : 0)
                        }
                      ></td>
                      <th className="text-end fs-6">Total Amount</th>
                      <td className="text-end fw-bold fs-6">
                        {formatTotals(calculateTotalAmount().toFixed(2))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {formData.itemDetails.length === 0 && (
              <div className="alert alert-info text-center" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                No items added yet. Search and select items to add to the Sales
                order.
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Attachments */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <i className="bi bi-paperclip me-2"></i>Attachments
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <label htmlFor="attachment" className="form-label fw-semibold">
                  Upload Files (optional)
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
                <small className="form-text text-muted d-block mt-1">
                  <i className="bi bi-info-circle me-1"></i>File size limit:
                  10MB
                </small>
                {validationErrors.attachments && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {validationErrors.attachments}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
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
                    <i className="bi bi-check-circle me-2"></i>Submit Order
                  </>
                )}
              </button>
              <button
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
              </button>
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
        </div>
      </form>
    </div>
  );
};

export default SalesOrder;

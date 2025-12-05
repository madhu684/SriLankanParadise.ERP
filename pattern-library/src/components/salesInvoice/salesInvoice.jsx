import useSalesInvoice from "./useSalesInvoice";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import CustomerStatusMessage from "./helperMethods/CustomerStatusMessage";
import useFormatCurrency from "./helperMethods/useFormatCurrency";

const SalesInvoice = ({ handleClose, handleUpdated, salesOrder }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    isLoading,
    isError,
    error,
    searchTerm,
    isItemsError,
    isItemsLoading,
    isLoadingTransactionTypes,
    isLoadingchargesAndDeductions,
    isTransactionTypesError,
    ischargesAndDeductionsError,
    itemsError,
    availableItems,
    selectedBatch,
    loading,
    loadingDraft,
    isCompanyLoading,
    isCompanyError,
    company,
    locationInventories,
    customerSearchTerm,
    isLocationInventoryLoading,
    isWarehouseLocationLoading,
    userLocations,
    customers,
    isCustomersLoading,
    isCustomersError,
    hasLineItemChargesChanged,
    creditMismatchDetails,
    handleCustomerSelect,
    handleResetCustomer,
    refetchCustomers,
    setCustomerSearchTerm,
    handleInputChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    setSearchTerm,
    handleSelectItem,
    calculateSubTotal,
    calculateTotalLites,
    renderColumns,
    renderSubColumns,
  } = useSalesInvoice({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
    salesOrder,
  });

  const formatCurrency = useFormatCurrency();
  const formatTotals = useFormatCurrency({ showCurrency: false });
  const { message, disableSubmit } = CustomerStatusMessage({ formData });

  if (
    isError ||
    ischargesAndDeductionsError ||
    isTransactionTypesError ||
    isCompanyError
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
            // style={{ minWidth: "100px" }}
          >
            <i className="bi bi-arrow-left"></i>
            {/* <span>Back</span> */}
          </button>
          <div className="text-muted small">
            <CurrentDateTime />
          </div>
        </div>
        <h2 className="text-center mb-3 fw-bold">Sales Invoice</h2>
        <hr className="mb-4" />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div
          className="alert alert-success alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Success!</strong> Sales invoice submitted successfully!
          <br />
          Reference Number: <strong>{referenceNo}</strong>
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div
          className="alert alert-info alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>Saved as Draft!</strong> You can edit and submit it later.
          <br />
          Reference Number: <strong>{referenceNo}</strong>
        </div>
      )}
      {submissionStatus === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error!</strong> Unable to submit sales invoice. Please try
          again.
        </div>
      )}

      <form>
        <div className="row g-4 mb-4">
          {/* Left Column - Invoice Information and Sales Order details */}
          <div className="col-lg-6 d-flex flex-column">
            {/* Invoice Information */}
            <div className="card shadow-sm mb-3 flex-fill">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-file-text me-2"></i>1. Invoice Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label
                    htmlFor="invoiceDate"
                    className="form-label fw-semibold"
                  >
                    Invoice Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      validFields.invoiceDate ? "is-valid" : ""
                    } ${validationErrors.invoiceDate ? "is-invalid" : ""}`}
                    id="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={(e) =>
                      handleInputChange("invoiceDate", e.target.value)
                    }
                    required
                  />
                  {validationErrors.invoiceDate && (
                    <div className="invalid-feedback">
                      {validationErrors.invoiceDate}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label fw-semibold">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      validFields.dueDate ? "is-valid" : ""
                    } ${validationErrors.dueDate ? "is-invalid" : ""}`}
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                    required
                  />
                  {validationErrors.dueDate && (
                    <div className="invalid-feedback">
                      {validationErrors.dueDate}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="storeLocation"
                    className="form-label fw-semibold"
                  >
                    Store Location <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${
                      validFields.storeLocation ? "is-valid" : ""
                    } ${validationErrors.storeLocation ? "is-invalid" : ""}`}
                    id="storeLocation"
                    value={formData?.storeLocation ?? ""}
                    onChange={(e) =>
                      handleInputChange("storeLocation", e.target.value)
                    }
                  >
                    <option value="">Select Location</option>
                    {userLocations && userLocations != null
                      ? userLocations.map((location) => (
                          <option
                            key={location.location.locationId}
                            value={location.location.locationId}
                          >
                            {location.location.locationName}
                          </option>
                        ))
                      : ""}
                  </select>
                  {validationErrors.storeLocation && (
                    <div className="invalid-feedback">
                      {validationErrors.storeLocation}
                    </div>
                  )}
                </div>

                <div className="mb-0">
                  <label htmlFor="remarks" className="form-label fw-semibold">
                    Remarks
                  </label>
                  <textarea
                    type="text"
                    // className={`form-control ${
                    //   validFields.remarks ? "is-valid" : ""
                    // } ${validationErrors.remarks ? "is-invalid" : ""}`}
                    className="form-control"
                    id="remarks"
                    placeholder="Enter remarks (Min. 150 words)"
                    value={formData.remarks}
                    onChange={(e) =>
                      handleInputChange("remarks", e.target.value)
                    }
                    maxLength={150}
                  />
                </div>
              </div>
            </div>
            {/* Sales Order Details */}
            <div className="card shadow-sm flex-fill">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-cart-check me-2"></i>2. Sales Order
                  Details
                </h5>
              </div>
              <div className="card-body">
                {salesOrder ? (
                  <div>
                    {/* Reference Number - Prominent Display */}
                    <div className="mb-3 pb-3 border-bottom d-flex align-items-center justify-content-between">
                      <div>
                        <small className="text-muted d-block mb-1 fw-semibold">
                          Reference No:
                        </small>
                        <h4 className="mb-0 fw-bold text-dark">
                          {salesOrder.referenceNo}
                        </h4>
                      </div>
                      <div>
                        <small className="text-muted d-block mb-1 fw-semibold">
                          Region:
                        </small>
                        <h4 className="mb-0 fw-bold text-dark">
                          {salesOrder?.customer?.region?.name
                            ?.replace(/\s*Region$/i, "")
                            .trim()}
                        </h4>
                      </div>
                    </div>

                    {/* Dates Section - Two Columns */}
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <small className="text-muted d-block mb-2 fw-semibold">
                          <i className="bi bi-calendar3 me-1"></i>Order Date
                        </small>
                        <p className="mb-0 fs-6 fw-semibold text-dark">
                          {salesOrder.orderDate?.split("T")[0] ?? ""}
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block mb-2 fw-semibold">
                          <i className="bi bi-calendar-check me-1"></i>Delivery
                          Date
                        </small>
                        <p className="mb-0 fs-6 fw-semibold text-dark">
                          {salesOrder.deliveryDate?.split("T")[0] ?? ""}
                        </p>
                      </div>
                    </div>

                    {/* Sales Person */}
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <small className="text-muted d-block mb-2 fw-semibold">
                          Sales Person
                        </small>
                        <span className="badge rounded-pill bg-info text-dark px-3 py-2 fs-6">
                          <i className="bi bi-tag-fill me-1"></i>
                          {salesOrder.salesPerson
                            ? salesOrder.salesPerson?.firstName +
                              " " +
                              salesOrder.salesPerson?.lastName
                            : "N/A"}
                        </span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block mb-2 fw-semibold">
                          <i className="bi bi-bookmark-plus me-1"></i>Customer
                          Po Number
                        </small>
                        <span className="badge rounded-pill bg-secondary text-dark px-3 py-2 fs-6">
                          <i className="bi bi-tag-fill me-1"></i>
                          {salesOrder.customerPoNumber ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="alert alert-warning mb-0 d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi bi-info-circle me-2 fs-5"></i>
                    <div>This is a direct sales invoice, no sales order.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sales Order, Customer & Driver Details */}
          <div className="col-lg-6 d-flex flex-column">
            {/* Customer Details */}
            <div className="card shadow-sm mb-3 flex-fill">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">
                  <i className="bi bi-person-circle me-2"></i>3. Customer
                  Details
                </h5>
              </div>
              <div className="card-body">
                <label htmlFor="customer" className="form-label fw-semibold">
                  Customer <span className="text-danger">*</span>
                </label>
                {formData?.selectedCustomer === null && (
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${
                          validFields.customer ? "is-valid" : ""
                        } ${validationErrors.customer ? "is-invalid" : ""}`}
                        placeholder="Search for a customer..."
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        autoFocus={false}
                      />
                      {validationErrors.customer && (
                        <div className="invalid-feedback">
                          {validationErrors.customer}
                        </div>
                      )}
                      {customerSearchTerm && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setCustomerSearchTerm("")}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>

                    {/* Dropdown for filtered customers */}
                    {customerSearchTerm && (
                      <div className="dropdown position-relative">
                        <ul
                          className="dropdown-menu show shadow"
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {isCustomersLoading && (
                            <li className="dropdown-item text-center">
                              <i className="bi bi-hourglass-split me-2"></i>
                              Loading...
                            </li>
                          )}
                          {isCustomersError && (
                            <li className="dropdown-item text-center text-danger">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              Error loading customers.{" "}
                              <button
                                onClick={refetchCustomers}
                                className="btn btn-link p-0"
                              >
                                Retry
                              </button>
                            </li>
                          )}
                          {!isCustomersLoading &&
                            !isCustomersError &&
                            customers.map((cs) => (
                              <li key={cs.customerId}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => handleCustomerSelect(cs)}
                                >
                                  <i className="bi bi-person me-2"></i>
                                  {cs?.customerCode} - {cs?.customerName}
                                </button>
                              </li>
                            ))}
                          {!isCustomersLoading &&
                            !isCustomersError &&
                            customers.length === 0 && (
                              <li className="dropdown-item text-center text-muted">
                                <i className="bi bi-emoji-frown me-2"></i>
                                No customers found
                              </li>
                            )}
                        </ul>
                      </div>
                    )}

                    {formData.selectedCustomer === null && (
                      <div className="mt-2">
                        <small className="form-text text-muted">
                          {validationErrors.customerId && (
                            <div className="text-danger mb-1">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {validationErrors.customerId}
                            </div>
                          )}
                          Please search for a customer and select it
                        </small>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Customer Information */}
                {formData.selectedCustomer && (
                  <div className="bg-light p-3 rounded mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0 text-primary">Selected Customer</h6>
                      {/* <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleResetCustomer}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Reset
                      </button> */}
                    </div>
                    <hr className="my-2" />
                    <div className="row g-2 small">
                      <div className="col-6">
                        <strong>Name:</strong>{" "}
                        {formData.selectedCustomer?.customerName}
                      </div>
                      <div className="col-6">
                        <strong>Contact:</strong>{" "}
                        {formData.selectedCustomer?.contactPerson}
                      </div>
                      <div className="col-6">
                        <strong>Phone:</strong>{" "}
                        {formData.selectedCustomer?.phone}
                      </div>
                      <div className="col-6">
                        <strong>Email:</strong>{" "}
                        {formData.selectedCustomer?.email}
                      </div>
                      <div className="col-6">
                        <strong>Credit Limit:</strong>{" "}
                        <span className="fw-semibold text-success">
                          {formatCurrency(
                            formData.selectedCustomer?.creditLimit
                          )}
                        </span>
                      </div>
                      <div className="col-6">
                        <strong>Credit Duration:</strong>{" "}
                        {formData.selectedCustomer?.creditDuration + " days"}
                      </div>
                      <div className="col-6">
                        <strong>Outstanding Amount:</strong>{" "}
                        <span className="fw-semibold text-danger">
                          {formatCurrency(
                            formData.selectedCustomer?.outstandingAmount
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Customer ability message */}
                    {formData.selectedCustomer && (
                      <div className="mt-2">{message}</div>
                    )}
                  </div>
                )}

                {formData.selectedCustomer && (
                  <div className="mb-0 p-3">
                    <label
                      htmlFor="deliveryAddress"
                      className="form-label fw-semibold"
                    >
                      Delivery Address <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        validFields.customerDeliveryAddress ? "is-valid" : ""
                      } ${
                        validationErrors.customerDeliveryAddress
                          ? "is-invalid"
                          : ""
                      }`}
                      id="deliveryAddress"
                      //value={formData?.deliveryAddress ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "customerDeliveryAddressId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Address</option>
                      {formData.selectedCustomer
                        ? formData.selectedCustomer.customerDeliveryAddress.map(
                            (address) => (
                              <option key={address.id} value={address.id}>
                                {address.addressLine1} {address.addressLine2}
                              </option>
                            )
                          )
                        : ""}
                    </select>
                    {validationErrors.customerDeliveryAddress && (
                      <div className="invalid-feedback">
                        {validationErrors.customerDeliveryAddress}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Driver Details */}
            <div className="card shadow-sm flex-fill">
              <div className="card-header bg-warning">
                <h5 className="mb-0">
                  <i className="bi bi-truck me-2"></i>4. Driver Details
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label
                    htmlFor="driverName"
                    className="form-label fw-semibold"
                  >
                    Driver Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.driverName ? "is-valid" : ""
                    } ${validationErrors.driverName ? "is-invalid" : ""}`}
                    id="driverName"
                    value={formData.driverName ?? ""}
                    onChange={(e) =>
                      handleInputChange("driverName", e.target.value)
                    }
                    placeholder="Enter Driver Name"
                  />
                  {validationErrors.driverName && (
                    <div className="invalid-feedback">
                      {validationErrors.driverName}
                    </div>
                  )}
                </div>

                <div className="mb-0">
                  <label htmlFor="vehicleNo" className="form-label fw-semibold">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.vehicleNo ? "is-valid" : ""
                    } ${validationErrors.vehicleNo ? "is-invalid" : ""}`}
                    id="vehicleNo"
                    value={formData.vehicleNo ?? ""}
                    onChange={(e) =>
                      handleInputChange("vehicleNo", e.target.value)
                    }
                    placeholder="Enter Vehicle Number"
                  />
                  {validationErrors.vehicleNo && (
                    <div className="invalid-feedback">
                      {validationErrors.vehicleNo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Details Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">
              <i className="bi bi-box-seam me-2"></i>5. Item Details
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* <div className="col-lg-6 mb-3">
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
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>

                {searchTerm && (
                  <div className="dropdown position-relative">
                    <ul
                      className="dropdown-menu show shadow"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {isItemsLoading ? (
                        <li className="dropdown-item text-center">
                          <ButtonLoadingSpinner text="Searching..." />
                        </li>
                      ) : isItemsError ? (
                        <li className="dropdown-item text-danger">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Error: {itemsError.message}
                        </li>
                      ) : availableItems === null ||
                        availableItems.length === 0 ||
                        availableItems.filter((item) => {
                          if (company.batchStockType === "FIFO") {
                            return !formData.itemDetails.some(
                              (detail) => detail.id === item.itemMasterId
                            );
                          }
                          return true;
                        }).length === 0 ? (
                        <li className="dropdown-item text-center text-muted">
                          <i className="bi bi-emoji-frown me-2"></i>
                          No items found
                        </li>
                      ) : (
                        availableItems
                          .filter((item) => {
                            if (company.batchStockType === "FIFO") {
                              return !formData.itemDetails.some(
                                (detail) => detail.id === item.itemMasterId
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
              </div> */}
            </div>

            {formData.itemDetails.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Item Name</th>
                      <th>Unit</th>
                      <th className="text-center">Stock In Hand</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-center">Quantity</th>
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
                        <td className="text-center">
                          {item.isInventoryItem === false ? (
                            <span className="text-muted">-</span>
                          ) : (
                            <span className="fw-semibold">
                              {item.stockInHand}
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          {item.unitPrice
                            ? formatTotals(item.unitPrice.toFixed(2))
                            : "0.00"}
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`form-control text-center ${
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
                            disabled={item.isInventoryItem === false}
                            style={{ minWidth: "100px" }}
                          />
                          {validationErrors[`quantity_${index}`] && (
                            <div className="invalid-feedback">
                              {validationErrors[`quantity_${index}`]}
                            </div>
                          )}
                        </td>
                        {item.chargesAndDeductions.map(
                          (charge, chargeIndex) => (
                            <td key={chargeIndex} className="text-end">
                              <input
                                className="form-control"
                                type="number"
                                value={charge.value}
                                step={0.01}
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
                                style={{ minWidth: "100px" }}
                              />
                            </td>
                          )
                        )}
                        <td className="text-end fw-bold">
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
                    <tr className="table-primary">
                      <td
                        colSpan={
                          6 +
                          formData.itemDetails[0].chargesAndDeductions.length -
                          (company.batchStockType === "FIFO" ? 1 : 0)
                        }
                      ></td>
                      <th className="text-end fs-6">Total Litres</th>
                      <td className="text-end fw-bold fs-6">
                        {formatTotals(calculateTotalLites().toFixed(2))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="alert alert-info text-center" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                No items added yet. Search and select items to add to the
                invoice.
              </div>
            )}
          </div>
        </div>

        {/* Attachments Section */}
        {/* <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <i className="bi bi-paperclip me-2"></i>6. Attachments
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <label htmlFor="attachment" className="form-label fw-semibold">
                  Upload Files (Optional)
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
                <small className="form-text text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  File size limit: 10MB
                </small>
                {validationErrors.attachments && (
                  <div className="invalid-feedback">
                    {validationErrors.attachments}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}

        {/* Show warning if line item charges were modified */}
        {salesOrder && hasLineItemChargesChanged && (
          <div className="alert alert-warning mb-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Note:</strong> Line item charges have been modified from the
            original sales requisition. This invoice will be switched to
            Approval status from FM.
          </div>
        )}

        {/* Show warning if customer credit limit or credit duration were modified */}
        {salesOrder && creditMismatchDetails.hasLimitMismatch && (
          <div className="alert alert-warning mb-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Note:</strong> The customer credit limit have been modified
            from the original sales requisition. This invoice will be switched
            to Approval status from FM.
          </div>
        )}
        {salesOrder && creditMismatchDetails.hasDurationMismatch && (
          <div className="alert alert-warning mb-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Note:</strong> The customer credit duration have been
            modified from the original sales requisition. This invoice will be
            switched to Approval status from FM.
          </div>
        )}

        {/* Action Buttons */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2 justify-content-start">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmit(false)}
                disabled={
                  !formData.itemDetails.length > 0 ||
                  loading ||
                  loadingDraft ||
                  submissionStatus !== null ||
                  disableSubmit
                }
              >
                {loading && submissionStatus === null ? (
                  <ButtonLoadingSpinner text="Submitting..." />
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Submit Invoice
                  </>
                )}
              </button>
              {/* <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSubmit(true)}
                disabled={
                  !formData.itemDetails.length > 0 ||
                  loading ||
                  loadingDraft ||
                  submissionStatus !== null ||
                  disableSubmit
                }
              >
                {loadingDraft && submissionStatus === null ? (
                  <ButtonLoadingSpinner text="Saving..." />
                ) : (
                  <>
                    <i className="bi bi-floppy me-2"></i>
                    Save as Draft
                  </>
                )}
              </button> */}
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClose}
                disabled={loading || loadingDraft || submissionStatus !== null}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

SalesInvoice.defaultProps = {
  salesOrder: null,
};

export default SalesInvoice;

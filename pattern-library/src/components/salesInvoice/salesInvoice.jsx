import useSalesInvoice from "./useSalesInvoice";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import "./invoice.css";

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
    useAppointment,
    userLocations,
    isLocationInventoryLoading,
    isWarehouseLocationLoading,
    appointmentSearchTerm,
    selectedAppointment,
    appointments,
    appointmentsError,
    isAppointmentsLoading,
    isRefreshing,
    handleRefreshAppointments,
    setAppointmentSearchTerm,
    setUseAppointment,
    handleSelectAppointment,
    handleResetAppointment,
    handleInputChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    calculateTotalAmount,
    setSearchTerm,
    handleSelectItem,
    renderColumns,
    renderSubColumns,
    calculateSubTotal,
    refetchAppointments,
  } = useSalesInvoice({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
    salesOrder,
  });

  if (
    isError ||
    ischargesAndDeductionsError ||
    isTransactionTypesError ||
    isCompanyError
  ) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            class="bi bi-arrow-left"
            onClick={handleClose}
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Sales Invoice</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales invoice submitted successfully! Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales invoice saved as draft, you can edit and submit it later!
          Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting sales invoice. Please try again.
        </div>
      )}

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Order Information */}
            <h4>1. Invoice Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="invoiceDate" className="form-label">
                Invoice Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.invoiceDate ? "is-valid" : ""
                } ${validationErrors.invoiceDate ? "is-invalid" : ""}`}
                id="invoiceDate"
                placeholder="Enter order date"
                value={formData.invoiceDate}
                onChange={(e) =>
                  handleInputChange("invoiceDate", e.target.value)
                }
                disabled
              />
              {validationErrors.invoiceDate && (
                <div className="invalid-feedback">
                  {validationErrors.invoiceDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.dueDate ? "is-valid" : ""
                } ${validationErrors.dueDate ? "is-invalid" : ""}`}
                id="dueDate"
                placeholder="Enter delivery date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
              {validationErrors.dueDate && (
                <div className="invalid-feedback">
                  {validationErrors.dueDate}
                </div>
              )}
              <div className="mt-3">
                <label htmlFor="referenceNumber" className="form-label">
                  Reference Number
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    validFields.referenceNumber ? "is-valid" : ""
                  } ${validationErrors.referenceNumber ? "is-invalid" : ""}`}
                  id="referenceNumber"
                  placeholder="Enter reference number"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    handleInputChange("referenceNumber", e.target.value)
                  }
                  //required
                />
                {validationErrors.referenceNumber && (
                  <div className="invalid-feedback">
                    {validationErrors.referenceNumber}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="storeLocation" className="form-label">
                Store Location
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
          </div>

          <div className="col-md-5">
            <h4>2. Sales Order Details</h4>
            <div className="mt-3">
              <label htmlFor="purchaseOrder" className="form-label">
                Sales Order
              </label>
            </div>
            {/* Additional Sales Order Information */}
            {salesOrder ? (
              <div className="card mb-3">
                <div className="card-header">Selected Sales Order</div>
                <div className="card-body">
                  <p>Sales Order Reference No: {salesOrder.referenceNo}</p>
                  <p>Order Date: {salesOrder.orderDate?.split("T")[0] ?? ""}</p>
                  <p>
                    Delivery Date:{" "}
                    {salesOrder.deliveryDate?.split("T")[0] ?? ""}
                  </p>
                  <p>
                    Order Type:{" "}
                    {salesOrder.customerId !== null
                      ? "Customer Order"
                      : "Direct Order"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning" role="alert">
                This is a direct sales invoice, no sales order.
              </div>
            )}

            {/* Appointment Section */}

            <div className="mt-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check">
                  <input
                    className={`form-check-input ${
                      useAppointment
                        ? "bg-success"
                        : "bg-secondary bg-opacity-50"
                    }`}
                    type="checkbox"
                    id="useAppointmentCheck"
                    checked={useAppointment}
                    onChange={(e) => setUseAppointment(e.target.checked)}
                    disabled={formData?.salesOrderId}
                  />
                  <label
                    className="form-check-label text-dark fw-bold"
                    htmlFor="useAppointmentCheck"
                  >
                    Raise Sales Invoice using Appointment
                  </label>
                </div>
                {useAppointment && (
                  <i
                    className="bi bi-arrow-clockwise"
                    onClick={handleRefreshAppointments}
                    style={{
                      cursor: isRefreshing ? "not-allowed" : "pointer",
                      fontSize: "1.2rem",
                      color: isRefreshing ? "#6c757d" : "#0d6efd",
                      transition: "transform 0.6s ease-in-out",
                      transform: isRefreshing
                        ? "rotate(360deg)"
                        : "rotate(0deg)",
                      display: "inline-block",
                    }}
                    title="Refresh appointments"
                  ></i>
                )}
              </div>

              {useAppointment && !selectedAppointment && (
                <div className="mb-3">
                  <label htmlFor="appointmentSearch" className="form-label">
                    Search Appointment by Token No
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="appointmentSearch"
                      placeholder="Enter token number..."
                      value={appointmentSearchTerm}
                      onChange={(e) => setAppointmentSearchTerm(e.target.value)}
                    />
                    {appointmentSearchTerm && (
                      <span
                        className="input-group-text bg-transparent"
                        style={{ cursor: "pointer" }}
                        onClick={() => setAppointmentSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </span>
                    )}
                  </div>

                  {/* Appointment Dropdown */}
                  {appointmentSearchTerm && (
                    <div className="dropdown" style={{ width: "100%" }}>
                      <ul
                        className="dropdown-menu"
                        style={{
                          display: "block",
                          width: "100%",
                          maxHeight: "300px",
                          overflowY: "auto",
                        }}
                      >
                        {isAppointmentsLoading ? (
                          <li className="dropdown-item">
                            <ButtonLoadingSpinner text="Searching appointments..." />
                          </li>
                        ) : appointmentsError ? (
                          <li className="dropdown-item text-danger">
                            Error loading appointments
                          </li>
                        ) : appointments?.filter((apt) =>
                            apt.tokenNo
                              ?.toString()
                              .includes(appointmentSearchTerm.trim())
                          ).length === 0 ? (
                          <li className="dropdown-item">
                            <span className="me-3">
                              <i className="bi bi-emoji-frown"></i>
                            </span>
                            No appointments found
                          </li>
                        ) : (
                          appointments
                            ?.filter((apt) =>
                              apt.tokenNo
                                ?.toString()
                                .includes(appointmentSearchTerm.trim())
                            )
                            .map((appointment) => (
                              <li key={appointment.id}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleSelectAppointment(appointment)
                                  }
                                >
                                  <div>
                                    <strong>
                                      Token No: {appointment.tokenNo}
                                    </strong>
                                    <br />
                                    <small>
                                      Patient: {appointment.customerName} |
                                      Contact: {appointment.contactNo}
                                      <br />
                                      Date:{" "}
                                      {new Date(
                                        appointment.scheduleDate
                                      ).toLocaleDateString()}{" "}
                                      | Time: {appointment.fromTime} -{" "}
                                      {appointment.toTime}
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
              )}

              {useAppointment && selectedAppointment && (
                <div className="card mb-3">
                  <div className="card-header bg-success text-white">
                    <strong>Selected Appointment</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Token No:</strong>{" "}
                          {selectedAppointment.tokenNo}
                        </p>
                        <p className="mb-2">
                          <strong>Patient:</strong>{" "}
                          {selectedAppointment.customerName}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Contact:</strong>{" "}
                          {selectedAppointment.contactNo}
                        </p>
                        <p className="mb-2">
                          <strong>Time:</strong> {selectedAppointment.fromTime}{" "}
                          - {selectedAppointment.toTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm w-100"
                        onClick={handleResetAppointment}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Reset Appointment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!useAppointment && (
              <div className="mt-3">
                <h4>4. Customer Details</h4>
                <div className="mb-3 mt-3">
                  <label htmlFor="patientName" className="form-label">
                    Token No
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.tokenNo ? "is-valid" : ""
                    } ${validationErrors.patientName ? "is-invalid" : ""}`}
                    id="patientName"
                    placeholder="Enter Token No"
                    value={formData.tokenNo}
                    onChange={(e) =>
                      handleInputChange("tokenNo", e.target.value)
                    }
                    required
                  />
                  {validationErrors.tokenNo && (
                    <div className="invalid-feedback">
                      {validationErrors.tokenNo}
                    </div>
                  )}
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="patientName" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.patientName ? "is-valid" : ""
                    } ${validationErrors.patientName ? "is-invalid" : ""}`}
                    id="patientName"
                    placeholder="Enter Customer Name"
                    value={formData.patientName}
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    required
                  />
                  {validationErrors.patientName && (
                    <div className="invalid-feedback">
                      {validationErrors.patientName}
                    </div>
                  )}
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="patientNo" className="form-label">
                    Customer Contact No
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.patientNo ? "is-valid" : ""
                    } ${validationErrors.patientNo ? "is-invalid" : ""}`}
                    id="patientNo"
                    placeholder="Enter Customer Contact No"
                    value={formData.patientNo}
                    onChange={(e) =>
                      handleInputChange("patientNo", e.target.value)
                    }
                    required
                  />
                  {validationErrors.patientNo && (
                    <div className="invalid-feedback">
                      {validationErrors.patientNo}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Item Details */}
        <h4>3. Item Details</h4>
        <div className="col-md-5">
          {/* Item Search */}
          <div className="mb-3 mt-3">
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
                // disabled={useAppointment || selectedAppointment !== null}
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
                  ) : availableItems === null || availableItems.length === 0 ? (
                    <li className="dropdown-item">
                      <span className="me-3">
                        <i className="bi bi-emoji-frown"></i>
                      </span>
                      No items found
                    </li>
                  ) : (
                    availableItems.map((item) => (
                      <li key={item.itemMasterId}>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => handleSelectItem(item)}
                        >
                          <span className="me-3">
                            <i className="bi bi-cart4"></i>
                          </span>
                          {item?.itemCode} - {item?.itemName}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table
              className="table"
              style={{ minWidth: "1000px", overflowX: "auto" }}
            >
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Stock In Hand</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  {renderColumns()}
                  <th className="text-end">Total Price</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    {/* <td>
                      <select
                        className="form-select"
                        value={item.batchId}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "batchId",
                            e.target.value
                          )
                        }
                        disabled={item.isInventoryItem === false}
                      >
                        <option value="">Select batch</option>
                        {locationInventories
                          ?.filter((i) => i.itemMasterId === item.id)
                          ?.map((i, batchIndex) => (
                            <option
                              key={batchIndex}
                              value={i.batchId}
                              disabled={i.stockInHand === 0}
                            >
                              {i.itemBatch.batch.batchRef}
                            </option>
                          ))}
                      </select>
                    </td> */}
                    <td>
                      {item.isInventoryItem === false ? "-" : item.stockInHand}
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
                          validFields[`quantity_${index}`] ? "is-valid" : ""
                        } ${
                          validationErrors[`quantity_${index}`]
                            ? "is-invalid"
                            : ""
                        }`}
                        value={item.quantity}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        disabled={item.isInventoryItem === false}
                      />
                      {validationErrors[`quantity_${index}`] && (
                        <div className="invalid-feedback">
                          {validationErrors[`quantity_${index}`]}
                        </div>
                      )}
                    </td>
                    <td>
                      {item.unitPrice ? item.unitPrice.toFixed(2) : "0.00"}
                    </td>
                    {item.chargesAndDeductions.map((charge, chargeIndex) => (
                      <td key={chargeIndex}>
                        <input
                          className="form-control"
                          type="number"
                          value={charge.value}
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) => {
                            let newValue = parseFloat(e.target.value);

                            // If the entered value is not a valid number, set it to 0
                            if (isNaN(newValue)) {
                              newValue = 0;
                            } else {
                              // If the charge is a percentage, ensure the value is between 0 and 100
                              if (charge.isPercentage) {
                                newValue = Math.min(100, Math.max(0, newValue)); // Clamp the value between 0 and 100
                              } else {
                                // For non-percentage charges, ensure the value is positive
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
                    ))}
                    <td className="text-end">{item.totalPrice.toFixed(2)}</td>
                    <td className="text-end">
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
              <tfoot>
                <tr>
                  <td
                    colSpan={
                      5 +
                      formData.itemDetails[0].chargesAndDeductions.length -
                      (company.batchStockType === "FIFO" ? 1 : 0)
                    }
                  ></td>
                  <th>Sub Total</th>
                  <td className="text-end">{calculateSubTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td
                    colSpan={
                      5 +
                      formData.itemDetails[0].chargesAndDeductions.length -
                      (company.batchStockType === "FIFO" ? 1 : 0)
                    }
                  ></td>
                  <th>Deduction Amount</th>
                  <td className="text-end">
                    <input
                      type="number"
                      className="form-control text-end"
                      value={formData.deductionAmount}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) =>
                        handleInputChange(
                          "deductionAmount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      style={{ width: "120px", marginLeft: "auto" }}
                    />
                  </td>
                  <td></td>
                </tr>
                {renderSubColumns()}
                <tr>
                  <td
                    colSpan={
                      5 +
                      formData.itemDetails[0].chargesAndDeductions.length -
                      (company.batchStockType === "FIFO" ? 1 : 0)
                    }
                  ></td>
                  <th>Total Amount</th>
                  <td className="text-end">
                    {calculateTotalAmount().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Attachments */}
        {/* <h4>4. Attachments</h4>
        <div className="col-md-6 mb-3">
          <label htmlFor="attachment" className="form-label">
            Attachments (if any)
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
          <small className="form-text text-muted">File size limit: 10MB</small>
          {validationErrors.attachments && (
            <div className="invalid-feedback">
              {validationErrors.attachments}
            </div>
          )}
        </div> */}

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
              <ButtonLoadingSpinner text="Submitting..." />
            ) : (
              "Submit"
            )}
          </button>
          {/* <button
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
          </button> */}
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

SalesInvoice.defaultProps = {
  salesOrder: null,
};

export default SalesInvoice;

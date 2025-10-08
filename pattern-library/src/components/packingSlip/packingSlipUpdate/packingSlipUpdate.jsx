import React from "react";
import usePackingSlipUpdate from "./usePackingSlipUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import BatchSelectionModal from "../../batchSelectionModal/batchSelectionModal";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const PackingSlipUpdate = ({
  handleClose,
  packingSlip,
  handleUpdated,
  setShowUpdatePSForm,
}) => {
  const {
    formData,
    isCompanyLoading,
    submissionStatus,
    validFields,
    validationErrors,
    searchTerm,
    selectedBatch,
    itemBatches,
    customerSearchTerm,
    availableItems,
    customers,
    isError,
    isLoading,
    error,
    alertRef,
    isItemsLoading,
    isItemsError,
    itemsError,
    searchByBarcode,
    searchByBatch,
    isCustomersLoading,
    isCustomersError,
    customersError,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    chargesAndDeductionsError,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    isChargesAndDeductionsAppliedLoading,
    isChargesAndDeductionsAppliedError,
    chargesAndDeductionsAppliedError,
    chargesAndDeductions,
    transactionTypes,
    chargesAndDeductionsApplied,
    loading,
    loadingDraft,
    showModal,
    company,
    isCompanyError,
    companyError,
    itemIdsToBeDeleted,
    userLocations,
    isUserLocationsLoading,
    isUserLocationsError,
    userLocationsError,
    setCustomerSearchTerm,
    setSearchByBatch,
    setSearchByBarcode,
    closeModal,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleCustomerChange,
    setSearchTerm,
    handleSelectCustomer,
    handleResetCustomer,
    handleBatchSelection,
    handleSelectItem,
    renderColumns,
    renderSubColumns,
    calculateSubTotal,
  } = usePackingSlipUpdate({
    packingSlip,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  console.log("Form Data", formData);
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-end">
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Packing Slip</h1>
        <hr />
      </div>

      {/*Displat success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Packing Slip submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Packing Slip updated and saved as draft, you can edit and submit it
          later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting packing slip. Please try again.
        </div>
      )}

      {/* Form */}
      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/*Packing Slip Information */}
            <h4>1. Packing Slip Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="packingSlipDate" className="form-label">
                Packing Slip Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.packingSlipDate ? "is-valid" : ""
                } ${validationErrors.packingSlipDate ? "is-invalid" : ""}`}
                id="packingSlipDate"
                placeholder="Enter Slip Create Date"
                value={formData?.packingSlipDate || ""}
                onChange={(e) =>
                  handleInputChange("packingSlipDate", e.target.value)
                }
                required
              />
              {validationErrors.packingSlipDate && (
                <div className="invalid-feedback">
                  {validationErrors.packingSlipDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="invoiceReferenceNumber" className="form-label">
                Invoice Reference Number
              </label>
              <input
                type="text"
                className={`form-control ${
                  validFields.invoiceReferenceNumber ? "is-valid" : ""
                } ${
                  validationErrors.invoiceReferenceNumber ? "is-invalid" : ""
                }`}
                id="invoiceReferenceNumber"
                placeholder="Enter invoice reference number"
                value={formData.invoiceReferenceNumber}
                onChange={(e) =>
                  handleInputChange("invoiceReferenceNumber", e.target.value)
                }
                required
              />
              {validationErrors.invoiceReferenceNumber && (
                <div className="invalid-feedback">
                  {validationErrors.invoiceReferenceNumber}
                </div>
              )}
            </div>
            {/* <div className="mb-3">
              <label htmlFor="storeLocation" className="form-label">
                Store Location
              </label>
              <select
                className={`form-select ${
                  validFields.storeLocation ? 'is-valid' : ''
                } ${validationErrors.storeLocation ? 'is-invalid' : ''}`}
                id="storeLocation"
                value={formData?.storeLocation ?? ''}
                onChange={(e) =>
                  handleInputChange('storeLocation', e.target.value)
                }
              >
                <option value="">Select Location</option>
                {userLocations && userLocations != null
                  ? userLocations
                      .filter(
                        (location) =>
                          location.location.locationType.name === 'Warehouse'
                      )
                      .map((location) => (
                        <option
                          key={location.location.locationId}
                          value={location.location.locationId}
                        >
                          {location.location.locationName}
                        </option>
                      ))
                  : ''}
              </select>
              {validationErrors.storeLocation && (
                <div className="invalid-feedback">
                  {validationErrors.storeLocation}
                </div>
              )}
            </div> */}
          </div>

          <div className="col-md-5">
            <h4>2. Customer</h4>
            <div className="mb-1 mt-3">
              <label htmlFor="customerId" className="form-label">
                Customer
              </label>
              {formData.selectedCustomer === "" && (
                <div className="mb-3 position-relative">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent ">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${
                        validFields.customerId ? "is-valid" : ""
                      } ${validationErrors.customerId ? "is-invalid" : ""}`}
                      placeholder="Search for a customer..."
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      autoFocus={false}
                    />
                    {customerSearchTerm && (
                      <span
                        className="input-group-text bg-transparent"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setCustomerSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </span>
                    )}
                  </div>

                  {/* Dropdown for filtered customers */}
                  {customerSearchTerm && (
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
                        {customers
                          .filter(
                            (customer) =>
                              customer.customerName
                                .toLowerCase()
                                .includes(customerSearchTerm.toLowerCase()) ||
                              customer.phone
                                .replace(/\s/g, "")
                                .includes(customerSearchTerm.replace(/\s/g, ""))
                          )
                          .map((customer) => (
                            <li key={customer.customerId}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleSelectCustomer(customer)}
                              >
                                <span className="me-3">
                                  <i className="bi-person-lines-fill"></i>
                                </span>{" "}
                                {customer?.customerName} - {customer?.phone}
                              </button>
                            </li>
                          ))}
                        {customers.filter(
                          (customer) =>
                            customer.customerName
                              .toLowerCase()
                              .includes(customerSearchTerm.toLowerCase()) ||
                            customer.phone
                              .replace(/\s/g, "")
                              .includes(customerSearchTerm.replace(/\s/g, ""))
                        ).length === 0 && (
                          <>
                            <li className="dropdown-item text-center">
                              <span className="me-3">
                                <i className="bi bi-emoji-frown"></i>
                              </span>
                              No customers found
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                  {formData.selectedCustomer === "" && (
                    <div className="mb-3">
                      <small className="form-text text-muted">
                        {validationErrors.customerId && (
                          <div className="text-danger mb-1">
                            {validationErrors.customerId}
                          </div>
                        )}
                        Please search for a customer and select it
                      </small>
                    </div>
                  )}
                </div>
              )}
              {/* Additional Customer Information */}
              {formData.selectedCustomer && (
                <div className="card mb-3">
                  <div className="card-header">Selected Customer</div>
                  <div className="card-body">
                    <p>
                      Customer Name: {formData.selectedCustomer.customerName}
                    </p>
                    <p>
                      Contact Person: {formData.selectedCustomer.contactPerson}
                    </p>
                    <p>Phone: {formData.selectedCustomer.phone}</p>
                    <p>Email: {formData.selectedCustomer.email}</p>
                    <button
                      type="button"
                      className="btn btn-outline-danger float-end"
                      onClick={handleResetCustomer}
                    >
                      Reset Customer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <h4>3. Item Details</h4>

        <div className="mb-3 mt-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="searchByBatch"
            checked={searchByBatch}
            onChange={() => {
              setSearchByBatch(!searchByBatch);
              setSearchByBarcode(false);
            }}
          />
          <label className="form-check-label" htmlFor="searchByPOCheckbox">
            Search By Item Batch
          </label>
        </div>

        <div className="mb-3 mt-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="searchByBarcode"
            checked={searchByBarcode}
            onChange={() => {
              setSearchByBarcode(!searchByBarcode);
              setSearchByBatch(false);
            }}
          />
          <label className="form-check-label" htmlFor="searchByPRCheckbox">
            Search By Item Barcode
          </label>
        </div>

        {searchByBatch && (
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
                      availableItems.length === 0 ||
                      availableItems.filter((item) => {
                        // If batchStockType is FIFO, filter out items already present in formData.itemDetails
                        if (company.batchStockType === "FIFO") {
                          return !formData.itemDetails.some(
                            (detail) =>
                              detail.itemMasterId === item.itemMasterId
                          );
                        }
                        // Otherwise, include all items
                        return true;
                      }).length === 0 ? (
                      <li className="dropdown-item">
                        <span className="me-3">
                          <i className="bi bi-emoji-frown"></i>
                        </span>
                        No items found
                      </li>
                    ) : (
                      availableItems
                        .filter((item) => {
                          // If batchStockType is FIFO, filter out items already present in formData.itemDetails
                          if (company.batchStockType === "FIFO") {
                            return !formData.itemDetails.some(
                              (detail) =>
                                detail.itemMasterId === item.itemMasterId
                            );
                          }
                          // Otherwise, include all items
                          return true;
                        })
                        .map((item) => (
                          <li key={item.itemMasterId}>
                            <button
                              className="dropdown-item"
                              onClick={() => handleSelectItem(item)}
                            >
                              <span className="me-3">
                                <i className="bi bi-cart4"></i>
                              </span>
                              {item.itemCode} - {item.itemName}
                            </button>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              )}

              {formData.itemMasterId === 0 && (
                <div className="mb-3">
                  <small className="form-text text-muted">
                    Please search for an item to add
                  </small>
                </div>
              )}
              {formData.itemMasterId !== 0 && (
                <div className="mb-3">
                  <p className="form-text text-muted">
                    Selected item: {formData.itemMaster.itemName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!itemBatches && formData.itemMasterId !== 0 && (
          <div className="mb-3">
            <small className="form-text  text-danger">
              Selected item does not have any associated item batches. Please
              select another item
            </small>
          </div>
        )}
        {formData.itemDetails.length > 0 && searchByBatch && (
          <div className="table-responsive mb-2">
            <table
              className="table"
              style={{ minWidth: "1000px", overflowX: "auto" }}
            >
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  {company.batchStockType !== "FIFO" && <th>Batch Ref</th>}
                  <th>Temp Qty</th>
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
                    {company.batchStockType !== "FIFO" && (
                      <td>{item.batchRef}</td>
                    )}
                    <td>{item.tempQuantity}</td>
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
                      {item.unitPrice ? item.unitPrice.toFixed(2) : "0.00"}
                    </td>
                    {item.chargesAndDeductions.map((charge, chargeIndex) => (
                      <td key={chargeIndex}>
                        <input
                          className="form-control"
                          type="number"
                          value={charge.value}
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

        {/*Search items by barcode */}
        {searchByBarcode && (
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
              {formData.itemMasterId === 0 && (
                <div className="mb-3">
                  <small className="form-text text-muted">
                    Please search for an item to add
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
        {/*end */}

        {/* Attachments */}
        <h4>4. Attachments</h4>
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
        </div>

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
      {itemBatches && (
        <BatchSelectionModal
          show={showModal}
          handleClose={closeModal}
          itemBatches={itemBatches}
          itemDetails={formData.itemDetails}
          handleBatchSelect={handleBatchSelection}
        />
      )}
    </div>
  );
};

export default PackingSlipUpdate;

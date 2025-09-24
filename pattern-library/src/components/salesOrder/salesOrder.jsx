import React from "react";
import useSalesOrder from "./useSalesOrder";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import Customer from "../customer/customer";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import BatchSelectionModal from "../batchSelectionModal/batchSelectionModal";

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
    //locationInventory,
  } = useSalesOrder({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

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
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <i
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
            onClick={handleClose}
          />
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Sales Order</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales order submitted successfully! Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales order saved as draft, you can edit and submit it later!
          Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting sales order. Please try again.
        </div>
      )}

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. Order Type and Customer Details</h4>
            {/* Order Type */}
            <div className="mb-3 mt-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="directOrderCheckbox"
                checked={directOrder}
                onChange={() => setDirectOrder(!directOrder)}
              />
              <label className="form-check-label" htmlFor="directOrderCheckbox">
                Direct Order (No Customer Selection)
              </label>
            </div>

            {/* Customer Information */}
            {!directOrder && (
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
                          validFields.supplierId ? "is-valid" : ""
                        } ${validationErrors.supplierId ? "is-invalid" : ""}`}
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
                                  .includes(
                                    customerSearchTerm.replace(/\s/g, "")
                                  )
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
                              <li className="dropdown-item disabled text-center">
                                If the customer is not found, you can add a new
                                one.
                              </li>
                              <div className="d-flex justify-content-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary mx-3 mt-2 mb-2 "
                                  onClick={handleShowCreateCustomerModal}
                                >
                                  Add New Customer
                                </button>
                              </div>
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
                        Contact Person:{" "}
                        {formData.selectedCustomer.contactPerson}
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
            )}

            {/* Sales Person Information */}
            <label htmlFor="salesPersonId" className="form-label mt-3">
              Sales Person
            </label>
            {formData.selectedSalesPerson === "" && (
              <div className="mb-3 position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.salesPersonId ? "is-valid" : ""
                    } ${validationErrors.salesPersonId ? "is-invalid" : ""}`}
                    placeholder="Search for a sales person..."
                    value={salesPersonSearchTerm}
                    onChange={(e) => setSalesPersonSearchTerm(e.target.value)}
                  />
                  {salesPersonSearchTerm && (
                    <span
                      className="input-group-text bg-transparent"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => setSalesPersonSearchTerm("")}
                    >
                      <i className="bi bi-x"></i>
                    </span>
                  )}
                </div>

                {/* Dropdown for filtered sales persons */}
                {salesPersonSearchTerm && (
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
                      {salesPersons
                        .filter(
                          (salesPerson) =>
                            salesPerson.firstname
                              .toLowerCase()
                              .includes(salesPersonSearchTerm.toLowerCase()) ||
                            salesPerson.contactNo
                              .replace(/\s/g, "")
                              .includes(
                                salesPersonSearchTerm.replace(/\s/g, "")
                              )
                        )
                        .map((salesPerson) => (
                          <li key={salesPerson.salesPersonId}>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleSelectSalesPerson(salesPerson)
                              }
                            >
                              <span className="me-3">
                                <i className="bi-person-lines-fill"></i>
                              </span>{" "}
                              {salesPerson?.firstname} -{" "}
                              {salesPerson?.contactNo}
                            </button>
                          </li>
                        ))}
                      {salesPersons.filter(
                        (salesPerson) =>
                          salesPerson.firstname
                            .toLowerCase()
                            .includes(salesPersonSearchTerm.toLowerCase()) ||
                          salesPerson.contactNo
                            .replace(/\s/g, "")
                            .includes(salesPersonSearchTerm.replace(/\s/g, ""))
                      ).length === 0 && (
                        <li className="dropdown-item text-center">
                          <span className="me-3">
                            <i className="bi bi-emoji-frown"></i>
                          </span>
                          No sales person found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Sales Person Details */}
            {formData.selectedSalesPerson && (
              <div className="card mb-3">
                <div className="card-header">Selected Sales Person</div>
                <div className="card-body">
                  <p>
                    Sales Person Name: {formData.selectedSalesPerson.firstname}
                  </p>
                  <p>Contact No: {formData.selectedSalesPerson.contactNo}</p>
                  <p>Email: {formData.selectedSalesPerson.email}</p>
                  <button
                    type="button"
                    className="btn btn-outline-danger float-end"
                    onClick={handleResetSalesPerson}
                  >
                    Reset Sales Person
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-5">
            {/* Order Information */}
            <h4>2. Order Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="orderDate" className="form-label">
                Order Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.orderDate ? "is-valid" : ""
                } ${validationErrors.orderDate ? "is-invalid" : ""}`}
                id="orderDate"
                placeholder="Enter order date"
                value={formData.orderDate}
                onChange={(e) => handleInputChange("orderDate", e.target.value)}
                required
              />
              {validationErrors.orderDate && (
                <div className="invalid-feedback">
                  {validationErrors.orderDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="deliveryDate" className="form-label">
                Delivery Date
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
                  {validationErrors.deliveryDate}
                </div>
              )}
            </div>
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
                          (detail) => detail.itemMasterId === item.itemMasterId
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

            {/* {!locationInventory && formData.itemMasterId !== 0 && (
              <div className="mb-3">
                <small className="form-text text-danger">
                  Selected item does not have sufficient stock. Please select
                  another item
                </small>
              </div>
            )} */}
            {formData.itemMasterId !== 0 && (
              <div className="mb-3">
                {/* <p className="form-text text-muted">
                  Selected item: {formData.itemMaster.itemName}
                </p> */}
              </div>
            )}
          </div>
        </div>

        {/* <div className="col-md-5">
          <div className="mb-3">
            <label htmlFor="batchSelection">Select Batch</label>
            <select
              id="batchSelection"
              className="form-select mt-2"
              onChange={handleBatchSelection}
              value={selectedBatch?.BatchId}
              disabled={!itemBatches}
            >
              <option value="">Select Batch</option>
              {isLoading ? (
                <option disabled>Loading...</option>
              ) : isError ? (
                <option disabled>Error fetching batches</option>
              ) : (
                itemBatches
                  ?.filter(
                    (batch) =>
                      !formData.itemDetails.some(
                        (detail) => detail.itemBatchId === batch.batchId
                      )
                  ) // Filter out item batches that are already in itemDetails
                  .map((batch) => (
                    <option key={batch.batchId} value={batch.batchId}>
                      {batch.batch.batchRef}
                    </option>
                  ))
              )}
            </select>
          </div>
        </div> */}

        {/* {!itemBatches && formData.itemMasterId !== 0 && (
          <div className="mb-3">
            <small className="form-text  text-danger">
              Selected item does not have any associated item batches. Please
              select another item
            </small>
          </div>
        )} */}
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
                  {company.batchStockType !== "FIFO" && <th>Batch Ref</th>}
                  <th>Total Stock In Hand</th>
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
                    <td>{item.unitPrice.toFixed(2)}</td>
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
      {showCreateCustomerMoalInParent && (
        <Customer
          show={showCreateCustomerModal}
          handleClose={handleCloseCreateCustomerModal}
          handleAddCustomer={handleAddCustomer}
        />
      )}
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

export default SalesOrder;

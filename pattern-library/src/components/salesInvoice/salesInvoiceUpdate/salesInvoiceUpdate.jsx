import React from "react";
import useSalesInvoiceUpdate from "./useSalesInvoiceUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";
import Customer from "../../customer/customer";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

const SalesInvoiceUpdate = ({ handleClose, salesInvoice, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    alertRef,
    selectedSalesOrder,
    salesOrderOptions,
    salesOrder,
    searchTerm,
    isItemsLoading,
    isItemsError,
    itemsError,
    availableItems,
    selectedBatch,
    itemBatches,
    isLoading,
    isError,
    isLoadingTransactionTypes,
    isLoadingchargesAndDeductions,
    isTransactionTypesError,
    ischargesAndDeductionsError,
    transactionTypesError,
    loading,
    loadingDraft,
    setSearchTerm,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleAttachmentChange,
    calculateTotalAmount,
    handleSelectItem,
    handleBatchSelection,
    renderColumns,
    renderSubColumns,
    calculateSubTotal,
    handleSubmit,
  } = useSalesInvoiceUpdate({
    salesInvoice,
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });
  const companyLogoUrl = useCompanyLogoUrl();

  if (isLoadingchargesAndDeductions || isLoadingTransactionTypes) {
    return <LoadingSpinner />;
  }

  if (ischargesAndDeductionsError || isTransactionTypesError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <img src={companyLogoUrl} alt="Company Logo" height={30} />
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
          Sales invoice submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Sales invoice updated and saved as draft, you can edit and submit it
          later!
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
                required
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
                  Selected item: {formData?.itemMaster?.itemName}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-5">
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
        </div>

        {!itemBatches && formData.itemMasterId !== 0 && (
          <div className="mb-3">
            <small className="form-text  text-danger">
              Selected item does not have any associated item batches. Please
              select another item
            </small>
          </div>
        )}

        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Batch Ref</th>
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
                    <td>{item.batchRef}</td>
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
                          value={charge?.value}
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
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleRemoveItem(
                            index,
                            item,
                            item?.chargesAndDeductions
                          )
                        }
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
                      5 + formData.itemDetails[0].chargesAndDeductions.length
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
                      5 + formData.itemDetails[0].chargesAndDeductions.length
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
              <ButtonLoadingSpinner text="Updating..." />
            ) : (
              "Update and Submit"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleSubmit(true)}
            disabled={loading || loadingDraft || submissionStatus !== null}
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

export default SalesInvoiceUpdate;

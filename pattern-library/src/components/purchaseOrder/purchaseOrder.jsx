import React from "react";
import usePurchaseOrder from "./usePurchaseOrder";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import Supplier from "../supplier/supplier";

const PurchaseOrder = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    suppliers,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    isLoading,
    isError,
    error,
    supplierSearchTerm,
    showCreateSupplierMoalInParent,
    showCreateSupplierModal,
    chargesAndDeductions,
    isLoadingchargesAndDeductions,
    ischargesAndDeductionsError,
    isLoadingTransactionTypes,
    isTransactionTypesError,
    transactionTypesError,
    loading,
    loadingDraft,
    handleInputChange,
    handleSupplierChange,
    handleItemDetailsChange,
    handleAttachmentChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint,
    calculateSubTotal,
    setSearchTerm,
    handleSelectItem,
    handleSelectSupplier,
    setSupplierSearchTerm,
    handleResetSupplier,
    handleCloseCreateSupplierModal,
    handleAddSupplier,
    handleShowCreateSupplierModal,
    renderColumns,
    renderSubColumns,
    calculateTotalAmount,
  } = usePurchaseOrder({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

  if (isLoading || isLoadingchargesAndDeductions || isLoadingTransactionTypes) {
    return <LoadingSpinner />;
  }

  if (isError || ischargesAndDeductionsError || transactionTypesError) {
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
        <h1 className="mt-2 text-center">Purchase Order</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase order submitted successfully! Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase order saved as draft, you can edit and submit it later!
          Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting purchase order. Please try again.
        </div>
      )}

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Supplier Information */}
            <h4>1. Supplier Information</h4>
            <div className="mb-1 mt-3">
              <label htmlFor="supplierId" className="form-label">
                Supplier
              </label>
              {formData.selectedSupplier === "" && (
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
                      placeholder="Search for a supplier..."
                      value={supplierSearchTerm}
                      onChange={(e) => setSupplierSearchTerm(e.target.value)}
                      autoFocus={false}
                    />
                    {supplierSearchTerm && (
                      <span
                        className="input-group-text bg-transparent"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setSupplierSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </span>
                    )}
                  </div>

                  {/* Dropdown for filtered suppliers */}
                  {supplierSearchTerm && (
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
                        {suppliers
                          .filter(
                            (supplier) =>
                              supplier.supplierName
                                .toLowerCase()
                                .includes(supplierSearchTerm.toLowerCase()) ||
                              supplier.phone
                                .replace(/\s/g, "")
                                .includes(supplierSearchTerm.replace(/\s/g, ""))
                          )
                          .map((supplier) => (
                            <li key={supplier.supplierId}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleSelectSupplier(supplier)}
                              >
                                <span className="me-3">
                                  <i className="bi bi-shop"></i>
                                </span>{" "}
                                {supplier?.supplierName} - {supplier?.phone}
                              </button>
                            </li>
                          ))}
                        {suppliers.filter(
                          (supplier) =>
                            supplier.supplierName
                              .toLowerCase()
                              .includes(supplierSearchTerm.toLowerCase()) ||
                            supplier.phone
                              .replace(/\s/g, "")
                              .includes(supplierSearchTerm.replace(/\s/g, ""))
                        ).length === 0 && (
                          <>
                            <li className="dropdown-item text-center">
                              <span className="me-3">
                                <i className="bi bi-emoji-frown"></i>
                              </span>
                              No suppliers found
                            </li>
                            <li className="dropdown-item disabled text-center">
                              If the supplier is not found, you can add a new
                              one.
                            </li>
                            <div className="d-flex justify-content-center">
                              <button
                                type="button"
                                className="btn btn-outline-primary mx-3 mt-2 mb-2 "
                                onClick={handleShowCreateSupplierModal}
                              >
                                Add New Supplier
                              </button>
                            </div>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                  {formData.selectedSupplier === "" && (
                    <div className="mb-3">
                      <small className="form-text text-muted">
                        {validationErrors.supplierId && (
                          <div className="text-danger mb-1">
                            {validationErrors.supplierId}
                          </div>
                        )}
                        Please search for a supplier and select it
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Supplier Information */}
            {formData.selectedSupplier && (
              <div className="card mb-3">
                <div className="card-header">Selected Supplier</div>
                <div className="card-body">
                  <p>Supplier Name: {formData.selectedSupplier.supplierName}</p>
                  <p>
                    Contact Person: {formData.selectedSupplier.contactPerson}
                  </p>
                  <p>Phone: {formData.selectedSupplier.phone}</p>
                  <p>Email: {formData.selectedSupplier.email}</p>
                  <button
                    type="button"
                    className="btn btn-outline-danger float-end"
                    onClick={handleResetSupplier}
                  >
                    Reset Supplier
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
                disabled
                required
              />
              {validationErrors.orderDate && (
                <div className="invalid-feedback">
                  {validationErrors.orderDate}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Item Details */}
            <h4>3. Item Details</h4>
            {/* Item Search */}
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
                              {item.itemName}
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
          </div>
        </div>

        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table
              className="table mt-0"
              style={{ minWidth: "1000px", overflowX: "auto" }}
            >
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
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
                      4 +
                      formData.itemDetails[0].chargesAndDeductions.length -
                      1
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
                      4 +
                      formData.itemDetails[0].chargesAndDeductions.length -
                      1
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
      {showCreateSupplierMoalInParent && (
        <Supplier
          show={showCreateSupplierModal}
          handleClose={handleCloseCreateSupplierModal}
          handleAddSupplier={handleAddSupplier}
        />
      )}
    </div>
  );
};

export default PurchaseOrder;

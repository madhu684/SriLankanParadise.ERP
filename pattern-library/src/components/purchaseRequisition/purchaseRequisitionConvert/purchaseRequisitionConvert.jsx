import React from "react";
import usePurchaseRequisitionConvert from "./usePurchaseRequisitionConvert";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import Supplier from "../../supplier/supplier";

const PurchaseRequisitionConvert = ({
  handleClose,
  purchaseRequisition,
  handleConverted,
}) => {
  const {
    formData,
    suppliers,
    submissionStatus,
    validFields,
    validationErrors,
    referenceNo,
    alertRef,
    isLoading,
    isError,
    error,
    supplierSearchTerm,
    showCreateSupplierMoalInParent,
    showCreateSupplierModal,
    handleInputChange,
    handleSupplierChange,
    handleAttachmentChange,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
    setSupplierSearchTerm,
    handleSelectSupplier,
    handleResetSupplier,
    handleShowCreateSupplierModal,
    handleCloseCreateSupplierModal,
    handleAddSupplier,
  } = usePurchaseRequisitionConvert({
    purchaseRequisition,
    onFormSubmit: () => {
      handleClose();
      handleConverted();
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
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between">
          <img src={companyLogoUrl} alt="Company Logo" height={30} />
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Convert Purchase Requisition</h1>
        <hr />
      </div>

      {/* Display success or error messages */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase requisition converted successfully! Reference Number:{" "}
          {referenceNo}
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Purchase requisition converted and saved as draft, you can edit and
          submit it later! Reference Number: {referenceNo}
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error converting purchase requisition. Please try again.
        </div>
      )}

      <form>
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            {/* Supplier Information */}
            <h4>1. Supplier Information</h4>
            <div className="mt-3">
              <label htmlFor="supplierId" className="form-label">
                Supplier Name
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
                required
                disabled
              />
              {validationErrors.orderDate && (
                <div className="invalid-feedback">
                  {validationErrors.orderDate}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <h4>3. Item Details</h4>
        {formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th className="text-end">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemMaster?.itemName}</td>
                    <td>{item.itemMaster?.unit.unitName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toFixed(2)}</td>
                    <td className="text-end">{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"></td>
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
          >
            Convert
          </button>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleSubmit(true)}
          >
            Save as Draft
          </button>
          {/* <button type="button" className="btn btn-info me-2">
              View History
            </button> */}
          <button
            type="button"
            className="btn btn-success me-2"
            onClick={handlePrint}
          >
            Print
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
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

export default PurchaseRequisitionConvert;

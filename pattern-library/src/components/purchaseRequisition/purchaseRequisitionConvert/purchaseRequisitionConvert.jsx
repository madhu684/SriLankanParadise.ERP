import React from "react";
import usePurchaseRequisitionConvert from "./usePurchaseRequisitionConvert";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";

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
    handleInputChange,
    handleSupplierChange,
    handleAttachmentChange,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
  } = usePurchaseRequisitionConvert({
    purchaseRequisition,
    onFormSubmit: () => {
      handleClose();
      handleConverted();
    },
  });

  const companyLogoUrl = useCompanyLogoUrl();

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
            <div className="mb-3 mt-3">
              <label htmlFor="supplierId" className="form-label">
                Supplier Name
              </label>
              <select
                className={`form-select ${
                  validFields.supplierId ? "is-valid" : ""
                } ${validationErrors.supplierId ? "is-invalid" : ""}`}
                id="supplierId"
                onChange={(e) => handleSupplierChange(e.target.value)}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
              {validationErrors.supplierId && (
                <div className="invalid-feedback">
                  {validationErrors.supplierId}
                </div>
              )}
            </div>

            {/* Additional Supplier Information */}
            {formData.selectedSupplier && (
              <div className="mb-3">
                <p>Contact Person: {formData.selectedSupplier.contactPerson}</p>
                <p>Phone: {formData.selectedSupplier.phone}</p>
                <p>Email: {formData.selectedSupplier.email}</p>
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
    </div>
  );
};

export default PurchaseRequisitionConvert;

import React from "react";
import useGrnUpdate from "./useGrnUpdate";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../../companyLogo/useCompanyLogoUrl";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const GrnUpdate = ({ handleClose, grn, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    purchaseOrders,
    statusOptions,
    alertRef,
    isLoading,
    isError,
    loading,
    loadingDraft,
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handlePrint,
    handleStatusChange,
  } = useGrnUpdate({
    grn,
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

  return (
    <div className="container mt-4">
      {/* Header */}
      <div ref={alertRef}></div>
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <img src={companyLogoUrl} alt="Company Logo" height={30} />
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Goods Received Note</h1>
        <hr />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          GRN submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          GRN updated and saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting GRN. Please try again.
        </div>
      )}

      <form>
        {/* GRN Information */}
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. GRN Information</h4>
            <div className="mb-3 mt-3">
              <label htmlFor="grnDate" className="form-label">
                GRN Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.grnDate ? "is-valid" : ""
                } ${validationErrors.grnDate ? "is-invalid" : ""}`}
                id="grnDate"
                placeholder="Enter GRN date"
                value={formData.grnDate}
                onChange={(e) => handleInputChange("grnDate", e.target.value)}
                required
              />
              {validationErrors.grnDate && (
                <div className="invalid-feedback">
                  {validationErrors.grnDate}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="receivedBy" className="form-label">
                Received By
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
            <div className="mb-3">
              <label htmlFor="receivedDate" className="form-label">
                Received Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  validFields.receivedDate ? "is-valid" : ""
                } ${validationErrors.receivedDate ? "is-invalid" : ""}`}
                id="receivedDate"
                placeholder="Enter received date"
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
            {/* Status Dropdown */}
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`form-select ${
                  validFields.status ? "is-valid" : ""
                } ${validationErrors.status ? "is-invalid" : ""}`}
                value={formData.status}
                onChange={(e) =>
                  handleStatusChange(
                    statusOptions.find((option) => option.id === e.target.value)
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
          </div>

          {/* Purchase Order ID Selection */}
          <div className="col-md-5">
            <h4>2. Purchase Order Details</h4>
            <div className="mt-3">
              <label htmlFor="purchaseOrder" className="form-label">
                Purchase Order
              </label>
            </div>

            {/* Additional Purchase Order Information */}
            {selectedPurchaseOrder && (
              <div className="card mb-3">
                <div className="card-header">Selected Purchase Order</div>
                <div className="card-body">
                  <p>
                    Purchase Order Reference No:{" "}
                    {selectedPurchaseOrder?.referenceNo}
                  </p>
                  <p>
                    Supplier: {selectedPurchaseOrder?.supplier?.supplierName}
                  </p>
                  <p>
                    Order Date:{" "}
                    {selectedPurchaseOrder?.orderDate?.split("T")[0] ?? ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Item Details */}
        <h4>3. Item Details</h4>
        {formData.itemDetails.length > 0 && formData.itemDetails.length > 0 && (
          <div className="table-responsive mb-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Ordered Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Received Quantity</th>
                  <th>Rejected Quantity</th>
                  <th>Free Quantity</th>
                  <th>Expiry Date</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.quantity}</td>
                    <td>{item.remainingQuantity}</td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
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
                        className={`form-control ${
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
                        className="form-control"
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
                        className={`form-control ${
                          validFields[`expiryDate_${index}`] ? "is-valid" : ""
                        } ${
                          validationErrors[`expiryDate_${index}`]
                            ? "is-invalid"
                            : ""
                        }`}
                        value={item.expiryDate}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "expiryDate",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`expiryDate_${index}`] && (
                        <div className="invalid-feedback">
                          {validationErrors[`expiryDate_${index}`]}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
    </div>
  );
};

export default GrnUpdate;

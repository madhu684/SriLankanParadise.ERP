import React from "react";
import useTin from "./useTin";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import useCompanyLogoUrl from "../companyLogo/useCompanyLogoUrl";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";

const Tin = ({ handleClose, handleUpdated }) => {
  const {
    formData,
    submissionStatus,
    validFields,
    validationErrors,
    selectedTrn,
    trns,
    statusOptions,
    alertRef,
    isLoading,
    isError,
    trnSearchTerm,
    loading,
    loadingDraft,
    itemBatches,
    isItemBatchesLoading,
    isItemBatchesError,
    isLocationInventoriesLoading,
    isLocationInventoriesError,
    locationInventories,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handleSubmit,
    handlePrint,
    calculateTotalAmount,
    handleTrnChange,
    handleStatusChange,
    setTrnSearchTerm,
    handleResetTrn,
  } = useTin({
    onFormSubmit: () => {
      handleClose();
      handleUpdated();
    },
  });
  const companyLogoUrl = useCompanyLogoUrl();

  if (isLoading || isItemBatchesLoading) {
    return <LoadingSpinner />;
  }

  if (isError || isItemBatchesError) {
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
        <h1 className="mt-2 text-center">Transfer Issue Note</h1>
        <hr />
      </div>

      {/* Display success or error message */}
      {submissionStatus === "successSubmitted" && (
        <div className="alert alert-success mb-3" role="alert">
          Transfer issue note submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div className="alert alert-success mb-3" role="alert">
          Transfer issue note saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger mb-3" role="alert">
          Error submitting transfer issue note. Please try again.
        </div>
      )}

      <form>
        {/* Tin Information */}
        <div className="row mb-3 d-flex justify-content-between">
          <div className="col-md-5">
            <h4>1. TIN Information</h4>
            {/* Status Dropdown */}
            <div className="mb-3 mt-3">
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

          {/* Material Requisition Selection */}
          <div className="col-md-5">
            <h4>2. Transfer Requisition Details</h4>
            <div className="mt-3">
              <label htmlFor="transferRequisition" className="form-label">
                Transfer Requisition
              </label>
              {selectedTrn === null && (
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent ">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${
                        validFields.trnId ? "is-valid" : ""
                      } ${validationErrors.trnId ? "is-invalid" : ""}`}
                      placeholder="Search for a transfer requisition..."
                      value={trnSearchTerm}
                      onChange={(e) => setTrnSearchTerm(e.target.value)}
                      autoFocus={false}
                    />
                    {trnSearchTerm && (
                      <span
                        className="input-group-text bg-transparent"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setTrnSearchTerm("")}
                      >
                        <i className="bi bi-x"></i>
                      </span>
                    )}
                  </div>

                  {/* Dropdown for filtered suppliers */}
                  {trnSearchTerm && (
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
                        {trns
                          .filter((trn) =>
                            trn.referenceNumber
                              ?.replace(/\s/g, "")
                              ?.toLowerCase()
                              .includes(
                                trnSearchTerm.toLowerCase().replace(/\s/g, "")
                              )
                          )
                          .map((trn) => (
                            <li key={trn.requisitionMasterId}>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  handleTrnChange(trn.referenceNumber)
                                }
                              >
                                <span className="me-3">
                                  <i className="bi bi-file-earmark-text"></i>
                                </span>{" "}
                                {trn?.referenceNumber}
                              </button>
                            </li>
                          ))}
                        {trns.filter((trn) =>
                          trn.referenceNumber
                            ?.replace(/\s/g, "")
                            ?.toLowerCase()
                            .includes(
                              trnSearchTerm.toLowerCase().replace(/\s/g, "")
                            )
                        ).length === 0 && (
                          <li className="dropdown-item text-center">
                            <span className="me-3">
                              <i className="bi bi-emoji-frown"></i>
                            </span>
                            No transfer requisitions found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  {selectedTrn === null && (
                    <div className="mb-3">
                      <small className="form-text text-muted">
                        {validationErrors.trnId && (
                          <div className="text-danger mb-1">
                            {validationErrors.trnId}
                          </div>
                        )}
                        Please search for a transfer requisition and select it
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Purchase Order Information */}
            {selectedTrn && (
              <div className="card mb-3">
                <div className="card-header">Selected Transfer Requisition</div>
                <div className="card-body">
                  <p>
                    Transfer Requisition Reference No:{" "}
                    {selectedTrn?.referenceNumber}
                  </p>
                  <p>Requested By: {selectedTrn?.requestedBy}</p>
                  <p>
                    Trn Date:{" "}
                    {moment
                      .utc(selectedTrn?.requisitionDate)
                      .tz("Asia/Colombo")
                      .format("YYYY-MM-DD hh:mm:ss A")}
                  </p>
                  <p>
                    To Warehouse Location:{" "}
                    {selectedTrn?.requestedToLocation.locationName}
                  </p>
                  <p>
                    From Warehouse Location:{" "}
                    {selectedTrn?.requestedFromLocation.locationName}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-danger float-end"
                    onClick={handleResetTrn}
                  >
                    Reset Transfer Requisition
                  </button>
                </div>
              </div>
            )}
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
                  <th>Requested Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Item Batch</th>
                  <th>Dispatched Quantity</th>
                  <th>Action</th>
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
                      >
                        <option value="">Select item batch</option>
                        {locationInventories
                          ?.filter((batch) => batch.itemMasterId === item.id)
                          ?.map((batch, batchIndex) => (
                            <option
                              key={batchIndex}
                              value={batch.batchId}
                              disabled={batch.stockInHand === 0}
                            >
                              {batch.itemBatch.batch.batchRef} - Stock in hand{" "}
                              {batch.stockInHand}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`form-control ${
                          validFields[`issuedQuantity_${index}`]
                            ? "is-valid"
                            : ""
                        } ${
                          validationErrors[`issuedQuantity_${index}`]
                            ? "is-invalid"
                            : ""
                        }`}
                        value={item.issuedQuantity}
                        onChange={(e) =>
                          handleItemDetailsChange(
                            index,
                            "issuedQuantity",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`issuedQuantity_${index}`] && (
                        <div className="invalid-feedback">
                          {validationErrors[`issuedQuantity_${index}`]}
                        </div>
                      )}
                    </td>
                    <td>
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
            </table>
          </div>
        )}

        {selectedTrn === null && (
          <div className="mb-3">
            <small className="form-text text-muted">
              Please select a transfer requisition to add item details.
            </small>
          </div>
        )}

        {selectedTrn !== null && formData.itemDetails.length === 0 && (
          <div className="mb-3">
            <small className="form-text  text-danger">
              Selected transfer requisition has no remaining items to issue.
            </small>
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
              <ButtonLoadingSpinner text="Submitting..." />
            ) : (
              "Submit"
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

export default Tin;

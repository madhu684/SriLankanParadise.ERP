import moment from "moment";
import "moment-timezone";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import ErrorComponent from "../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";
import useTin from "./useTin";

const Tin = ({ handleClose, handleUpdated, setShowCreateTinForm }) => {
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
    calculateTotalAmount,
    isTrnsLoading,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handleSubmit,
    handlePrint,
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

  const { user } = useContext(UserContext);

  if (isLoading || isItemBatchesLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorComponent error={"Error fetching data"} />;
  }

  return (
    <div className="container-fluid py-4 px-md-5">
      {/* Header */}
      <div className="mb-4">
        <div ref={alertRef}></div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handleClose}
            className="btn btn-dark btn-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="text-muted small">
            <CurrentDateTime />
          </div>
        </div>
        <h1 className="text-center fw-bold mb-3">Transfer Issue Note</h1>
        <hr className="border-2 opacity-75" />
      </div>

      {/* Alert Messages */}
      {submissionStatus === "successSubmitted" && (
        <div
          className="alert alert-success alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Transfer issue note submitted successfully!
        </div>
      )}
      {submissionStatus === "successSavedAsDraft" && (
        <div
          className="alert alert-info alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-save-fill me-2"></i>
          Transfer issue note saved as draft, you can edit and submit it later!
        </div>
      )}
      {submissionStatus === "error" && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error submitting transfer issue note. Please try again.
        </div>
      )}

      <form>
        {/* Main Content Grid */}
        <div className="row g-4 mb-4">
          {/* TIN Information */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  1. TIN Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-semibold">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    className={`form-select ${
                      validFields.status ? "is-valid" : ""
                    } ${validationErrors.status ? "is-invalid" : ""}`}
                    value={formData.status}
                    onChange={(e) =>
                      handleStatusChange(
                        statusOptions.find(
                          (option) => option.id === e.target.value
                        )
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
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-semibold">
                    Issuing Cust Dek No <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validFields.issuingCustDekNo ? "is-valid" : ""
                    } ${validationErrors.issuingCustDekNo ? "is-invalid" : ""}`}
                    id="issuingCustDekNo"
                    name="issuingCustDekNo"
                    value={formData.issuingCustDekNo}
                    onChange={(e) =>
                      handleInputChange("issuingCustDekNo", e.target.value)
                    }
                    placeholder="Eg:- I-00009"
                    required
                  />
                  {validationErrors.issuingCustDekNo && (
                    <div className="invalid-feedback">
                      {validationErrors.issuingCustDekNo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Requisition Details */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  2. Transfer Requisition Details
                </h5>
              </div>
              <div className="card-body">
                <label
                  htmlFor="transferRequisition"
                  className="form-label fw-semibold"
                >
                  Transfer Requisition <span className="text-danger">*</span>
                </label>

                {selectedTrn === null && (
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
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
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setTrnSearchTerm("")}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>

                    {/* Dropdown for filtered requisitions */}
                    {trnSearchTerm && (
                      <div className="position-relative">
                        <ul
                          className="list-group position-absolute w-100 mt-1 shadow-lg"
                          style={{
                            maxHeight: "250px",
                            overflowY: "auto",
                            zIndex: 1000,
                          }}
                        >
                          {trns
                            .filter(
                              (trn) =>
                                trn.requestedUserId !== user?.userId &&
                                trn.referenceNumber
                                  ?.replace(/\s/g, "")
                                  ?.toLowerCase()
                                  .includes(
                                    trnSearchTerm
                                      .toLowerCase()
                                      .replace(/\s/g, "")
                                  )
                            )
                            .map((trn) => (
                              <li
                                key={trn.requisitionMasterId}
                                className="list-group-item list-group-item-action p-0"
                              >
                                <button
                                  className="btn btn-link text-decoration-none text-start w-100 p-3"
                                  type="button"
                                  onClick={() =>
                                    handleTrnChange(trn.referenceNumber)
                                  }
                                >
                                  <i className="bi bi-file-earmark-text me-2"></i>
                                  {trn?.referenceNumber}
                                </button>
                              </li>
                            ))}
                          {trns.filter(
                            (trn) =>
                              trn.requestedUserId !== user?.userId &&
                              trn.referenceNumber
                                ?.replace(/\s/g, "")
                                ?.toLowerCase()
                                .includes(
                                  trnSearchTerm.toLowerCase().replace(/\s/g, "")
                                )
                          ).length === 0 && (
                            <li className="list-group-item text-center text-muted py-3">
                              <i className="bi bi-emoji-frown me-2"></i>
                              No transfer requisitions found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="form-text mt-2">
                      {validationErrors.trnId && (
                        <div className="text-danger mb-1">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {validationErrors.trnId}
                        </div>
                      )}
                      <i className="bi bi-info-circle me-1"></i>
                      Please search for a transfer requisition and select it
                    </div>
                  </div>
                )}

                {/* Selected TRN Information */}
                {selectedTrn && (
                  <div className="card border-success">
                    <div className="card-header bg-light">
                      <strong>Selected Transfer Requisition</strong>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex">
                            <strong className="text-muted me-2">
                              Reference No:
                            </strong>
                            <span>{selectedTrn?.referenceNumber}</span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex">
                            <strong className="text-muted me-2">
                              Requested By:
                            </strong>
                            <span>{selectedTrn?.requestedBy}</span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex">
                            <strong className="text-muted me-2">
                              TRN Date:
                            </strong>
                            <span>
                              {moment
                                .utc(selectedTrn?.requisitionDate)
                                .tz("Asia/Colombo")
                                .format("YYYY-MM-DD hh:mm:ss A")}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex">
                            <strong className="text-muted me-2">
                              To Location:
                            </strong>
                            <span>
                              {selectedTrn?.requestedToLocation.locationName}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex">
                            <strong className="text-muted me-2">
                              From Location:
                            </strong>
                            <span>
                              {selectedTrn?.requestedFromLocation.locationName}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={handleResetTrn}
                          >
                            <i className="bi bi-arrow-counterclockwise me-2"></i>
                            Reset Transfer Requisition
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Item Details Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              <i className="bi bi-box-seam me-2"></i>
              3. Item Details
            </h5>
          </div>
          <div className="card-body">
            {formData.itemDetails.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="text-nowrap">Item Name</th>
                      <th className="text-nowrap">Unit</th>
                      <th className="text-nowrap">Cust Dek No</th>
                      <th className="text-nowrap">Requested Qty</th>
                      <th className="text-nowrap">Available Stock</th>
                      <th className="text-nowrap">Dispatched Qty</th>
                      <th className="text-nowrap text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.itemDetails.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{item.name}</td>
                        <td>{item.unit}</td>
                        <td>
                          <span className="badge bg-secondary rounded-pill">
                            {item.custDekNo}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary rounded-pill">
                            {item.quantity}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              item.stockInHand > 0 ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {item.stockInHand}
                          </span>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={item.stockInHand}
                            className={`form-control form-control-sm ${
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
                            placeholder={`Max: ${item.stockInHand}`}
                            disabled={item.stockInHand === 0}
                          />
                          {validationErrors[`issuedQuantity_${index}`] && (
                            <div className="invalid-feedback">
                              {validationErrors[`issuedQuantity_${index}`]}
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <i className="bi bi-trash me-1"></i>
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
              <div className="alert alert-warning mb-0" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Please select a transfer requisition to add item details.
              </div>
            )}

            {selectedTrn !== null && formData.itemDetails.length === 0 && (
              <div className="alert alert-danger mb-0" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                TIN is already issued for Selected transfer requisition.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </button>
          {/* <button
            type="button"
            className="btn btn-success"
            onClick={handlePrint}
            disabled={loading || loadingDraft || submissionStatus !== null}
          >
            <i className="bi bi-printer me-2"></i>
            Print
          </button> */}
          <button
            type="button"
            className="btn btn-primary"
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
              <>
                <i className="bi bi-check-circle me-2"></i>
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tin;

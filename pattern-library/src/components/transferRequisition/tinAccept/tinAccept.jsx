import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment";
import useMinList from "../../min/minList/useMinList";
import useTinAccept from "./tinAccept";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const TinAccept = ({ refetch, setRefetch, show, handleClose, tin }) => {
  const {
    approvalStatus,
    loading,
    alertRef,
    receivedQuantities,
    returnedQuantities,
    handleAccept,
    handleReceivedQuantityChange,
    handleReturnedQuantityChange,
    validateQuantities,
    getStatusBadgeClass,
    getStatusLabel,
  } = useTinAccept({
    tin,
    refetch,
    setRefetch,
    onFormSubmit: () => {
      handleClose();
    },
  });

  // Get validation errors for display
  const validationErrors = validateQuantities();
  const hasValidationErrors = validationErrors.length > 0;

  // Helper function to get validation error for specific item
  const getItemValidationError = (itemMasterId) => {
    return validationErrors.find((error) =>
      error.includes(`item ${itemMasterId}`)
    );
  };

  // Helper function to check if received quantity exceeds issued quantity
  const isReceivedExceedsIssued = (item) => {
    const receivedQty = parseFloat(receivedQuantities[item.issueDetailId] || 0);
    const issuedQty = parseFloat(item.quantity || 0);
    return receivedQty > issuedQty;
  };

  // Check if TIN is already accepted
  const isAccepted = tin.requisitionMaster.isMINAccepted === true;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      size="xl"
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>
          <i className="bi bi-check-circle me-2"></i>
          Accept Transfer Issue Note
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div ref={alertRef}></div>

        {/* Alert Messages */}
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-4"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            Transfer Issue Note accepted successfully!
          </div>
        )}
        {approvalStatus === "error" && (
          <div
            className="alert alert-danger alert-dismissible fade show mb-4"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Error accepting transfer issue note. Please try again.
          </div>
        )}
        {/* {hasValidationErrors && (
          <div className="alert alert-warning mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Validation Errors:</strong>
            <ul className="mb-0 mt-2">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )} */}
        {isAccepted && (
          <div className="alert alert-info mb-4" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            This Transfer Issue Note has already been accepted.
          </div>
        )}

        {/* Header Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h5 className="card-title text-success mb-2">
                  <i className="bi bi-hash me-1"></i>
                  Reference Number
                </h5>
                <p className="fs-5 fw-bold mb-0">{tin.referenceNumber}</p>
              </div>
              <div className="text-end">
                <h6 className="text-muted mb-2">TIN Status</h6>
                <span className={`badge fs-6 ${getStatusBadgeClass()}`}>
                  {getStatusLabel(tin.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="row g-3 mb-4">
          {/* Issue Information */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Issue Information
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-person-fill text-muted me-2 mt-1"></i>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">Issued By</small>
                      <span className="fw-semibold">{tin.createdBy}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-calendar-event text-muted me-2 mt-1"></i>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">
                        Dispatched Date
                      </small>
                      <span className="fw-semibold">
                        {moment
                          .utc(tin?.issueDate)
                          .tz("Asia/Colombo")
                          .format("YYYY-MM-DD hh:mm:ss A")}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="d-flex align-items-start">
                    <i className="bi bi-clipboard-check text-muted me-2 mt-1"></i>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">
                        Transfer Accepting Status
                      </small>
                      <span className={`badge mt-1 ${getStatusBadgeClass()}`}>
                        {getStatusLabel()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requisition & Approval Information */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Requisition & Approval
                </h6>
              </div>
              <div className="card-body">
                {tin.requisitionMaster && (
                  <div className="mb-3">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-receipt text-muted me-2 mt-1"></i>
                      <div className="flex-grow-1">
                        <small className="text-muted d-block">
                          Transfer Requisition Reference
                        </small>
                        <span className="fw-semibold">
                          {tin.requisitionMaster.referenceNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {parseInt(tin.status.toString().charAt(1), 10) === 2 && (
                  <>
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-person-check-fill text-muted me-2 mt-1"></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block">
                            Approved By
                          </small>
                          <span className="fw-semibold">{tin.approvedBy}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-calendar-check text-muted me-2 mt-1"></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block">
                            Approved Date
                          </small>
                          <span className="fw-semibold">
                            {moment
                              .utc(tin?.approvedDate)
                              .tz("Asia/Colombo")
                              .format("YYYY-MM-DD hh:mm:ss A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {parseInt(tin.status.toString().charAt(1), 10) !== 2 && (
                  <div className="alert alert-warning mb-0 py-2">
                    <i className="bi bi-hourglass-split me-2"></i>
                    <small>Approval pending</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Item Details Section */}
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white">
            <h6 className="mb-0">
              <i className="bi bi-box-seam me-2"></i>
              Item Details - Enter Received & Returned Quantities
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3"></th>
                    <th>Item Name</th>
                    <th>Unit</th>
                    <th>Batch</th>
                    <th className="text-center">Issued Qty</th>
                    <th className="text-center">Received Qty</th>
                    <th className="text-center">Returned Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {tin.issueDetails.map((item, index) => {
                    const receivedExceedsIssued = isReceivedExceedsIssued(item);
                    const itemError = getItemValidationError(
                      item.itemMaster?.itemMasterId
                    );

                    return (
                      <tr
                        key={index}
                        className={itemError ? "table-warning" : ""}
                      >
                        <td className="ps-3 text-muted fw-semibold">
                          {index + 1}
                        </td>
                        <td>
                          <span className="fw-semibold">
                            {item.itemMaster?.itemName}
                          </span>
                          {itemError && (
                            <small className="text-danger d-block mt-1">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              {itemError}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {item.itemMaster?.unit.unitName}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {item.batch?.batchRef}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary rounded-pill fs-6">
                            {item.quantity}
                          </span>
                        </td>
                        <td>
                          <div className="px-2">
                            <Form.Control
                              type="number"
                              min="0"
                              max={item.quantity}
                              step="0.1"
                              size="sm"
                              value={
                                receivedQuantities[item.issueDetailId] !==
                                undefined
                                  ? receivedQuantities[item.issueDetailId]
                                  : item.quantity ?? 0
                              }
                              onChange={(e) =>
                                handleReceivedQuantityChange(
                                  item.issueDetailId,
                                  e.target.value
                                )
                              }
                              placeholder="Received"
                              className={
                                receivedExceedsIssued ? "is-invalid" : ""
                              }
                              disabled={loading || isAccepted}
                            />
                            {receivedExceedsIssued && (
                              <div className="invalid-feedback">
                                Cannot exceed issued quantity
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="px-2">
                            <Form.Control
                              type="number"
                              min="0"
                              max={receivedQuantities[item.issueDetailId] || 0}
                              step="0.1"
                              size="sm"
                              value={
                                returnedQuantities[item.issueDetailId] !==
                                undefined
                                  ? returnedQuantities[item.issueDetailId]
                                  : item.returnedQuantity ?? 0
                              }
                              onChange={(e) =>
                                handleReturnedQuantityChange(
                                  item.issueDetailId,
                                  e.target.value
                                )
                              }
                              placeholder="Returned"
                              disabled={loading || isAccepted}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-light">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Total Items: {tin.issueDetails.length}
              </small>
              <div className="d-flex gap-3">
                <small className="text-muted">
                  <i className="bi bi-box-arrow-in-down me-1"></i>
                  Total Issued:{" "}
                  <span className="fw-bold">
                    {tin.issueDetails.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </span>
                </small>
                <small className="text-muted">
                  <i className="bi bi-check2-circle me-1"></i>
                  Total Received:{" "}
                  <span className="fw-bold text-success">
                    {tin.issueDetails.reduce((sum, item) => {
                      const received =
                        receivedQuantities[item.issueDetailId] !== undefined
                          ? parseFloat(receivedQuantities[item.issueDetailId])
                          : parseFloat(item.quantity || 0);
                      return sum + received;
                    }, 0)}
                  </span>
                </small>
                <small className="text-muted">
                  <i className="bi bi-arrow-return-left me-1"></i>
                  Total Returned:{" "}
                  <span className="fw-bold text-warning">
                    {tin.issueDetails.reduce((sum, item) => {
                      const returned =
                        returnedQuantities[item.issueDetailId] !== undefined
                          ? parseFloat(returnedQuantities[item.issueDetailId])
                          : parseFloat(item.returnedQuantity || 0);
                      return sum + returned;
                    }, 0)}
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        {/* <div className="alert alert-light border mt-4 mb-0" role="alert">
          <div className="d-flex">
            <i className="bi bi-lightbulb text-warning me-2 mt-1"></i>
            <div>
              <strong>Instructions:</strong>
              <ul className="mb-0 mt-2 small">
                <li>
                  Enter the <strong>Received Quantity</strong> for each item
                  (cannot exceed issued quantity)
                </li>
                <li>
                  Enter the <strong>Returned Quantity</strong> if any items need
                  to be returned (cannot exceed received quantity)
                </li>
                <li>
                  All quantities must be validated before accepting the transfer
                </li>
              </ul>
            </div>
          </div>
        </div> */}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || approvalStatus !== null}
          className="d-flex align-items-center gap-2"
        >
          <i className="bi bi-x-circle"></i>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => handleAccept(tin.issueMasterId)}
          disabled={
            loading ||
            approvalStatus !== null ||
            isAccepted ||
            hasValidationErrors
          }
          className="d-flex align-items-center gap-2"
        >
          {loading && approvalStatus === null ? (
            <ButtonLoadingSpinner text="Accepting..." />
          ) : (
            <>
              <i className="bi bi-check-circle"></i>
              Accept Transfer
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TinAccept;

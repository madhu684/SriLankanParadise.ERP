import React, { useMemo } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment";
import useTinAccept from "./tinAccept";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const TinAccept = ({ show, handleClose, tin }) => {
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
    showValidation,
    isAccepted,
  } = useTinAccept({
    tin,
    onFormSubmit: handleClose,
  });

  // Memoized computations
  const validationErrors = useMemo(
    () => validateQuantities(),
    [validateQuantities]
  );
  const hasValidationErrors = validationErrors.length > 0;

  const totals = useMemo(() => {
    if (!tin?.issueDetails) return { issued: 0, received: 0, damaged: 0 };

    return tin.issueDetails.reduce(
      (acc, item) => {
        const received =
          receivedQuantities[item.issueDetailId] !== undefined
            ? parseFloat(receivedQuantities[item.issueDetailId])
            : parseFloat(item.quantity || 0);

        const damaged =
          returnedQuantities[item.issueDetailId] !== undefined
            ? parseFloat(returnedQuantities[item.issueDetailId])
            : parseFloat(item.returnedQuantity || 0);

        return {
          issued: acc.issued + parseFloat(item.quantity || 0),
          received: acc.received + received,
          damaged: acc.damaged + damaged,
        };
      },
      { issued: 0, received: 0, damaged: 0 }
    );
  }, [tin?.issueDetails, receivedQuantities, returnedQuantities]);

  // Check if an item has validation error
  const getItemValidationStatus = (item) => {
    if (!showValidation || isAccepted) return [];

    const receivedQty = parseFloat(receivedQuantities[item.issueDetailId] || 0);
    const damagedQty = parseFloat(returnedQuantities[item.issueDetailId] || 0);
    const issuedQty = parseFloat(item.quantity || 0);

    const errors = [];

    if (receivedQty < 0) {
      errors.push("Received quantity cannot be negative");
    }

    if (damagedQty < 0) {
      errors.push("Damaged quantity cannot be negative");
    }

    if (receivedQty === 0 && damagedQty === 0) {
      errors.push("Both received and damaged quantities cannot be 0");
    }

    const totalQty = receivedQty + damagedQty;
    if (totalQty !== issuedQty) {
      errors.push(
        "Received quantity plus Damaged quantity must equal Issued quantity"
      );
    }

    return errors;
  };

  // Helper to check if received exceeds issued
  const isReceivedExceedsIssued = (item) => {
    const receivedQty = parseFloat(receivedQuantities[item.issueDetailId] || 0);
    const issuedQty = parseFloat(item.quantity || 0);
    return receivedQty > issuedQty;
  };

  // Format date helper
  const formatDate = (date) => {
    return moment.utc(date).tz("Asia/Colombo").format("YYYY-MM-DD hh:mm:ss A");
  };

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
            Error accepting transfer issue note. Please check the details and
            try again.
          </div>
        )}

        {/* Validation Errors Summary - Only show when validation is active */}
        {/* {showValidation && hasValidationErrors && !isAccepted && (
          <div className="alert alert-warning mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Validation Errors:</strong>
            <ul className="mb-0 mt-2 small">
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
                <p className="fs-5 fw-bold mb-0">{tin.referenceNumber}</p>
                <p className="fs-6 fw-bold mb-0">
                  Issuing Cust Dek No:{" "}
                  <span className="text-muted">
                    {tin.issuingCustDekNo || "N/A"}
                  </span>
                </p>
              </div>
              <div className="text-end">
                <h6 className="text-muted mb-2">TIN Status</h6>
                <span className={`badge fs-6 ${getStatusBadgeClass()}`}>
                  {getStatusLabel()}
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
                        {formatDate(tin?.issueDate)}
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

                {parseInt(tin.status.toString().charAt(1), 10) === 2 ? (
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
                            {formatDate(tin?.approvedDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
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
              Item Details - Enter Received & Damaged Quantities
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Item Name</th>
                    <th>Unit</th>
                    <th>Cust Dek No</th>
                    <th className="text-center">Issued Qty</th>
                    <th className="text-center">Received Qty</th>
                    <th className="text-center">Damaged Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {tin.issueDetails.map((item, index) => {
                    const itemErrors = getItemValidationStatus(item);
                    const hasError = itemErrors.length > 0 && showValidation;
                    const receivedExceedsIssued = isReceivedExceedsIssued(item);

                    return (
                      <tr
                        key={item.issueDetailId}
                        className={hasError ? "table-warning" : ""}
                      >
                        <td className="ps-3 text-muted fw-semibold">
                          {index + 1}
                        </td>
                        <td>
                          <div>
                            <span className="fw-semibold d-block">
                              {item.itemMaster?.itemName}
                            </span>
                            {hasError && (
                              <div className="mt-1">
                                {itemErrors.map((error, idx) => (
                                  <small
                                    key={idx}
                                    className="text-danger d-block"
                                  >
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    {error}
                                  </small>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {item.itemMaster?.conversionRate || "N/A"} ml
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {item.custDekNo || "N/A"}
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
                              step="0.1"
                              size="sm"
                              value={
                                receivedQuantities[item.issueDetailId] ??
                                item.quantity ??
                                0
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
                              step="0.1"
                              size="sm"
                              value={
                                returnedQuantities[item.issueDetailId] ??
                                item.returnedQuantity ??
                                0
                              }
                              onChange={(e) =>
                                handleReturnedQuantityChange(
                                  item.issueDetailId,
                                  e.target.value
                                )
                              }
                              placeholder="Damaged"
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
                  Total Issued: <span className="fw-bold">{totals.issued}</span>
                </small>
                <small className="text-muted">
                  <i className="bi bi-check2-circle me-1"></i>
                  Total Received:{" "}
                  <span className="fw-bold text-success">
                    {totals.received}
                  </span>
                </small>
                <small className="text-muted">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Total Damaged:{" "}
                  <span className="fw-bold text-warning">{totals.damaged}</span>
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Help Instructions - Only show when validation is active */}
        {/* {showValidation && !isAccepted && (
          <div className="alert alert-light border mt-4 mb-0" role="alert">
            <div className="d-flex">
              <i className="bi bi-lightbulb text-warning me-2 mt-1 fs-5"></i>
              <div>
                <strong>Instructions:</strong>
                <ul className="mb-0 mt-2 small">
                  <li>
                    <strong>
                      Received Quantity + Damaged Quantity must equal Issued
                      Quantity
                    </strong>{" "}
                    for each item
                  </li>
                  <li>
                    Enter the quantity actually received in good condition in
                    the <strong>Received Qty</strong> column
                  </li>
                  <li>
                    Enter any damaged or unusable quantity in the{" "}
                    <strong>Damaged Qty</strong> column
                  </li>
                  <li>
                    Both quantities cannot be zero - at least some quantity must
                    be accounted for
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )} */}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || approvalStatus === "approved"}
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
            approvalStatus === "approved" ||
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

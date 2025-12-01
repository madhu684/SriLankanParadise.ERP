import React from "react";
import { Modal, Button } from "react-bootstrap";
import useTinDetail from "./useTinDetail";
import useTinList from "../tinList/useTinList";
import moment from "moment";
import "moment-timezone";

const TinDetail = ({ show, handleClose, tin }) => {
  const { getStatusLabel, getStatusBadgeClass } = useTinList();
  const {
    receivedQuantities,
    returnedQuantities,
    isRequester,
    handleQuantityChange,
    handleAccept,
    handleReceivedQuantityChange,
    handleReturnedQuantityChange,
  } = useTinDetail(tin, handleClose);

  console.log(tin);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      scrollable
      size="xl"
    >
      <Modal.Header closeButton className="text-dark">
        <Modal.Title>
          <i className="bi bi-file-earmark-text me-2"></i>
          Transfer Issue Note Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Header Section */}
        <div className="card shadow mb-4">
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
                <span
                  className={`badge fs-6 ${getStatusBadgeClass(tin.status)}`}
                >
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
            <div className="card h-100 shadow">
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
                    <i className="bi bi-truck text-muted me-2 mt-1"></i>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">
                        Transfer Dispatching Status
                      </small>
                      <span
                        className={`badge mt-1 ${getStatusBadgeClass(
                          parseInt(`${1}${tin.status.toString().charAt(0)}`, 10)
                        )}`}
                      >
                        {getStatusLabel(
                          parseInt(`${1}${tin.status.toString().charAt(0)}`, 10)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requisition & Approval Information */}
          <div className="col-md-6">
            <div className="card h-100 shadow">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Requisition Information
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
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

                  <div className="d-flex align-items-start">
                    <i className="bi bi-link-45deg"></i>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">
                        GRN Reference
                      </small>
                      <span className="fw-semibold">
                        {tin.requisitionMaster.grnDekReference}
                      </span>
                    </div>
                  </div>
                </div>

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
        <div className="card shadow">
          <div className="card-header bg-secondary text-white">
            <h6 className="mb-0">
              <i className="bi bi-box-seam me-2"></i>
              Item Details
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3"></th>
                    <th>Item Name</th>
                    <th>Unit</th>
                    <th>Cust Dek No</th>
                    <th className="text-center">Dispatched Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {tin.issueDetails.map((item, index) => (
                    <tr key={index}>
                      <td className="ps-3 text-muted">{index + 1}</td>
                      <td>
                        <span className="fw-semibold">
                          {item.itemMaster?.itemName}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {item.itemMaster?.unit.unitName}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Total Items: {tin.issueDetails.length}
              </small>
              <small className="text-muted">
                Total Quantity:{" "}
                <span className="fw-bold">
                  {tin.issueDetails.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </small>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button
          variant="secondary"
          onClick={handleClose}
          className="d-flex align-items-center gap-2"
        >
          <i className="bi bi-x-circle"></i>
          Close
        </Button>
        {/* {isRequester && (
          <Button 
            variant="primary" 
            onClick={handleAccept}
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-check-circle"></i>
            Accept
          </Button>
        )} */}
      </Modal.Footer>
    </Modal>
  );
};

export default TinDetail;

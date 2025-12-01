import React from "react";
import { Modal, Button } from "react-bootstrap";
import useTransferRequisitionDetial from "./useTransferRequisitionDetail";
import useTransferRequisitionList from "../transferRequisitionList/useTransferRequisitionList";
import moment from "moment";
import "moment-timezone";

const TransferRequisitionDetail = ({
  show,
  handleClose,
  transferRequisition,
}) => {
  const { getStatusLabel, getStatusBadgeClass } = useTransferRequisitionList();

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="d-flex align-items-center gap-2">
          <i className="bi bi-file-earmark-text text-primary"></i>
          Transfer Requisition Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Header Section */}
        <div className="card border-0 shadow mb-4 bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="mb-2 fw-bold text-primary">
                  {transferRequisition.referenceNumber}
                </h5>
                <small className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  {moment
                    .utc(transferRequisition?.requisitionDate)
                    .tz("Asia/Colombo")
                    .format("DD MMM YYYY, hh:mm A")}
                </small>
              </div>
              <span
                className={`badge ${getStatusBadgeClass(
                  transferRequisition.status
                )} fs-6 px-3 py-2`}
              >
                {getStatusLabel(transferRequisition.status)}
              </span>
            </div>

            {transferRequisition.grnDekReference && (
              <div className="alert alert-info d-flex align-items-center gap-2 mb-0">
                <i className="bi bi-link-45deg"></i>
                <div>
                  <small className="text-muted d-block mb-1">
                    GRN Reference
                  </small>
                  <strong>{transferRequisition.grnDekReference}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Request Information */}
        <div className="card border-0 shadow mb-4 bg-light">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-info-circle me-2"></i>
            Request Information
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">
                    <i className="bi bi-person me-1"></i>Requested By
                  </label>
                  <p className="mb-0 fw-medium">
                    {transferRequisition.requestedBy}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="text-muted small mb-1">
                    <i className="bi bi-calendar-check me-1"></i>Requisition
                    Date
                  </label>
                  <p className="mb-0 fw-medium">
                    {moment
                      .utc(transferRequisition?.requisitionDate)
                      .tz("Asia/Colombo")
                      .format("DD MMM YYYY, hh:mm A")}
                  </p>
                </div>

                {transferRequisition.status === 2 && (
                  <>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        <i className="bi bi-person-check me-1"></i>Approved By
                      </label>
                      <p className="mb-0 fw-medium">
                        {transferRequisition.approvedBy}
                      </p>
                    </div>

                    <div className="mb-0">
                      <label className="text-muted small mb-1">
                        <i className="bi bi-calendar-check-fill me-1"></i>
                        Approved Date
                      </label>
                      <p className="mb-0 fw-medium">
                        {moment
                          .utc(transferRequisition?.approvedDate)
                          .tz("Asia/Colombo")
                          .format("DD MMM YYYY, hh:mm A")}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">
                    <i className="bi bi-arrow-right-circle me-1"></i>Requested
                    To Warehouse
                  </label>
                  <div className="alert alert-light border mb-0 py-2">
                    <i className="bi bi-building me-2 text-success"></i>
                    <strong>
                      {transferRequisition.requestedToLocation?.locationName}
                    </strong>
                  </div>
                </div>

                <div className="mb-0">
                  <label className="text-muted small mb-1">
                    <i className="bi bi-arrow-left-circle me-1"></i>Requested
                    From Warehouse
                  </label>
                  <div className="alert alert-light border mb-0 py-2">
                    <i className="bi bi-building me-2 text-danger"></i>
                    <strong>
                      {transferRequisition.requestedFromLocation?.locationName}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-top">
              <label className="text-muted small mb-2">
                <i className="bi bi-chat-left-text me-1"></i>Purpose of Request
              </label>
              <p className="mb-0 p-3 bg-light rounded">
                {transferRequisition.purposeOfRequest}
              </p>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="card border-0 shadow bg-light">
          <div className="card-header bg-secondary text-white d-flex align-items-center justify-content-between">
            <div>
              <i className="bi bi-box-seam me-2"></i>
              Item Details
            </div>
            <span className="badge bg-light text-dark">
              {transferRequisition.requisitionDetails.length} Item(s)
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3"></th>
                    <th>Item Name</th>
                    <th className="text-center">Unit</th>
                    <th className="text-end pe-3">Requested Quantity</th>
                    <th className="text-center">Cust Dek No</th>
                  </tr>
                </thead>
                <tbody>
                  {transferRequisition.requisitionDetails.map((item, index) => (
                    <tr key={index}>
                      <td className="ps-3 text-muted">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {/* <i className="bi bi-box text-primary"></i> */}
                          <span className="fw-medium">
                            {item.itemMaster.itemName}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark">
                          {item.itemMaster.conversionRate} ml
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <span className="badge bg-primary fs-6 px-3 py-2">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <span className="badge bg-light text-dark">
                          {item.custDekNo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Flags */}
        {(transferRequisition.isMINAccepted ||
          transferRequisition.isMINApproved) && (
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <div className="row g-3">
                {transferRequisition.isMINAccepted && (
                  <div className="col-6">
                    <div className="alert alert-success d-flex align-items-center mb-0">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <small>TIN Accepted</small>
                    </div>
                  </div>
                )}
                {transferRequisition.isMINApproved && (
                  <div className="col-6">
                    <div className="alert alert-success d-flex align-items-center mb-0">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <small>TIN Approved</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light border-top">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferRequisitionDetail;

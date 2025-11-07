import React from "react";
import { Modal, Button } from "react-bootstrap";
import useGrnDetail from "./useGrnDetail";
import useGrnList from "../grnList/useGrnList";
import moment from "moment";
import "moment-timezone";

const GrnDetail = ({ show, handleClose, grn }) => {
  const { getStatusLabel, getStatusBadgeClass } = useGrnList();
  const { grnTypeDisplayMap } = useGrnDetail();

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="xl">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold text-dark">
          Goods Received Note
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Header Section */}
        <div className="mb-4 p-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {/* <h5 className="mb-1 text-dark fw-bold">GRN #{grn.grnMasterId}</h5> */}
              <h5 className="mb-1 text-dark fw-bold">Reference No: </h5>
              <small className="text-dark fw-semibold">
                {grn?.referenceNo || "N/A"}
              </small>
            </div>
            <div className="text-end">
              <div className="mb-2">
                <span className="text-muted me-2">Overall Status:</span>
                <span
                  className={`badge ${getStatusBadgeClass(grn.status)} fs-6`}
                >
                  {getStatusLabel(grn.status)}
                </span>
              </div>
              <div>
                <span className="text-muted me-2">Receiving Status:</span>
                <span
                  className={`badge ${getStatusBadgeClass(
                    parseInt(`${1}${grn.status.toString().charAt(0)}`, 10)
                  )} fs-6`}
                >
                  {getStatusLabel(
                    parseInt(`${1}${grn.status.toString().charAt(0)}`, 10)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Details Section */}
        <div className="row g-4 mb-4">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow bg-light">
              <div className="card-header bg-primary bg-opacity-10 border-0">
                <h6 className="mb-0 text-primary fw-bold">
                  <i className="bi bi-info-circle me-2"></i>General Information
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="text-muted small mb-1">GRN Date</label>
                  <div className="fw-semibold">
                    {grn?.grnDate?.split("T")[0]}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small mb-1">GRN Type</label>
                  <div className="fw-semibold">
                    {grnTypeDisplayMap[grn?.grnType] || "N/A"}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small mb-1">
                    Warehouse Location
                  </label>
                  <div className="fw-semibold">
                    {grn?.warehouseLocation?.locationName || "N/A"}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small mb-1">Created</label>
                  <div className="fw-semibold small">
                    {moment
                      .utc(grn?.createdDate)
                      .tz("Asia/Colombo")
                      .format("YYYY-MM-DD hh:mm:ss A")}
                  </div>
                </div>
                {grn?.purchaseOrder?.referenceNo ? (
                  <div className="mb-3">
                    <label className="text-muted small mb-1">
                      Purchase Order Reference
                    </label>
                    <div className="fw-semibold">
                      {grn.purchaseOrder.referenceNo}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 alert alert-warning" role="alert">
                    <label className="text-muted small mb-1">
                      No Purchase Order Reference
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow bg-light">
              <div className="card-header bg-success bg-opacity-10 border-0">
                <h6 className="mb-0 text-success fw-bold">
                  <i className="bi bi-clock-history me-2"></i>Timeline &
                  Personnel
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="text-muted small mb-1">Received By</label>
                  <div className="fw-semibold">{grn.receivedBy || "N/A"}</div>
                </div>
                <div className="mb-3">
                  <label className="text-muted small mb-1">Received Date</label>
                  <div className="fw-semibold">
                    {grn?.receivedDate?.split("T")[0]}
                  </div>
                </div>
                {parseInt(grn.status.toString().charAt(1), 10) === 2 && (
                  <>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        Approved By
                      </label>
                      <div className="fw-semibold">
                        {grn.approvedBy || "N/A"}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        Approved Date
                      </label>
                      <div className="fw-semibold">
                        {moment
                          .utc(grn?.approvedDate)
                          .tz("Asia/Colombo")
                          .format("YYYY-MM-DD hh:mm:ss A")}
                      </div>
                    </div>
                  </>
                )}
                {/* <div className="mb-3">
                  <label className="text-muted small mb-1">Created</label>
                  <div className="fw-semibold small">
                    {moment
                      .utc(grn?.createdDate)
                      .tz("Asia/Colombo")
                      .format("YYYY-MM-DD hh:mm:ss A")}
                  </div>
                </div> */}
                <div className="mb-0">
                  <label className="text-muted small mb-1">Last Updated</label>
                  <div className="fw-semibold small">
                    {moment
                      .utc(grn?.lastUpdatedDate)
                      .tz("Asia/Colombo")
                      .format("YYYY-MM-DD hh:mm:ss A")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table Section */}
        <div className="card border-0 shadow bg-light">
          <div className="card-header bg-info bg-opacity-10 border-0">
            <h6 className="mb-0 text-info fw-bold">
              <i className="bi bi-box-seam me-2"></i>Item Details
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-semibold">Item Name</th>
                    <th className="fw-semibold">Unit</th>
                    <th className="fw-semibold text-end">Received Qty</th>
                    <th className="fw-semibold text-end">Rejected Qty</th>
                    <th className="fw-semibold text-end">Free Qty</th>
                    <th className="fw-semibold">Expiry Date</th>
                    <th className="fw-semibold text-end">Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {grn.grnDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item?.itemName}</td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-25 text-dark">
                          {item.item?.unit.unitName}
                        </span>
                      </td>
                      <td className="text-end">{item.receivedQuantity}</td>
                      <td className="text-end">
                        {item.rejectedQuantity > 0 ? (
                          <span className="text-danger fw-semibold">
                            {item.rejectedQuantity}
                          </span>
                        ) : (
                          item.rejectedQuantity
                        )}
                      </td>
                      <td className="text-end">
                        {item.freeQuantity > 0 ? (
                          <span className="text-success fw-semibold">
                            {item.freeQuantity}
                          </span>
                        ) : (
                          item.freeQuantity
                        )}
                      </td>
                      <td>{item.expiryDate.split("T")[0]}</td>
                      <td className="text-end fw-semibold">
                        {item.unitPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Section - Item Summary */}
          <div className="card-footer bg-light">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Total Items: {grn.grnDetails.length}
              </small>
              <div className="d-flex gap-3 flex-wrap">
                <small className="text-muted">
                  <i className="bi bi-box-arrow-in-down me-1"></i>
                  Total Received:{" "}
                  <span className="fw-bold text-primary">
                    {grn.grnDetails.reduce(
                      (sum, item) => sum + (item.receivedQuantity || 0),
                      0
                    )}
                  </span>
                </small>
                <small className="text-muted">
                  <i className="bi bi-x-circle me-1"></i>
                  Total Rejected:{" "}
                  <span className="fw-bold text-danger">
                    {grn.grnDetails.reduce(
                      (sum, item) => sum + (item.rejectedQuantity || 0),
                      0
                    )}
                  </span>
                </small>
                <small className="text-muted">
                  <i className="bi bi-gift me-1"></i>
                  Total Free:{" "}
                  <span className="fw-bold text-success">
                    {grn.grnDetails.reduce(
                      (sum, item) => sum + (item.freeQuantity || 0),
                      0
                    )}
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top bg-light">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrnDetail;

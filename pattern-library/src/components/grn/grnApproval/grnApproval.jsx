import React from "react";
import { Modal, Button } from "react-bootstrap";
import useGrnApproval from "./useGrnApproval";
import useGrnList from "../grnList/useGrnList";
import moment from "moment";
import "moment-timezone";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import ManageItem from "./manageItem/manageItem";

const GrnApproval = ({ show, handleClose, handleApproved, grn }) => {
  const {
    approvalStatus,
    loading,
    alertRef,
    modGrn,
    manageItem,
    showManageItemModal,
    grnTypeDisplayMap,
    isLoadingPurchaseOrder,
    isLoadingPurchaseRequisition,
    handleApprove,
    handleCostPriceChange,
    handleSellingPriceChange,
    handleCloseManageItemModal,
    handleOpenManageItemModal,
  } = useGrnApproval({
    grn,
    onFormSubmit: () => {
      handleClose();
      handleApproved();
    },
  });
  const { getStatusLabel, getStatusBadgeClass } = useGrnList();

  return (
    <>
      {!showManageItemModal && (
        <Modal
          show={show}
          onHide={handleClose}
          centered
          scrollable
          size="xl"
          backdrop={!(loading || approvalStatus !== null) ? true : "static"}
          keyboard={!(loading || approvalStatus !== null)}
        >
          <Modal.Header
            closeButton={!(loading || approvalStatus !== null)}
            className="border-bottom"
          >
            <Modal.Title className="fw-bold text-success">
              Approve Goods Received Note
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {/* Header Section */}
            <div className="mb-4 p-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 text-dark fw-bold">
                    GRN #{grn.grnMasterId}
                  </h5>
                  <small className="text-dark">
                    Reference: {grn?.referenceNo || "N/A"}
                  </small>
                </div>
                <div className="text-end">
                  <div className="mb-2">
                    <span className="text-muted me-2">Overall Status:</span>
                    <span
                      className={`badge ${getStatusBadgeClass(
                        grn.status
                      )} fs-6`}
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
                      <i className="bi bi-info-circle me-2"></i>General
                      Information
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
                      <label className="text-muted small mb-1">Created</label>
                      <div className="fw-semibold small">
                        {moment
                          .utc(grn?.createdDate)
                          .tz("Asia/Colombo")
                          .format("YYYY-MM-DD hh:mm:ss A")}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        Received By
                      </label>
                      <div className="fw-semibold">
                        {grn.receivedBy || "N/A"}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small mb-1">
                        Received Date
                      </label>
                      <div className="fw-semibold">
                        {grn?.receivedDate?.split("T")[0]}
                      </div>
                    </div>
                    <div className="mb-0">
                      <label className="text-muted small mb-1">
                        Last Updated
                      </label>
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
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 text-info fw-bold">
                    <i className="bi bi-box-seam me-2"></i>Item Details - Set
                    Pricing
                  </h6>
                  <small className="text-muted">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    Update cost and selling prices before approval if needed
                  </small>
                </div>
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
                        <th className="fw-semibold text-end">Cost Price</th>
                        <th className="fw-semibold text-end">Selling Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modGrn &&
                        modGrn.grnDetails.map((item, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">
                              {item.item?.itemName}
                            </td>
                            <td>
                              <span className="badge bg-secondary bg-opacity-25 text-dark">
                                {item.item?.unit.unitName}
                              </span>
                            </td>
                            <td className="text-end">
                              {item.receivedQuantity}
                            </td>
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
                            <td className="text-nowrap">
                              {item.expiryDate.split("T")[0]}
                            </td>
                            <td className="text-end fw-semibold">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td
                              className="bg-warning bg-opacity-5"
                              style={{ width: "140px" }}
                            >
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">$</span>
                                <input
                                  type="number"
                                  className="form-control form-control-sm text-end"
                                  value={item.costPrice}
                                  onChange={(e) =>
                                    handleCostPriceChange(e.target.value, index)
                                  }
                                  step="0.01"
                                  min="0"
                                  disabled={loading || approvalStatus !== null}
                                />
                              </div>
                            </td>
                            <td
                              className="bg-success bg-opacity-5"
                              style={{ width: "140px" }}
                            >
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">$</span>
                                <input
                                  type="number"
                                  className="form-control form-control-sm text-end"
                                  value={item.sellingPrice}
                                  onChange={(e) =>
                                    handleSellingPriceChange(
                                      e.target.value,
                                      index
                                    )
                                  }
                                  step="0.01"
                                  min="0"
                                  disabled={loading || approvalStatus !== null}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Alert Messages */}
            <div ref={alertRef} className="mt-3"></div>
            {approvalStatus === "approved" && (
              <div
                className="alert alert-success alert-dismissible fade show mt-3"
                role="alert"
              >
                <i className="bi bi-check-circle me-2"></i>
                <strong>Success!</strong> Goods Received Note approved
                successfully!
              </div>
            )}
            {approvalStatus === "error" && (
              <div className="alert alert-danger mt-3" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Error!</strong> Failed to approve goods received note.
                Please try again.
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-top bg-light">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading || approvalStatus !== null}
              className="px-4"
            >
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => handleApprove(grn.grnMasterId)}
              disabled={
                isLoadingPurchaseOrder ||
                isLoadingPurchaseRequisition ||
                loading ||
                approvalStatus !== null
              }
              className="px-4"
            >
              {loading && approvalStatus === null ? (
                <ButtonLoadingSpinner text="Approving..." />
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Approve GRN
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* {showManageItemModal && (
        <ManageItem
          show={showManageItemModal}
          handleClose={handleCloseManageItemModal}
          item={manageItem}
        />
      )} */}
    </>
  );
};

export default GrnApproval;

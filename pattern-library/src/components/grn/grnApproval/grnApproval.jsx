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
          size="lg"
          backdrop={!(loading || approvalStatus !== null) ? true : "static"}
          keyboard={!(loading || approvalStatus !== null)}
        >
          <Modal.Header closeButton={!(loading || approvalStatus !== null)}>
            <Modal.Title>Approve Goods Received Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 d-flex justify-content-between">
              <h6>Details for Goods Received Note : {grn.grnMasterId}</h6>
              <div>
                Grn Status :{" "}
                <span
                  className={`badge rounded-pill ${getStatusBadgeClass(
                    grn.status
                  )}`}
                >
                  {getStatusLabel(grn.status)}
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <strong>GRN Date:</strong> {grn?.grnDate?.split("T")[0]}
                </p>
                <p>
                  <strong>Received By:</strong> {grn.receivedBy}
                </p>
                <p>
                  <strong>Received Date:</strong>{" "}
                  {grn?.receivedDate?.split("T")[0]}
                </p>
                <p>
                  <strong>GRN Type:</strong> {grnTypeDisplayMap[grn?.grnType]}
                </p>
                <p>
                  <strong>Goods Receiving Status:</strong>{" "}
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      parseInt(`${1}${grn.status.toString().charAt(0)}`, 10)
                    )}`}
                  >
                    {getStatusLabel(
                      parseInt(`${1}${grn.status.toString().charAt(0)}`, 10)
                    )}
                  </span>
                </p>
                <p>
                  <strong>Warehouse Location:</strong>{" "}
                  {grn?.warehouseLocation?.locationName}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Created Date:</strong>{" "}
                  {moment
                    .utc(grn?.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  <strong>Last Updated Date:</strong>{" "}
                  {moment
                    .utc(grn?.lastUpdatedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                {grn?.purchaseOrder?.referenceNo && (
                  <p>
                    <strong>Purchase Order Reference No:</strong>{" "}
                    {grn?.purchaseOrder?.referenceNo}
                  </p>
                )}
              </div>
            </div>
            {/* 
            <p className="mt-3 alert alert-warning">
              NOTE: If you want to create items with different measurement
              units, please use manage item button.
            </p> */}
            <h6>Item Details</h6>
            <div className="table-responsive mb-2">
              <table
                className="table mt-2"
                style={{ minWidth: "1500px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit</th>
                    <th>Received Quantity</th>
                    <th>Rejected Quantity</th>
                    <th>Free Quantity</th>
                    {/* <th>Item Barcode</th> */}
                    <th>Expiry Date</th>
                    <th>Unit Price</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    {/* <th>Manage Items</th> */}
                  </tr>
                </thead>
                <tbody>
                  {modGrn &&
                    modGrn.grnDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.item?.itemName}</td>
                        <td>{item.item?.unit.unitName}</td>
                        <td>{item.receivedQuantity}</td>
                        <td>{item.rejectedQuantity}</td>
                        <td>{item.freeQuantity}</td>
                        {/* <td>{item.itemBarcode}</td> */}
                        <td>
                          {item.expiryDate
                            ? item.expiryDate.split("T")[0]
                            : "Not Set"}
                        </td>
                        <td>{item.unitPrice.toFixed(2)}</td>
                        {/* Additional fields */}
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={item.costPrice}
                            onWheel={(e) => e.target.blur()}
                            onChange={(e) =>
                              handleCostPriceChange(e.target.value, index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={item.sellingPrice}
                            onWheel={(e) => e.target.blur()}
                            onChange={(e) =>
                              handleSellingPriceChange(e.target.value, index)
                            }
                          />
                        </td>
                        {/* <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleOpenManageItemModal(item)}
                          >
                            <i className="bi bi-gear me-2"></i> Manage Item
                          </button>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div ref={alertRef}></div>
            {approvalStatus === "approved" && (
              <div
                className="alert alert-success alert-dismissible fade show mb-3"
                role="alert"
              >
                Goods Received Note approved!
              </div>
            )}
            {approvalStatus === "error" && (
              <div className="alert alert-danger mb-3" role="alert">
                Error approving goods received note. Please try again.
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading || approvalStatus !== null}
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
            >
              {loading && approvalStatus === null ? (
                <ButtonLoadingSpinner text="Approving..." />
              ) : (
                "Approve"
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

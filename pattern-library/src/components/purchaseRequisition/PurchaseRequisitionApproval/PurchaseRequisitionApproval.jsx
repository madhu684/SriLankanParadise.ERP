import React from "react";
import { Modal, Button } from "react-bootstrap";
import usePurchaseRequisitionApproval from "./usePurchaseRequisitionApproval";
import usePurchaseRequisitionList from "../PurchaseRequisitionList/usePurchaseRequisitionList";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";

const PurchaseRequisitionApproval = ({
  show,
  handleClose,
  handleApproved,
  purchaseRequisition,
}) => {
  const { approvalStatus, alertRef, loading, handleApprove } =
    usePurchaseRequisitionApproval({
      onFormSubmit: () => {
        handleClose();
        handleApproved();
      },
    });
  const { getStatusLabel, getStatusBadgeClass } = usePurchaseRequisitionList();
  return (
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
        <Modal.Title>Approve Purchase Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Purchase Requisition ID:{" "}
            {purchaseRequisition.purchaseRequisitionId}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                purchaseRequisition.status
              )}`}
            >
              {getStatusLabel(purchaseRequisition.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Created Date:</strong>{" "}
              {moment
                .utc(purchaseRequisition?.createdDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Last Updated Date:</strong>{" "}
              {moment
                .utc(purchaseRequisition?.lastUpdatedDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Requested By:</strong> {purchaseRequisition.requestedBy}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {purchaseRequisition?.departmentNavigation?.locationName}
            </p>
            <p>
              <strong>Email:</strong> {purchaseRequisition.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {purchaseRequisition.contactNo}
            </p>
            {purchaseRequisition.status === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {purchaseRequisition.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(purchaseRequisition?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>Requisition Date:</strong>{" "}
              {purchaseRequisition?.requisitionDate?.split("T")[0]}
            </p>
            <p>
              <strong>Purpose of Request:</strong>{" "}
              {purchaseRequisition.purposeOfRequest}
            </p>
            <p>
              <strong>Expected Delivery Date:</strong>{" "}
              {purchaseRequisition?.expectedDeliveryDate?.split("T")[0]}
            </p>
            <p>
              <strong>Expected Delivery Location:</strong>{" "}
              {
                purchaseRequisition.expectedDeliveryLocationNavigation
                  ?.locationName
              }
            </p>
            <p>
              <strong>Reference Number:</strong>{" "}
              {purchaseRequisition.referenceNo}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th className="text-end">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {purchaseRequisition.purchaseRequisitionDetails.map(
              (item, index) => (
                <tr key={index}>
                  <td>{item.itemMaster?.itemName}</td>
                  <td>{item.itemMaster?.unit.unitName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toFixed(2)}</td>
                  <td className="text-end">{item.totalPrice.toFixed(2)}</td>
                </tr>
              )
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"></td>
              <th>Total Amount</th>
              <td className="text-end" colSpan="2">
                {purchaseRequisition.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        <div ref={alertRef}></div>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            Purchase requisition approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving purchase requisition. Please try again.
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
          onClick={() =>
            handleApprove(purchaseRequisition.purchaseRequisitionId)
          }
          disabled={loading || approvalStatus !== null}
        >
          {loading && approvalStatus === null ? (
            <ButtonLoadingSpinner text="Approving..." />
          ) : (
            "Approve"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseRequisitionApproval;

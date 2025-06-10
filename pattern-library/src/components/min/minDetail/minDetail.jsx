import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import useMinDetail from "./useMinDetail";
import useMinList from "../minList/useMinList";
import { patch_issue_detail_api } from "../../../services/purchaseApi";
import moment from "moment";
import "moment-timezone";

const MinDetail = ({ show, handleClose, min }) => {
  const { getStatusLabel, getStatusBadgeClass } = useMinList();

  const {
    receivedQuantities,
    isRequester,
    handleQuantityChange,
    handleAccept,
    returnedQuantities,
    handleReceivedQuantityChange,
    handleReturnedQuantityChange,
  } = useMinDetail(min, handleClose);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      scrollable
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Material Issue Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Material Issue Note Ref Number: {min.referenceNumber}
          </h6>
          <div>
            MIN Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                min.status
              )}`}
            >
              {getStatusLabel(min.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Issued By:</strong> {min.createdBy}
            </p>
            <p>
              <strong>Dispatched Date:</strong>{" "}
              {moment
                .utc(min?.issueDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Material Dispatching Status:</strong>{" "}
              <span
                className={`badge rounded-pill ${getStatusBadgeClass(
                  parseInt(`${1}${min.status.toString().charAt(0)}`, 10)
                )}`}
              >
                {getStatusLabel(
                  parseInt(`${1}${min.status.toString().charAt(0)}`, 10)
                )}
              </span>
            </p>
            {parseInt(min.status.toString().charAt(1), 10) === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {min.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(min?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>Material Requisition Reference No:</strong>{" "}
              {min.requisitionMaster.referenceNumber}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Item Batch</th>
              <th>Dispatched Quantity</th>
              <th>Returned Quantity</th>
            </tr>
          </thead>
          <tbody>
            {min.issueDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemMaster?.itemName}</td>
                <td>{item.itemMaster?.unit.unitName}</td>
                <td>{item.batch?.batchRef}</td>
                <td>{item.quantity}</td>
                <td>
                  {isRequester ? (
                    <Form.Control
                      type="number"
                      min="0"
                      value={
                        receivedQuantities[item.issueDetailId] !== undefined
                          ? receivedQuantities[item.issueDetailId]
                          : item.receivedQuantity ?? 0
                      }
                      onChange={(e) =>
                        handleReceivedQuantityChange(
                          item.issueDetailId,
                          e.target.value
                        )
                      }
                      placeholder="Enter received qty"
                    />
                  ) : item.receivedQuantity ? (
                    <span>{item.receivedQuantity}</span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td>
                  {isRequester ? (
                    <Form.Control
                      type="number"
                      min="0"
                      value={
                        returnedQuantities[item.issueDetailId] !== undefined
                          ? returnedQuantities[item.issueDetailId]
                          : item.returnedQuantity ?? 0
                      }
                      onChange={(e) =>
                        handleReturnedQuantityChange(
                          item.issueDetailId,
                          e.target.value
                        )
                      }
                      placeholder="Enter returned qty"
                    />
                  ) : item.returnedQuantity ? (
                    <span>{item.returnedQuantity}</span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {isRequester && (
          <Button variant="primary" onClick={handleAccept}>
            Accept
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MinDetail;

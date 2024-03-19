import React from "react";
import { Modal, Button } from "react-bootstrap";
import useGrnDetail from "./useGrnDetail";
import useGrnList from "../grnList/useGrnList";
import moment from "moment";
import "moment-timezone";

const GrnDetail = ({ show, handleClose, grn }) => {
  const { getStatusLabel, getStatusBadgeClass } = useGrnList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Goods Received Note</Modal.Title>
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
              <strong>Received Date:</strong> {grn?.receivedDate?.split("T")[0]}
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
            {parseInt(grn.status.toString().charAt(1), 10) === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {grn.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(grn?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
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
            <p>
              <strong>Purchase Order Reference No:</strong>{" "}
              {grn.purchaseOrder.referenceNo}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Received Quantity</th>
              <th>Rejected Quantity</th>
              <th>Free Quantity</th>
              <th>Expiry Date</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {grn.grnDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.item?.itemName}</td>
                <td>{item.item?.unit.unitName}</td>
                <td>{item.receivedQuantity}</td>
                <td>{item.rejectedQuantity}</td>
                <td>{item.freeQuantity}</td>
                <td>{item.expiryDate?.split("T")[0]}</td>
                <td>{item.unitPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrnDetail;

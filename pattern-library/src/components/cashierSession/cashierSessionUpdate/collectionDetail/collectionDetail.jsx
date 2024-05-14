import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import "moment-timezone";

const CollectionDetail = ({ show, handleClose, modeId, salesReceipts }) => {
  const mode = salesReceipts.find(
    (r) => r.paymentMode.paymentModeId === parseInt(modeId)
  );

  const receiptsForMode = salesReceipts.filter(
    (r) => r.paymentMode.paymentModeId === parseInt(modeId)
  );
  const totalAmount = receiptsForMode.reduce(
    (total, r) => total + r.amountReceived,
    0
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Collection Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Payment Mode: {mode?.paymentMode.mode}</h6>
        <table className="table">
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Created Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {receiptsForMode.map((r) => (
              <tr key={r.salesReceiptId}>
                <td>{r.referenceNumber}</td>
                <td>
                  {moment
                    .utc(r.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </td>
                <td>{r.amountReceived.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>
                <strong>Total</strong>
              </td>
              <td>{totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
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

export default CollectionDetail;

import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import "moment-timezone";

const CollectionDetail = ({
  show,
  handleClose,
  modeId,
  salesReceipts,
  thousandSeperator,
}) => {
  const mode = salesReceipts.find(
    (r) => r.paymentMode.paymentModeId === parseInt(modeId)
  );
  const receiptsForMode = salesReceipts.filter(
    (r) => r.paymentMode.paymentModeId === parseInt(modeId)
  );
  const totalAmount = receiptsForMode.reduce(
    (total, r) => total + r.amountCollect,
    0
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-primary bg-gradient text-white">
        <Modal.Title className="fw-bold">
          <i className="bi bi-receipt me-2"></i>
          Collection Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="alert alert-info border-0 shadow-sm mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-credit-card fs-4 me-3"></i>
            <div>
              <small className="text-muted d-block mb-1">Payment Mode</small>
              <h5 className="mb-0 fw-semibold">{mode?.paymentMode.mode}</h5>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th className="fw-semibold">Reference Number</th>
                <th className="fw-semibold">Created Date</th>
                <th className="text-end fw-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {receiptsForMode.map((r) => (
                <tr key={r.salesReceiptId}>
                  <td className="fw-medium text-primary">
                    {r.referenceNumber}
                  </td>
                  <td className="text-muted">
                    <small>
                      {moment
                        .utc(r.createdDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")}
                    </small>
                  </td>
                  <td className="text-end fw-semibold">
                    {thousandSeperator(r.amountCollect.toFixed(2))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light border-top border-2">
              <tr>
                <td colSpan="2" className="text-end pe-3">
                  <strong className="fs-5">Total</strong>
                </td>
                <td className="text-end">
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {thousandSeperator(totalAmount.toFixed(2))}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {receiptsForMode.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
            <p className="mb-0">No receipts found for this payment mode</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CollectionDetail;

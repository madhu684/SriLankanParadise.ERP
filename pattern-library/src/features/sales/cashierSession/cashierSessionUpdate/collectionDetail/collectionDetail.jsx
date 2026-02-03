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
  console.log(salesReceipts);
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
    <Modal show={show} onHide={handleClose} size="xl" centered scrollable>
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
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th className="fw-semibold">Receipt Info</th>
                <th className="fw-semibold">Invoice Details</th>
                <th className="fw-semibold">Patient Info</th>
                <th className="fw-semibold">Invoice Created By</th>
                <th className="text-end fw-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {receiptsForMode.map((r) => {
                const hasInvoices =
                  r.salesReceiptSalesInvoices &&
                  r.salesReceiptSalesInvoices.length > 0;
                const invoiceCount = hasInvoices
                  ? r.salesReceiptSalesInvoices.length
                  : 0;

                return (
                  <React.Fragment key={r.salesReceiptId}>
                    {hasInvoices ? (
                      r.salesReceiptSalesInvoices.map((item, idx) => {
                        const invoice = item.salesInvoice;
                        return (
                          <tr
                            key={`${r.salesReceiptId}-${idx}`}
                            className={idx > 0 ? "border-top-0" : ""}
                          >
                            {idx === 0 && (
                              <td rowSpan={invoiceCount} className="align-top">
                                <div className="fw-medium text-primary mb-1">
                                  {r.referenceNumber}
                                </div>
                                <small className="text-muted d-block">
                                  {moment
                                    .utc(r.createdDate)
                                    .tz("Asia/Colombo")
                                    .format("YYYY-MM-DD")}
                                </small>
                                <small className="text-muted d-block">
                                  {moment
                                    .utc(r.createdDate)
                                    .tz("Asia/Colombo")
                                    .format("hh:mm:ss A")}
                                </small>
                              </td>
                            )}
                            <td>
                              {invoice ? (
                                <>
                                  <div className="fw-semibold text-dark mb-1">
                                    {invoice.referenceNumber}
                                  </div>
                                  <small className="text-muted d-block">
                                    {moment
                                      .utc(invoice.invoiceDate)
                                      .tz("Asia/Colombo")
                                      .format("YYYY-MM-DD hh:mm A")}
                                  </small>
                                </>
                              ) : (
                                <span className="text-muted">
                                  <small>No invoice data</small>
                                </span>
                              )}
                            </td>
                            <td>
                              {invoice?.inVoicedPersonName ? (
                                <>
                                  <div className="fw-semibold text-dark">
                                    {invoice.inVoicedPersonName}
                                  </div>
                                  {invoice.inVoicedPersonMobileNo && (
                                    <small className="text-muted">
                                      <i className="bi bi-telephone me-1"></i>
                                      {invoice.inVoicedPersonMobileNo}
                                    </small>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">
                                  <small>No patient info</small>
                                </span>
                              )}
                            </td>
                            <td>
                              {invoice?.createdBy ? (
                                <span className="badge bg-secondary">
                                  {invoice.createdBy}
                                </span>
                              ) : (
                                <span className="text-muted">
                                  <small>N/A</small>
                                </span>
                              )}
                            </td>
                            {idx === 0 && (
                              <td
                                rowSpan={invoiceCount}
                                className="text-end fw-semibold align-top"
                              >
                                <span className="fs-6">
                                  {thousandSeperator(
                                    r.amountCollect.toFixed(2)
                                  )}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td>
                          <div className="fw-medium text-primary mb-1">
                            {r.referenceNumber}
                          </div>
                          <small className="text-muted d-block">
                            {moment
                              .utc(r.createdDate)
                              .tz("Asia/Colombo")
                              .format("YYYY-MM-DD hh:mm:ss A")}
                          </small>
                        </td>
                        <td colSpan="2" className="text-muted text-center">
                          <small>No invoices linked</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {r.createdBy}
                          </span>
                        </td>
                        <td className="text-end fw-semibold">
                          {thousandSeperator(r.amountCollect.toFixed(2))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot className="table-light border-top border-2">
              <tr>
                <td colSpan="4" className="text-end pe-3">
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














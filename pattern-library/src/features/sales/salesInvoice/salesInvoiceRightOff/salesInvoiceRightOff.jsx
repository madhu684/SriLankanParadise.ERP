import React from "react";
import { Modal, Button } from "react-bootstrap";
import { put_sales_invoice_api } from "common/services/salesApi";

const SalesInvoiceRightOff = ({
  show,
  handleClose,
  salesInvoice,
  handleRightOff,
}) => {
  const handleConfirmRightOff = async () => {
    try {
      await put_sales_invoice_api(salesInvoice.salesInvoiceId, {
        invoiceDate: salesInvoice.invoiceDate,
        dueDate: salesInvoice.dueDate,
        totalAmount: salesInvoice.totalAmount,
        status: 8,
        createdBy: salesInvoice.createdBy,
        createdUserId: salesInvoice.createdUserId,
        approvedBy: salesInvoice.approvedBy,
        approvedUserId: salesInvoice.approvedUserId,
        approvedDate: salesInvoice.approvedDate,
        companyId: salesInvoice.companyId,
        salesOrderId: salesInvoice.salesOrderId,
        amountDue: 0,
        createdDate: salesInvoice.createdDate,
        lastUpdatedDate: salesInvoice.lastUpdatedDate,
        referenceNumber: salesInvoice.referenceNumber,
        permissionId: salesInvoice.permissionId,
        locationId: salesInvoice.locationId,
        inVoicedPersonName: salesInvoice.patientName,
        inVoicedPersonMobileNo: salesInvoice.patientNo,
        appointmentId: salesInvoice.appointmentId,
        tokenNo: salesInvoice.tokenNo,
        discountAmount: salesInvoice.discountAmount,
      });
      handleRightOff();
      handleClose();
    } catch (error) {
      console.error("Error righting off sales invoice:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Write Off Sales Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to write off this sales invoice (Reference No:{" "}
          {salesInvoice?.referenceNo})? This will set the Amount Due to 0 and
          change the status to Write Offed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmRightOff}>
          Write Off
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesInvoiceRightOff;














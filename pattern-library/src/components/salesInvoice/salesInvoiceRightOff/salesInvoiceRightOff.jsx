import { Modal, Button } from "react-bootstrap";
import { put_sales_invoice_api } from "../../../services/salesApi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const SalesInvoiceRightOff = ({
  show,
  handleClose,
  salesInvoice,
  handleRightOff,
}) => {
  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const queryClient = useQueryClient();

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
      });
      queryClient.invalidateQueries(["salesInvoices", companyId]);
      handleRightOff();
      handleClose();
      toast.success("Sales invoice righted off successfully.");
    } catch (error) {
      console.error("Error righting off sales invoice:", error);
      toast.error("Error righting off sales invoice.");
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

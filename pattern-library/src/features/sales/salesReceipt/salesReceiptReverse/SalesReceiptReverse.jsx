import { useQueryClient } from "@tanstack/react-query";
import { reverse_sales_receipt_api } from "common/services/salesApi";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const SalesReceiptReverse = ({
  show,
  handleClose,
  salesReceipt,
  handleReverse,
}) => {
  const queryClient = useQueryClient();
  const MODAL_CLOSE_DELAY_MS = 2000;

  const reverseSR = async () => {
    try {
      const response = await reverse_sales_receipt_api(
        salesReceipt.salesReceiptId,
      );
      if (response.status === 200) {
        toast.success("Successfully reversed sales receipt.");
        queryClient.invalidateQueries(["salesReceipts"]);
        queryClient.invalidateQueries(["salesInvoiceOptions"]);
        handleReverse();
        setTimeout(() => {
          handleClose();
        }, MODAL_CLOSE_DELAY_MS);
      } else {
        toast.error("Failed to reverse sales receipt. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while reversing the sales receipt.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-semibold">Reverse Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3 pb-4">
        <div
          className="alert alert-warning border-0 bg-warning bg-opacity-10 mb-3"
          role="alert"
        >
          <div className="d-flex align-items-start">
            <i className="bi bi-exclamation-triangle-fill text-warning me-2 mt-1"></i>
            <div>
              <strong className="d-block mb-1">Warning</strong>
              <small className="text-muted">
                This action cannot be undone.
              </small>
            </div>
          </div>
        </div>
        <p className="fw-semibold text-secondary mb-2">
          Are you sure you want to reverse this sales receipt?
        </p>
        <div className="card border-0 bg-light">
          <div className="card-body py-2 px-3">
            <div className="row g-2">
              <div className="col-5 text-muted small">Reference No:</div>
              <div className="col-7 fw-semibold">
                {salesReceipt?.referenceNumber}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-danger" onClick={handleClose} className="px-4">
          Cancel
        </Button>
        <Button variant="outline-success" onClick={reverseSR} className="px-4">
          Reverse Receipt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesReceiptReverse;

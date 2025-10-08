import { useState } from "react";
import {
  delete_charges_and_deductions_applied_api,
  get_charges_and_deductions_applied_api,
} from "../../../services/purchaseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "react-bootstrap";
import { delete_sales_invoice_api } from "../../../services/salesApi";

const SalesInvoiceDelete = ({ show, handleClose, salesInvoice }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const queryClient = useQueryClient();

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        3,
        salesInvoice.salesInvoiceId,
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching charges and deductions:", error);
    }
  };

  const { data: chargesAndDeductionsApplied, isLoading: isChargesLoading } =
    useQuery({
      queryKey: ["chargesAndDeductionsApplied", salesInvoice.purchaseOrderId],
      queryFn: fetchChargesAndDeductionsApplied,
      enabled: !!salesInvoice,
    });

  const handleDeleteSI = async () => {
    setIsDeleting(true);
    try {
      if (!isChargesLoading && chargesAndDeductionsApplied.length > 0) {
        chargesAndDeductionsApplied.forEach((charge) => {
          delete_charges_and_deductions_applied_api(
            charge.chargesAndDeductionAppliedId
          );
        });
      }

      await delete_sales_invoice_api(salesInvoice.salesInvoiceId);

      // Show success message
      setIsDeleted(true);
      setIsDeleting(false);

      setTimeout(() => {
        handleClose();
        // Reset states when modal closes
        setIsDeleted(false);
        queryClient.invalidateQueries([
          "salesInvoicesByUserId",
          sessionStorage.getItem("userId"),
        ]);
        queryClient.invalidateQueries([
          "salesInvoicesWithoutDrafts",
          sessionStorage.getItem("companyId"),
        ]);
      }, 2000);
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsDeleted(false);
    setIsDeleting(false);
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleModalClose} centered backdrop="static">
      <Modal.Header>
        <Modal.Title>{isDeleted ? "Success" : "Confirm Delete"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isDeleted ? (
          <div className="text-center">
            <div className="text-success mb-3">
              <i className="fas fa-check-circle fa-3x"></i>
            </div>
            <p className="text-success fw-bold">
              Sales Invoice '{salesInvoice?.referenceNo}' has been successfully
              deleted!
            </p>
          </div>
        ) : (
          <p>{`Are you sure you want to delete Purchase Order '${salesInvoice?.referenceNo}' ?`}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleModalClose}
          disabled={isDeleting}
          style={{ display: isDeleted ? "none" : "inline-block" }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteSI}
          disabled={isDeleting}
          style={{ display: isDeleted ? "none" : "inline-block" }}
        >
          {isDeleting ? (
            <div className="text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesInvoiceDelete;

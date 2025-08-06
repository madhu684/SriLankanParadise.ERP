import { Button, Modal } from "react-bootstrap";
import { delete_purchase_requisition_api } from "../../../services/purchaseApi";
import { useState } from "react";

const PurchaseRuquisitionDelete = ({
  show,
  handleClose,
  purchaseRequisition,
  refetch,
  setRefetch,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeletePR = async () => {
    setIsDeleting(true);
    try {
      await delete_purchase_requisition_api(
        purchaseRequisition.purchaseRequisitionId
      );
      // Show success message
      setIsDeleted(true);
      setIsDeleting(false);

      setTimeout(() => {
        setRefetch(!refetch);
        handleClose();
        setIsDeleted(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting purchase requisition:", error);
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
              Purchase Requisition '{purchaseRequisition?.referenceNo}' has been
              successfully deleted!
            </p>
          </div>
        ) : (
          <p>{`Are you sure you want to delete Purchase Requisition '${purchaseRequisition?.referenceNo}' ?`}</p>
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
          onClick={handleDeletePR}
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

export default PurchaseRuquisitionDelete;

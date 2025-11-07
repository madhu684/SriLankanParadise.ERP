import React from "react";
import { Modal, Button } from "react-bootstrap";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const DeleteConfirmationModal = ({
  show,
  handleClose,
  handleConfirmDelete,
  title,
  submissionStatus,
  message,
  loading,
  type = "Delete",
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={!(loading || submissionStatus !== null)}
    >
      <Modal.Header closeButton={!(loading || submissionStatus !== null)}>
        <Modal.Title>Confirm {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to {type} this {title}?
        {/* Display success or error messages if provided */}
        {submissionStatus && message && (
          <>
            {submissionStatus === "success" && (
              <div className="alert alert-success mt-3 mb-0" role="alert">
                {message}
              </div>
            )}
            {submissionStatus === "error" && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {message}
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={
            type === "Delete" || type === "Deactivate" ? "danger" : "success"
          }
          onClick={handleConfirmDelete}
          disabled={loading}
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Deleting..." />
          ) : (
            type
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteConfirmationModal.defaultProps = {
  submissionStatus: null,
  message: null,
  loading: false,
};

export default DeleteConfirmationModal;

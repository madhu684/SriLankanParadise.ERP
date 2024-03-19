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
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this {title.toLowerCase()}?
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
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || submissionStatus !== null}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirmDelete}
          disabled={loading || submissionStatus !== null}
        >
          {loading && submissionStatus === null ? (
            <ButtonLoadingSpinner text="Deleting..." />
          ) : (
            "Delete"
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

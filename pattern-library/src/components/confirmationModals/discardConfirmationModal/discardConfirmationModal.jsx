import { Modal, Button } from "react-bootstrap";

const DiscardConfirmationModal = ({ show, onHide, onDiscard, title }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Discard {title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to discard the {title.toLowerCase()}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDiscard}>
          Discard
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DiscardConfirmationModal;

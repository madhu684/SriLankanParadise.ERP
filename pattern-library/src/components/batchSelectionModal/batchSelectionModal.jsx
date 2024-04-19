import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const BatchSelectionModal = ({
  show,
  handleClose,
  itemBatches,
  itemDetails,
  handleBatchSelect,
}) => {
  const remainingBatches = itemBatches?.filter(
    (batch) =>
      !itemDetails.some((detail) => detail.itemBatchId === batch.batchId)
  );

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Item Batch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          Please select a batch for the item:{" "}
          {itemBatches[0].itemMaster.itemName}
        </div>
        {/* Display item batches here */}
        <ListGroup>
          {remainingBatches.length > 0 ? (
            remainingBatches.map((batch) => (
              <ListGroup.Item
                key={batch.batchId}
                action
                onClick={() => handleBatchSelect(batch.batchId)}
              >
                <div>
                  <i
                    className="bi bi-box"
                    style={{ marginRight: "5px", color: "#007bff" }}
                  ></i>{" "}
                  {/* Bootstrap 5 icon */}
                  <strong>Batch Reference:</strong> {batch.batch.batchRef} |{" "}
                  <strong>Temp Qty:</strong> {batch.tempQuantity} |{" "}
                  <strong>Unit Price:</strong> {batch.sellingPrice} |{" "}
                  <strong>Expiry Date:</strong>{" "}
                  {batch.expiryDate?.split("T")[0]}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <div className="text-danger">
              You have selected all batches for this item.
            </div>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchSelectionModal;

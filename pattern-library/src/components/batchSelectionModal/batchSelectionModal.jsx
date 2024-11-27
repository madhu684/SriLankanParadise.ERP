import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const BatchSelectionModal = ({
  show,
  handleClose,
  itemBatches,
  itemDetails,
  itemIdsToBeDeleted,
  handleBatchSelect,
}) => {
  // Filter remaining batches
  const remainingBatches = itemBatches?.filter(
    (batch) =>
      !itemDetails.some((detail) => detail.itemBatchId === batch.batchId) &&
      !itemIdsToBeDeleted.some(
        (itemIdToBeDeleted) =>
          itemIdToBeDeleted.itemBatch.batchId === batch.batchId
      )
  );
console.log(itemBatches);
  // Safely get item name from the first itemBatch
  const itemName = itemBatches?.[0]?.itemBatch?.itemMaster?.itemName || "Unknown Item";

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Item Batch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          Please select a batch for the item: <strong>{itemName}</strong>
        </div>

        {/* Display item batches here */}
        <ListGroup>
          {itemBatches?.length > 0 ? (
            itemBatches.map((batch) => (
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
                  <strong>Batch Reference:</strong> {batch.itemBatch?.batch?.
batchRef || "No batch reference available"} |{" "}
<strong>Temp Qty:</strong> {batch.stockInHand} |{" "}
<strong>Unit Price:</strong> {batch.itemBatch?.sellingPrice} |{" "}
<strong>Expiry Date:</strong>{" "}
{batch.itemBatch?.expiryDate?.split("T")[0] || "No expiry date"}
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

BatchSelectionModal.defaultProps = {
itemIdsToBeDeleted: [],
};

export default BatchSelectionModal;

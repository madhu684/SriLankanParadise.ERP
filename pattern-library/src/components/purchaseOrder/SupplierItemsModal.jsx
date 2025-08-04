import React from "react";
import { Modal, Button, Table, Badge } from "react-bootstrap";

const SupplierItemsModal = ({ show, onClose, supplierItems }) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>Supplier Items</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {supplierItems && supplierItems.length > 0 ? (
          <div className="table-responsive">
            <Table striped hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Supplier Name</th>
                  <th>Item Name</th>
                  <th>Current Stock</th>
                  <th>UOM</th>
                  <th className="text-end">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {supplierItems.map((supplierItem, index) => (
                  <tr key={index}>
                    <td>{supplierItem.supplierName || "N/A"}</td>
                    <td className="text-nowrap">
                      {supplierItem.itemName || "N/A"}
                    </td>
                    <td>{supplierItem.stockInHand || 0}</td>
                    <td>{supplierItem.unitName || "N/A"}</td>
                    <td className="text-end">
                      {/* <Badge bg="primary" className="fs-6">
                        Rs. {supplierItem.unitPrice?.toFixed(2) || "0.00"}
                      </Badge> */}
                      Rs. {supplierItem.unitPrice?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h4 className="mt-3 text-muted">No Supplier Items Found</h4>
            <p className="text-muted">
              There are no supplier items available for this product.
            </p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierItemsModal;

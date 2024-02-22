import React from "react";
import { Modal, Button } from "react-bootstrap";
import useItemMasterDetial from "./useItemMasterDetail";
import useItemMasterList from "../itemMasterList/useItemMasterList";

const ItemMasterDetail = ({ show, handleClose, itemMaster }) => {
  const { getStatusLabel, getStatusBadgeClass } = useItemMasterList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Item Master</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Item Master ID: {itemMaster.itemMasterId}</h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                itemMaster.status
              )}`}
            >
              {getStatusLabel(itemMaster.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Created By:</strong> {itemMaster.createdBy}
            </p>
          </div>
          <p>
            <strong>Item name:</strong> {itemMaster.itemName}
          </p>
          <p>
            <strong>Category:</strong> {itemMaster.category.categoryName}
          </p>
        </div>

        {/* Stock Information Table */}
        <h6>Stock Information</h6>
        <div className="table-responsive mb-2">
          <table className="table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Stock Quantity</th>
                <th>Selling Price</th>
                <th>Cost Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{itemMaster?.unit.unitName}</td>
                <td>{itemMaster?.stockQuantity}</td>
                <td>{itemMaster?.sellingPrice.toFixed(2)}</td>
                <td>{itemMaster?.costPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemMasterDetail;

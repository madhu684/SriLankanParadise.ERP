import React from "react";
import { Modal, Button } from "react-bootstrap";
import useItemMasterDetial from "./useItemMasterDetail";
import useItemMasterList from "../itemMasterList/useItemMasterList";

const ItemMasterDetail = ({ show, handleClose, itemMaster }) => {
  const { getStatusLabel, getStatusBadgeClass } = useItemMasterList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable>
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
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Created By:</strong> {itemMaster.createdBy}
            </p>
          </div>
          <p>
            <strong>Item name:</strong> {itemMaster.itemName}
          </p>
          <p>
            <strong>Item type:</strong> {itemMaster.itemType?.name}
          </p>
          <p>
            <strong>Category:</strong> {itemMaster.category?.categoryName}
          </p>
          <p>
            <strong>Unit:</strong> {itemMaster.unit?.unitName}
          </p>
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

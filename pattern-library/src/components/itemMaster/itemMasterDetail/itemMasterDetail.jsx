import React from "react";
import { Modal, Button } from "react-bootstrap";
import useItemMasterList from "../itemMasterList/useItemMasterList";

const ItemMasterDetail = ({ show, handleClose, itemMaster }) => {
  const { getStatusLabel, getStatusBadgeClass } = useItemMasterList();

  return (
    <Modal size="lg" show={show} onHide={handleClose} centered scrollable>
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
        </div>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Item name:</strong> {itemMaster?.itemName}
            </p>
            <p>
              <strong>Item code:</strong> {itemMaster?.itemCode}
            </p>
            <p>
              <strong>Item type:</strong> {itemMaster?.itemType?.name}
            </p>
            <p>
              <strong>Category:</strong> {itemMaster?.category?.categoryName}
            </p>
          </div>

          <div className="col-md-6">
            <p>
              <strong>Measurement Type:</strong>{" "}
              {itemMaster.unit?.measurementType?.name}
            </p>
            <p>
              <strong>Unit:</strong> {itemMaster.unit?.unitName}
            </p>
            <p>
              <strong>Unit Price:</strong> {itemMaster?.unitPrice || "N/A"}
            </p>
            <p>
              <strong>Reorder Level:</strong> {itemMaster?.reorderLevel}
            </p>
            <p>
              <strong>Hierarchy Type:</strong>{" "}
              {itemMaster.parentId !== itemMaster.itemMasterId
                ? "Sub Item"
                : "Main Item"}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mt-4">
            <h6>Item Master Price Details</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mt-3">
            <p>
              <strong>Cost Ratio: </strong>
              {itemMaster.costRatio}
            </p>
            <p>
              <strong>FOB in USD: </strong>
              {itemMaster.fobInUSD}
            </p>
            <p>
              <strong>Landed Cost: </strong>
              {itemMaster.landedCost}
            </p>
            <p>
              <strong>Min Net Selling Price: </strong>
              {itemMaster.minNetSellingPrice}
            </p>
            <p>
              <strong>Selling Price: </strong>
              {itemMaster.sellingPrice}
            </p>
            <p>
              <strong>Bulk Price: </strong>
              {itemMaster.bulkPrice}
            </p>
          </div>
          <div className="col-md-6 mt-3">
            <p>
              <strong>MRP: </strong>
              {itemMaster.mrp}
            </p>
            <p>
              <strong>Competitor Price: </strong>
              {itemMaster.competitorPrice}
            </p>
            <p>
              <strong>Label Price: </strong>
              {itemMaster.labelPrice}
            </p>
            <p>
              <strong>Average Selling Price: </strong>
              {itemMaster.averageSellingPrice}
            </p>
            <p>
              <strong>Stock Clearance: </strong>
              {itemMaster.stockClearance}
            </p>
          </div>
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

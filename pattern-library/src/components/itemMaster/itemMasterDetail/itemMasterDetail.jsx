import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import useItemMasterList from "../itemMasterList/useItemMasterList";

const ItemMasterDetail = ({ show, handleClose, itemMaster }) => {
  const { getStatusLabel, getStatusBadgeClass } = useItemMasterList();

  return (
    <Modal size="lg" show={show} onHide={handleClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Item Master Details</Modal.Title>
        <div className="ms-auto">
          <strong>{"Status: "}</strong>
          <span
            className={`badge rounded-pill ${getStatusBadgeClass(
              itemMaster.status
            )}`}
          >
            {getStatusLabel(itemMaster.status)}
          </span>
        </div>
      </Modal.Header>

      <Modal.Body>
        {/* General Info */}
        <div className="mb-3">
          <h6 className="text-primary">General Information</h6>
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td>
                  <strong>Item Master ID:</strong>
                </td>
                <td>{itemMaster.itemMasterId}</td>
              </tr>
              <tr>
                <td>
                  <strong>Created By:</strong>
                </td>
                <td>{itemMaster.createdBy}</td>
              </tr>
              <tr>
                <td>
                  <strong>Hierarchy Type:</strong>
                </td>
                <td>
                  {itemMaster.parentId !== itemMaster.itemMasterId
                    ? "Sub Item"
                    : "Main Item"}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Item Details */}
        <div className="mb-3">
          <h6 className="text-primary">Item Details</h6>
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td>
                  <strong>Item Name:</strong>
                </td>
                <td>{itemMaster?.itemName}</td>
              </tr>
              <tr>
                <td>
                  <strong>Item Code:</strong>
                </td>
                <td>{itemMaster?.itemCode}</td>
              </tr>
              <tr>
                <td>
                  <strong>Item Type:</strong>
                </td>
                <td>{itemMaster?.itemType?.name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Category:</strong>
                </td>
                <td>{itemMaster?.category?.categoryName}</td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Measurement & Pricing */}
        <div className="mb-3">
          <h6 className="text-primary">Measurement & Pricing</h6>
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td>
                  <strong>Measurement Type:</strong>
                </td>
                <td>{itemMaster.unit?.measurementType?.name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Unit:</strong>
                </td>
                <td>{itemMaster.unit?.unitName}</td>
              </tr>
              <tr>
                <td>
                  <strong>Reorder Level:</strong>
                </td>
                <td>{itemMaster?.reorderLevel}</td>
              </tr>
              <tr>
                <td>
                  <strong>Unit Price:</strong>
                </td>
                <td>{itemMaster.unitPrice}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default ItemMasterDetail;

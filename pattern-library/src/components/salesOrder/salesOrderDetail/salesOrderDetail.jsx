import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesOrderDetial from "./useSalesOrderDetail";
import useSalesOrderList from "../salesOrderList/useSalesOrderList";

const SalesOrderDetail = ({ show, handleClose, salesOrder }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesOrderList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sales Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Sales Order : {salesOrder.referenceNo}</h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                salesOrder.status
              )}`}
            >
              {getStatusLabel(salesOrder.status)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Created By:</strong> {salesOrder.createdBy}
            </p>
            <p>
              <strong>Order Type:</strong>{" "}
              {salesOrder.customerId !== null
                ? "Customer Order"
                : "Direct Order"}
            </p>
            {salesOrder.customerId !== null && (
              <>
                <p>
                  <strong>Customer Name:</strong>{" "}
                  {salesOrder.customer.customerName}
                </p>
                <p>
                  <strong>Contact Person:</strong>{" "}
                  {salesOrder.customer.contactPerson}
                </p>
                <p>
                  <strong>Phone:</strong> {salesOrder.customer.phone}
                </p>
                <p>
                  <strong>Email:</strong> {salesOrder.customer.email}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>Order Date:</strong>{" "}
              {salesOrder?.orderDate?.split("T")[0]}
            </p>
            <p>
              <strong>Delivery Date:</strong>{" "}
              {salesOrder?.deliveryDate?.split("T")[0]}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Batch Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {salesOrder.salesOrderDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemCategory}</td>
                <td>{item.itemId}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toFixed(2)}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"></td>
              <th>Total Amount</th>
              <td colSpan="2">{salesOrder.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesOrderDetail;

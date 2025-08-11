import React from "react";
import { Modal, Button } from "react-bootstrap";
import usePurchaseOrderDetial from "./usePurchaseOrderDetail";
import usePurchaseOrderList from "../PurchaseOrderList/usePurchaseOrderList";
import moment from "moment";
import "moment-timezone";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";

const PurchaseOrderDetail = ({ show, handleClose, purchaseOrder }) => {
  const { getStatusLabel, getStatusBadgeClass } = usePurchaseOrderList();
  const {
    calculateSubTotal,
    isLoading,
    isError,
    error,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
  } = usePurchaseOrderDetial(purchaseOrder);

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header>
        <Modal.Title>Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isError && <ErrorComponent error={"Error fetching data"} />}
        {isLoading && <LoadingSpinner maxHeight="65vh" />}
        {!isError && !isLoading && (
          <>
            <div className="mb-3 d-flex justify-content-between">
              <h6>Details for Purchase Order : {purchaseOrder.referenceNo}</h6>
              <div>
                Status :{" "}
                <span
                  className={`badge rounded-pill ${getStatusBadgeClass(
                    purchaseOrder.status
                  )}`}
                >
                  {getStatusLabel(purchaseOrder.status)}
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <strong>Supplier Name:</strong>{" "}
                  {purchaseOrder.supplier.supplierName}
                </p>
                <p>
                  <strong>Contact Person:</strong>{" "}
                  {purchaseOrder.supplier.contactPerson}
                </p>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {purchaseOrder.supplier.phone}
                </p>
                <p>
                  <strong>Email:</strong> {purchaseOrder.supplier.email}
                </p>
              </div>
              <div className="col-md-6">
                {purchaseOrder.status === 2 && (
                  <>
                    <p>
                      <strong>Approved By:</strong> {purchaseOrder.approvedBy}
                    </p>
                    <p>
                      <strong>Approved Date:</strong>{" "}
                      {moment
                        .utc(purchaseOrder?.approvedDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")}
                    </p>
                  </>
                )}
                <p>
                  <strong>Order Date:</strong>{" "}
                  {moment
                    .utc(purchaseOrder?.orderDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  <strong>Last Updated Date:</strong>{" "}
                  {moment
                    .utc(purchaseOrder?.lastUpdatedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </div>
            </div>

            <h6 className="text-info-emphasis">Item Details</h6>
            <div className="table-responsive mb-2">
              <table
                className="table mt-2"
                style={{ minWidth: "900px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    {uniqueLineItemDisplayNames.map((displayName, index) => {
                      // Find the charge/deduction associated with the current display name
                      const charge = lineItemChargesAndDeductions.find(
                        (charge) =>
                          charge.chargesAndDeduction.displayName === displayName
                      );

                      const sign =
                        charge && charge.chargesAndDeduction.sign
                          ? `${charge.chargesAndDeduction.sign}`
                          : "";
                      return (
                        <th key={index}>
                          {sign} {displayName}
                        </th>
                      );
                    })}
                    <th className="text-end">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.purchaseOrderDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemMaster?.itemName}</td>
                      <td>{item.itemMaster?.unit.unitName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice.toFixed(2)}</td>
                      {/* Render line item charges/deductions */}
                      {uniqueLineItemDisplayNames.map((displayName, idx) => {
                        const charge = lineItemChargesAndDeductions.find(
                          (charge) =>
                            charge.chargesAndDeduction.displayName ===
                              displayName &&
                            charge.lineItemId === item.itemMaster.itemMasterId
                        );

                        let renderedValue = "";
                        if (charge) {
                          let value = charge.appliedValue;
                          if (charge.chargesAndDeduction.sign === "-") {
                            // Remove the negative sign if present
                            value = Math.abs(value);
                          }

                          if (charge.chargesAndDeduction.percentage) {
                            // Calculate percentage value
                            const percentageValue =
                              (value / (item.unitPrice * item.quantity)) * 100;
                            renderedValue =
                              value.toFixed(2) +
                              ` (${percentageValue.toFixed(2)}
                              %)`;
                          } else {
                            renderedValue = value.toFixed(2);
                          }
                        }

                        return <td key={idx}>{renderedValue}</td>;
                      })}

                      <td className="text-end">{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3 + uniqueLineItemDisplayNames.length}></td>
                    <th>Sub Total</th>
                    <td className="text-end">
                      {calculateSubTotal().toFixed(2)}
                    </td>
                  </tr>
                  {/* Rendering common charges/deductions */}
                  {uniqueCommonDisplayNames.map((displayName, index) => {
                    // Filter charges/deductions that match the current display name and are not associated with a line item
                    const commonCharges = commonChargesAndDeductions.filter(
                      (charge) =>
                        charge.chargesAndDeduction.displayName ===
                          displayName && !charge.lineItemId
                    );

                    return commonCharges.map((charge, chargeIndex) => {
                      let renderedValue = Math.abs(charge.appliedValue).toFixed(
                        2
                      ); // Remove negative sign

                      // Check if the charge is percentage-based
                      if (charge.chargesAndDeduction.percentage) {
                        // Calculate percentage value based on subtotal
                        const percentageValue =
                          (renderedValue / calculateSubTotal()) * 100;

                        renderedValue =
                          renderedValue + ` (${percentageValue.toFixed(2)} %)`;
                      }

                      return (
                        <tr key={`${index}-${chargeIndex}`}>
                          <td
                            colSpan={3 + uniqueLineItemDisplayNames.length}
                          ></td>
                          <th>
                            {charge.chargesAndDeduction.sign}{" "}
                            {charge.chargesAndDeduction.displayName}
                          </th>
                          <td className="text-end">{renderedValue}</td>
                        </tr>
                      );
                    });
                  })}
                  <tr>
                    <td colSpan={3 + uniqueLineItemDisplayNames.length}></td>
                    <th>Total Amount</th>
                    <td className="text-end">
                      {purchaseOrder.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseOrderDetail;

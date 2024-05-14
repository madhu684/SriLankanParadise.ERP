import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesOrderApproval from "./useSalesOrderApproval";
import useSalesOrderList from "../salesOrderList/useSalesOrderList";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import moment from "moment";
import "moment-timezone";

const SalesOrderApproval = ({
  show,
  handleClose,
  handleApproved,
  salesOrder,
}) => {
  const {
    approvalStatus,
    isLoading,
    isError,
    error,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    loading,
    alertRef,
    isCompanyLoading,
    isCompanyError,
    company,
    renderSalesOrderDetails,
    handleApprove,
    calculateSubTotal,
  } = useSalesOrderApproval({
    onFormSubmit: () => {
      handleClose();
      handleApproved();
    },
    salesOrder,
  });
  const { getStatusLabel, getStatusBadgeClass } = useSalesOrderList();
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
      backdrop={!(loading || approvalStatus !== null) ? true : "static"}
      keyboard={!(loading || approvalStatus !== null)}
    >
      <Modal.Header closeButton={!(loading || approvalStatus !== null)}>
        <Modal.Title>Approve Sales Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isError && isCompanyError && (
          <ErrorComponent error={"Error fetching data"} />
        )}
        {isLoading && isCompanyLoading && <LoadingSpinner maxHeight="65vh" />}
        {!isError && !isLoading && !isCompanyLoading && (
          <>
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
            <div className="row mb-3">
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
                <p>
                  <strong>Created Date:</strong>{" "}
                  {moment
                    .utc(salesOrder?.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  <strong>Last Updated Date:</strong>{" "}
                  {moment
                    .utc(salesOrder?.lastUpdatedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </div>
            </div>

            <h6>Item Details</h6>
            <div className="table-responsive mb-2">
              <table
                className="table mt-2"
                style={{ minWidth: "1100px", overflowX: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit</th>
                    {company.batchStockType !== "FIFO" && <th>Batch Ref</th>}
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
                  {renderSalesOrderDetails().map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemBatch?.itemMaster?.itemName}</td>
                      <td>{item.itemBatch?.itemMaster?.unit.unitName}</td>
                      {company.batchStockType !== "FIFO" && (
                        <td>{item.itemBatch?.batch?.batchRef}</td>
                      )}
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice.toFixed(2)}</td>
                      {/* Render line item charges/deductions */}
                      {uniqueLineItemDisplayNames.map((displayName, idx) => {
                        const charge = lineItemChargesAndDeductions.find(
                          (charge) =>
                            charge.chargesAndDeduction.displayName ===
                              displayName &&
                            charge.lineItemId === item.itemBatchItemMasterId
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
                    <td
                      colSpan={
                        4 +
                        uniqueLineItemDisplayNames.length -
                        (company.batchStockType === "FIFO" ? 1 : 0)
                      }
                    ></td>
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
                            colSpan={
                              4 +
                              uniqueLineItemDisplayNames.length -
                              (company.batchStockType === "FIFO" ? 1 : 0)
                            }
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
                    <td
                      colSpan={
                        4 +
                        uniqueLineItemDisplayNames.length -
                        (company.batchStockType === "FIFO" ? 1 : 0)
                      }
                    ></td>
                    <th>Total Amount</th>
                    <td className="text-end">
                      {salesOrder.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
        <div ref={alertRef}></div>
        {approvalStatus === "approved" && (
          <div
            className="alert alert-success alert-dismissible fade show mb-3"
            role="alert"
          >
            Sales order approved!
          </div>
        )}
        {approvalStatus === "error" && (
          <div className="alert alert-danger mb-3" role="alert">
            Error approving sales order. Please try again.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading || approvalStatus !== null}
        >
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => handleApprove(salesOrder.salesOrderId)}
          disabled={loading || approvalStatus !== null}
        >
          {loading && approvalStatus === null ? (
            <ButtonLoadingSpinner text="Approving..." />
          ) : (
            "Approve"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesOrderApproval;

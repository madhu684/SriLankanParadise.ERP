import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesOrderDetail from "./useSalesOrderDetail";
import useSalesOrderList from "../salesOrderList/useSalesOrderList";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";
import useFormatCurrency from "../../salesInvoice/helperMethods/useFormatCurrency";

const SalesOrderDetail = ({ show, handleClose, salesOrder }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesOrderList();
  const {
    calculateSubTotal,
    isLoading,
    isError,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    isCompanyLoading,
    isCompanyError,
    company,
    renderSalesOrderDetails,
  } = useSalesOrderDetail(salesOrder);

  const formatTotals = useFormatCurrency({ showCurrency: false });

  const isDataLoading = isLoading || isCompanyLoading;
  const hasError = isError || isCompanyError;

  const formatDateTime = (date) =>
    moment.utc(date).tz("Asia/Colombo").format("YYYY-MM-DD hh:mm:ss A");

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="xl">
      <Modal.Header className="bg-light border-bottom">
        <Modal.Title className="fw-bold">Sales Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {hasError && <ErrorComponent error="Error fetching data" />}
        {isDataLoading && <LoadingSpinner maxHeight="65vh" />}
        {!hasError && !isDataLoading && (
          <>
            {/* Header Section */}
            <div className="mb-4 p-3 bg-light rounded border">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0 fw-bold text-primary">
                  Sales Order: {salesOrder.referenceNo}
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold">Status:</span>
                  <span
                    className={`badge rounded-pill fs-6 ${getStatusBadgeClass(
                      salesOrder.status
                    )}`}
                  >
                    {getStatusLabel(salesOrder.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="row g-4 mb-4">
              {/* Left Column - Order Information */}
              <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0 fw-semibold">
                      <i className="bi bi-file-text me-2"></i>Order Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Created By:</span>
                          <span className="fw-semibold text-end">
                            {salesOrder.createdBy}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Order Type:</span>
                          <span className="fw-semibold text-end">
                            <span className="badge bg-info text-dark">
                              {salesOrder.customerId !== null
                                ? "Customer Order"
                                : "Direct Order"}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Order Date:</span>
                          <span className="fw-semibold text-end">
                            {salesOrder?.orderDate?.split("T")[0]}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Delivery Date:</span>
                          <span className="fw-semibold text-end">
                            {salesOrder?.deliveryDate?.split("T")[0]}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Created Date:</span>
                          <span className="fw-semibold text-end small">
                            {formatDateTime(salesOrder?.createdDate)}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Last Updated Date:</span>
                          <span className="fw-semibold text-end small">
                            {formatDateTime(salesOrder?.lastUpdatedDate)}
                          </span>
                        </div>
                      </div>
                      {salesOrder.status === 2 && (
                        <>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span className="text-muted">Approved By:</span>
                              <span className="fw-semibold text-end">
                                {salesOrder.approvedBy}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span className="text-muted">Approved Date:</span>
                              <span className="fw-semibold text-end small">
                                {formatDateTime(salesOrder?.approvedDate)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Customer Details */}
              <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0 fw-semibold">
                      <i className="bi bi-person-circle me-2"></i>Customer
                      Details
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Customer Name:</span>
                          <span className="fw-semibold text-end">
                            {salesOrder.customer.customerName}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Contact Person:</span>
                          <span className="fw-semibold text-end">
                            {salesOrder.customer.contactPerson}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Phone:</span>
                          <span className="fw-semibold text-end">
                            {salesOrder.customer.phone}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Email:</span>
                          <span className="fw-semibold text-end text-break">
                            {salesOrder.customer.email}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">
                            Customer Po Number:
                          </span>
                          <span className="fw-semibold text-end text-break">
                            {salesOrder.customerPoNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table Section */}
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h6 className="mb-0 fw-semibold">
                  <i className="bi bi-list-ul me-2"></i>Item Details
                </h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-bordered mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Item Name</th>
                        <th className="fw-semibold">Unit</th>
                        {company.batchStockType !== "FIFO" && (
                          <th className="fw-semibold">Batch Ref</th>
                        )}
                        <th className="fw-semibold text-end">Quantity</th>
                        <th className="fw-semibold text-end">Unit Price</th>
                        {uniqueLineItemDisplayNames.map(
                          (displayName, index) => {
                            const charge = lineItemChargesAndDeductions.find(
                              (c) =>
                                c.chargesAndDeduction.displayName ===
                                displayName
                            );
                            const sign = charge?.chargesAndDeduction.sign || "";
                            return (
                              <th key={index} className="fw-semibold text-end">
                                {sign} {displayName}
                              </th>
                            );
                          }
                        )}
                        <th className="fw-semibold text-end">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderSalesOrderDetails().map((item, index) => (
                        <tr key={index}>
                          <td>{item?.itemMaster?.itemName}</td>
                          {/* <td>{item?.itemMaster?.unit.unitName}</td> */}
                          <td>
                            <span className="badge bg-light text-dark">
                              {item.itemMaster?.conversionRate} ml
                            </span>
                          </td>
                          {company.batchStockType !== "FIFO" && (
                            <td>{item.itemBatch?.batch?.batchRef}</td>
                          )}
                          <td className="text-end">
                            {formatTotals(item.quantity)}
                          </td>
                          <td className="text-end">
                            {formatTotals(item.unitPrice.toFixed(2))}
                          </td>
                          {uniqueLineItemDisplayNames.map(
                            (displayName, idx) => {
                              const charge = lineItemChargesAndDeductions.find(
                                (charge) =>
                                  charge.chargesAndDeduction.displayName ===
                                    displayName &&
                                  charge.lineItemId ===
                                    item.itemBatchItemMasterId
                              );

                              let renderedValue = "";
                              if (charge) {
                                let value = charge.appliedValue;
                                if (charge.chargesAndDeduction.sign === "-") {
                                  value = Math.abs(value);
                                }
                                if (
                                  charge.chargesAndDeduction.displayName ===
                                  "SSL"
                                ) {
                                  const percentageValue =
                                    (value /
                                      (value +
                                        item.unitPrice * item.quantity)) *
                                    100;
                                  renderedValue =
                                    formatTotals(value.toFixed(2)) +
                                    ` (${percentageValue.toFixed(2)}%)`;
                                } else if (
                                  charge.chargesAndDeduction.percentage !== null
                                ) {
                                  const percentageValue =
                                    (value / (item.unitPrice * item.quantity)) *
                                    100;
                                  renderedValue =
                                    formatTotals(value.toFixed(2)) +
                                    ` (${percentageValue.toFixed(2)}%)`;
                                } else {
                                  renderedValue = value.toFixed(2);
                                }
                              }

                              return (
                                <td key={idx} className="text-end">
                                  {renderedValue}
                                </td>
                              );
                            }
                          )}
                          <td className="text-end fw-semibold">
                            {formatTotals(item.totalPrice.toFixed(2))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-secondary">
                      <tr>
                        <td
                          colSpan={
                            4 +
                            uniqueLineItemDisplayNames.length -
                            (company.batchStockType === "FIFO" ? 1 : 0)
                          }
                          className="text-end"
                        ></td>
                        <th className="text-end">Sub Total</th>
                        <td className="text-end fw-bold">
                          {formatTotals(calculateSubTotal().toFixed(2))}
                        </td>
                      </tr>
                      {uniqueCommonDisplayNames.map((displayName, index) => {
                        const commonCharges = commonChargesAndDeductions.filter(
                          (charge) =>
                            charge.chargesAndDeduction.displayName ===
                              displayName && !charge.lineItemId
                        );

                        return commonCharges.map((charge, chargeIndex) => {
                          let renderedValue = Math.abs(
                            charge.appliedValue
                          ).toFixed(2);

                          if (charge.chargesAndDeduction.percentage) {
                            const percentageValue =
                              (renderedValue / calculateSubTotal()) * 100;
                            renderedValue =
                              formatTotals(renderedValue) +
                              ` (${percentageValue.toFixed(2)}%)`;
                          }

                          return (
                            <tr key={`${index}-${chargeIndex}`}>
                              <td
                                colSpan={
                                  4 +
                                  uniqueLineItemDisplayNames.length -
                                  (company.batchStockType === "FIFO" ? 1 : 0)
                                }
                                className="text-end"
                              ></td>
                              <th className="text-end">
                                {/* {charge.chargesAndDeduction.sign}{" "} */}
                                {charge.chargesAndDeduction.displayName}
                              </th>
                              <td className="text-end fw-semibold">
                                {renderedValue}
                              </td>
                            </tr>
                          );
                        });
                      })}
                      <tr className="table-primary">
                        <td
                          colSpan={
                            4 +
                            uniqueLineItemDisplayNames.length -
                            (company.batchStockType === "FIFO" ? 1 : 0)
                          }
                          className="text-end"
                        ></td>
                        <th className="text-end fs-6">Total Amount</th>
                        <td className="text-end fw-bold fs-6">
                          {formatTotals(salesOrder.totalAmount.toFixed(2))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesOrderDetail;

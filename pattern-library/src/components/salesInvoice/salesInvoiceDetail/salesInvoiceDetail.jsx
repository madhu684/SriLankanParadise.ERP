import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useSalesInvoiceDetial from "./useSalesInvoiceDetail";
import useSalesInvoiceList from "../salesInvoiceList/useSalesInvoiceList";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";
import InvoicePrintPreview from "../helperMethods/InvoiceePreview";
import useFormatCurrency from "../helperMethods/useFormatCurrency";

const SalesInvoiceDetail = ({ show, handleClose, salesInvoice }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSalesInvoiceList();
  const {
    isLoading,
    isError,
    error,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    isCompanyLoading,
    isCompanyError,
    company,
    showFullRemarks,
    renderSalesInvoiceDetails,
    calculateSubTotal,
    setShowFullRemarks,
  } = useSalesInvoiceDetial(salesInvoice);

  const formatTotals = useFormatCurrency({ showCurrency: false });

  // State for print preview modal
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const handleOpenPrintPreview = () => {
    setShowPrintPreview(true);
  };

  const handleClosePrintPreview = () => {
    setShowPrintPreview(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered scrollable size="xl">
        <Modal.Header className="bg-light border-bottom">
          <Modal.Title className="fw-bold">Sales Invoice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {isError && isCompanyError && (
            <ErrorComponent error={"Error fetching data"} />
          )}
          {isLoading && <LoadingSpinner maxHeight="65vh" />}
          {!isError && !isLoading && !isCompanyLoading && (
            <>
              {/* Header Section */}
              <div className="mb-4 p-3 bg-light rounded border">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h5 className="mb-0 fw-bold text-primary">
                    Invoice: {salesInvoice.referenceNo}
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold">Status:</span>
                    <span
                      className={`badge rounded-pill fs-6 ${getStatusBadgeClass(
                        salesInvoice.status
                      )}`}
                    >
                      {getStatusLabel(salesInvoice.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="row g-4 mb-4">
                {/* Left Column - Invoice Information */}
                <div className="col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0 fw-semibold">
                        <i className="bi bi-file-text me-2"></i>Invoice
                        Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Created By:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice.createdBy}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Created Date:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice?.createdDate.split("T")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Last Updated:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice?.lastUpdatedDate.split("T")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Remarks:
                            </span>
                            <span
                              className="fw-semibold text-end flex-grow-1 ms-2"
                              style={{ wordBreak: "break-word" }}
                            >
                              {showFullRemarks
                                ? salesInvoice?.remarks || "-"
                                : salesInvoice?.remarks?.length > 50
                                ? salesInvoice?.remarks.substring(0, 50) + "..."
                                : salesInvoice?.remarks || "-"}
                              {salesInvoice?.remarks?.length > 50 && (
                                <button
                                  className="btn btn-link btn-sm p-0 ms-2"
                                  onClick={() =>
                                    setShowFullRemarks(!showFullRemarks)
                                  }
                                >
                                  {showFullRemarks ? "Show less" : "Show more"}
                                </button>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Invoice Date:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice?.invoiceDate?.split("T")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Due Date:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice?.dueDate?.split("T")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Driver Name:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice?.driverName || "-"}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span
                              className="text-muted"
                              style={{ minWidth: "120px" }}
                            >
                              Vehicle No:
                            </span>
                            <span className="fw-semibold text-end flex-grow-1 ms-2">
                              {salesInvoice?.vehicleNumber || "-"}
                            </span>
                          </div>
                        </div>
                        {salesInvoice.status === 2 && (
                          <>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                                <span
                                  className="text-muted"
                                  style={{ minWidth: "120px" }}
                                >
                                  Approved By:
                                </span>
                                <span className="fw-semibold text-end flex-grow-1 ms-2">
                                  {salesInvoice.approvedBy || "-"}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                                <span
                                  className="text-muted"
                                  style={{ minWidth: "120px" }}
                                >
                                  Approved Date:
                                </span>
                                <span className="fw-semibold text-end flex-grow-1 ms-2">
                                  {salesInvoice?.approvedDate
                                    ? salesInvoice?.approvedDate.split("T")[0]
                                    : "-"}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Customer & Sales Order */}
                <div className="col-lg-6">
                  <div className="d-flex flex-column gap-3 h-100">
                    {/* Customer Card */}
                    <div className="card shadow-sm">
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
                              <span
                                className="text-muted"
                                style={{ minWidth: "130px" }}
                              >
                                Customer Name:
                              </span>
                              <span className="fw-semibold text-end flex-grow-1 ms-2">
                                {salesInvoice.customer.customerName}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span
                                className="text-muted"
                                style={{ minWidth: "130px" }}
                              >
                                Contact Person:
                              </span>
                              <span className="fw-semibold text-end flex-grow-1 ms-2">
                                {salesInvoice.customer.contactPerson}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span
                                className="text-muted"
                                style={{ minWidth: "130px" }}
                              >
                                Phone:
                              </span>
                              <span className="fw-semibold text-end flex-grow-1 ms-2">
                                {salesInvoice.customer.phone}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span
                                className="text-muted"
                                style={{ minWidth: "130px" }}
                              >
                                Region:
                              </span>
                              <span className="fw-semibold text-end flex-grow-1 ms-2">
                                {salesInvoice?.customer?.region
                                  ? salesInvoice?.customer?.region?.name
                                  : "-"}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span
                                className="text-muted"
                                style={{ minWidth: "130px" }}
                              >
                                Email:
                              </span>
                              <span className="fw-semibold text-end flex-grow-1 ms-2 text-break">
                                {salesInvoice.customer.email}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start">
                              <span
                                className="text-muted"
                                style={{ minWidth: "130px" }}
                              >
                                Delivery Address:
                              </span>
                              <span className="fw-semibold text-end flex-grow-1 ms-2">
                                {(() => {
                                  const deliveryAddress =
                                    salesInvoice.customer.customerDeliveryAddress.find(
                                      (cd) =>
                                        cd.id ===
                                        salesInvoice.customerDeliveryAddressId
                                    );
                                  return deliveryAddress ? (
                                    <div>
                                      <div>{deliveryAddress.addressLine1}</div>
                                      <div>{deliveryAddress.addressLine2}</div>
                                    </div>
                                  ) : (
                                    "No address found"
                                  );
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sales Order Card */}
                    {salesInvoice.salesOrder ? (
                      <div className="card shadow-sm">
                        <div className="card-header bg-info text-white d-flex align-items-center justify-content-between">
                          <h6 className="mb-0 fw-semibold">
                            <i className="bi bi-cart-check me-2"></i>Associated
                            Sales Order
                          </h6>
                          <h6 className="mb-0 fw-semibold">
                            {salesInvoice.salesOrder.referenceNo}
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                                <span
                                  className="text-muted"
                                  style={{ minWidth: "120px" }}
                                >
                                  Sales Person:
                                </span>
                                <span className="fw-semibold text-end flex-grow-1 ms-2">
                                  {salesInvoice.customer.salesPerson
                                    ? salesInvoice.customer.salesPerson
                                        .firstName +
                                      " " +
                                      salesInvoice.customer.salesPerson.lastName
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                                <span
                                  className="text-muted"
                                  style={{ minWidth: "120px" }}
                                >
                                  Order Date:
                                </span>
                                <span className="fw-semibold text-end flex-grow-1 ms-2">
                                  {salesInvoice.salesOrder.orderDate?.split(
                                    "T"
                                  )[0] ?? ""}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                                <span
                                  className="text-muted"
                                  style={{ minWidth: "120px" }}
                                >
                                  Delivery Date:
                                </span>
                                <span className="fw-semibold text-end flex-grow-1 ms-2">
                                  {salesInvoice.salesOrder.deliveryDate?.split(
                                    "T"
                                  )[0] ?? ""}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-start">
                                <span
                                  className="text-muted"
                                  style={{ minWidth: "120px" }}
                                >
                                  Customer PO Number:
                                </span>
                                <span className="fw-semibold text-end flex-grow-1 ms-2">
                                  <span className="badge bg-secondary">
                                    {salesInvoice.salesOrder.customerPoNumber ??
                                      ""}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="alert alert-warning d-flex align-items-center"
                        role="alert"
                      >
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>
                          This is a direct sales invoice with no associated
                          sales order.
                        </div>
                      </div>
                    )}
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
                          <th className="fw-semibold text-center">Unit</th>
                          {company.batchStockType !== "FIFO" && (
                            <th className="fw-semibold text-center">
                              Batch Ref
                            </th>
                          )}
                          <th className="fw-semibold text-center">Quantity</th>
                          <th className="fw-semibold text-end">Unit Price</th>
                          {uniqueLineItemDisplayNames.map(
                            (displayName, index) => {
                              const charge = lineItemChargesAndDeductions.find(
                                (charge) =>
                                  charge.chargesAndDeduction.displayName ===
                                  displayName
                              );
                              const sign =
                                charge && charge.chargesAndDeduction.sign
                                  ? `${charge.chargesAndDeduction.sign}`
                                  : "";
                              return (
                                <th
                                  key={index}
                                  className="fw-semibold text-end"
                                >
                                  {sign} {displayName}
                                </th>
                              );
                            }
                          )}
                          <th className="fw-semibold text-end">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderSalesInvoiceDetails().map((item, index) => (
                          <tr key={index}>
                            <td>{item.itemMaster?.itemName}</td>
                            <td className="text-center">
                              <span className="badge bg-light text-dark">
                                {item.itemMaster?.conversionRate} ml
                              </span>
                            </td>
                            {company.batchStockType !== "FIFO" && (
                              <td className="text-center">
                                {item.itemBatch?.batch?.batchRef}
                              </td>
                            )}
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">
                              {formatTotals(item.unitPrice.toFixed(2))}
                            </td>
                            {uniqueLineItemDisplayNames.map(
                              (displayName, idx) => {
                                const charge =
                                  lineItemChargesAndDeductions.find(
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
                                    charge.chargesAndDeduction.percentage !==
                                    null
                                  ) {
                                    const percentageValue =
                                      (value /
                                        (item.unitPrice * item.quantity)) *
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
                          const commonCharges =
                            commonChargesAndDeductions.filter(
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
                            {formatTotals(salesInvoice.totalAmount.toFixed(2))}
                          </td>
                        </tr>
                        <tr className="table-info">
                          <td
                            colSpan={
                              4 +
                              uniqueLineItemDisplayNames.length -
                              (company.batchStockType === "FIFO" ? 1 : 0)
                            }
                            className="text-end"
                          ></td>
                          <th className="text-end">Total Litres</th>
                          <td className="text-end fw-bold">
                            {formatTotals(salesInvoice.totalLitres.toFixed(2))}
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
          {!isLoading &&
            !isError &&
            !isCompanyLoading &&
            salesInvoice.status === 2 && (
              <Button
                variant="primary"
                onClick={handleOpenPrintPreview}
                className="px-4 me-2"
              >
                <i className="bi bi-printer me-2"></i>
                Print Preview
              </Button>
            )}
          <Button variant="secondary" onClick={handleClose} className="px-4">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Print Preview Modal */}
      {showPrintPreview && !isLoading && !isCompanyLoading && (
        <InvoicePrintPreview
          salesInvoice={salesInvoice}
          charges={commonChargesAndDeductions}
          company={company}
          show={showPrintPreview}
          handleClose={handleClosePrintPreview}
        />
      )}
    </>
  );
};

export default SalesInvoiceDetail;

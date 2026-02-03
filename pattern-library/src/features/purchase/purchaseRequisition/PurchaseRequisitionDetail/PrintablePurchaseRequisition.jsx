import React from "react";
import moment from "moment";
import "moment-timezone";
import ayu_logo from "assets/images/ayu_logo.png";

const PrintablePurchaseRequisition = React.forwardRef(({ purchaseRequisition }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: "20px 30px",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div style={{ width: "120px", marginRight: "20px" }}>
            <img
              src={ayu_logo}
              alt="Logo"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 3px 0",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Ayu Lanka
            </h3>
            <p style={{ margin: "2px 0", fontSize: "10px", lineHeight: "1.3" }}>
              No 185/C, Dalupitiya Road,
              <br />
              Enderamulla, Wattala
              <br />
              Tel: +94 112 985 885 / +94 115 995 885
              <br />
              Email: info@ayulankamedical.com
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", fontWeight: "bold" }}>
              PURCHASE REQUISITION
            </h4>
            <p style={{ margin: "2px 0", fontSize: "10px" }}>
              <strong>ID</strong> : {purchaseRequisition?.purchaseRequisitionId}
            </p>
            <p style={{ margin: "2px 0", fontSize: "10px" }}>
              <strong>Date</strong> :{" "}
              {purchaseRequisition?.requisitionDate
                ? moment(purchaseRequisition.requisitionDate).format("DD-MMM-YYYY")
                : "N/A"}
            </p>
             <p style={{ margin: "2px 0", fontSize: "10px" }}>
              <strong>Ref No</strong> : {purchaseRequisition?.referenceNo || "N/A"}
            </p>
          </div>
        </div>

        {/* Requisition Info */}
        <div
          style={{
            borderTop: "2px solid #000",
            borderBottom: "2px solid #000",
            padding: "8px 0",
            marginTop: "10px",
            marginBottom: "15px",
          }}
        >
          <table style={{ width: "100%", fontSize: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "20%", padding: "2px 0" }}>
                  <strong>Requested By</strong>
                </td>
                <td style={{ width: "30%", padding: "2px 0" }}>
                  {purchaseRequisition?.requestedBy || "N/A"}
                </td>
                <td style={{ width: "20%", padding: "2px 0" }}>
                  <strong>Department</strong>
                </td>
                <td style={{ width: "30%", padding: "2px 0" }}>
                  {purchaseRequisition?.departmentNavigation?.locationName || "N/A"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0" }}>
                  <strong>Expected Date</strong>
                </td>
                <td style={{ padding: "2px 0" }}>
                  {purchaseRequisition?.expectedDeliveryDate
                    ? moment(purchaseRequisition.expectedDeliveryDate).format("DD-MMM-YYYY")
                    : "N/A"}
                </td>
                <td style={{ padding: "2px 0" }}>
                  <strong>Delivery Location</strong>
                </td>
                <td style={{ padding: "2px 0" }}>
                  {purchaseRequisition?.expectedDeliveryLocationNavigation?.locationName || "N/A"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0" }}>
                  <strong>Supplier</strong>
                </td>
                <td colSpan="3" style={{ padding: "2px 0" }}>
                   {purchaseRequisition?.supplier?.supplierName || "No Supplier tagged"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0" }}>
                  <strong>Purpose</strong>
                </td>
                <td colSpan="3" style={{ padding: "2px 0" }}>
                   {purchaseRequisition?.purposeOfRequest || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
          fontSize: "10px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #000", backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "8px 5px", textAlign: "left", width: "5%" }}>#</th>
            <th style={{ padding: "8px 5px", textAlign: "left", width: "45%" }}>Item Description</th>
            <th style={{ padding: "8px 5px", textAlign: "center", width: "10%" }}>Unit</th>
            <th style={{ padding: "8px 5px", textAlign: "right", width: "10%" }}>Qty</th>
            <th style={{ padding: "8px 5px", textAlign: "right", width: "15%" }}>Unit Price</th>
            <th style={{ padding: "8px 5px", textAlign: "right", width: "15%" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {purchaseRequisition?.purchaseRequisitionDetails?.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px dashed #ccc" }}>
              <td style={{ padding: "6px 5px", textAlign: "left" }}>{index + 1}</td>
              <td style={{ padding: "6px 5px", textAlign: "left" }}>
                {item.itemMaster?.itemName || "N/A"}
              </td>
              <td style={{ padding: "6px 5px", textAlign: "center" }}>
                {item.itemMaster?.unit?.unitName || "N/A"}
              </td>
              <td style={{ padding: "6px 5px", textAlign: "right" }}>
                {item.quantity}
              </td>
              <td style={{ padding: "6px 5px", textAlign: "right" }}>
                {item.unitPrice.toFixed(2)}
              </td>
              <td style={{ padding: "6px 5px", textAlign: "right" }}>
                {item.totalPrice.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold", borderTop: "1px solid #000" }}>
            <td colSpan="5" style={{ padding: "8px 5px", textAlign: "right" }}>
              Total Amount
            </td>
            <td style={{ padding: "8px 5px", textAlign: "right" }}>
              {purchaseRequisition?.totalAmount?.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer / Signatures */}
      <div style={{ marginTop: "50px" }}>
        <table style={{ width: "100%", fontSize: "10px" }}>
          <tbody>
            <tr>
              <td style={{ width: "33%", textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto", paddingTop: "5px" }}>
                  Requested By
                </div>
              </td>
              <td style={{ width: "33%", textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto", paddingTop: "5px" }}>
                  Authorized By
                </div>
              </td>
              <td style={{ width: "33%", textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto", paddingTop: "5px" }}>
                  Approved By
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center", fontSize: "9px", color: "#666" }}>
        <p>This is a computer generated document. No signature is required.</p>
        <p>Printed on: {moment().format("DD-MMM-YYYY hh:mm A")}</p>
      </div>
    </div>
  );
});

PrintablePurchaseRequisition.displayName = "PrintablePurchaseRequisition";

export default PrintablePurchaseRequisition;














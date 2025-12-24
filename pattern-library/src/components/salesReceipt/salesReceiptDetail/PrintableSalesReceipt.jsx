import React from "react";
import moment from "moment";
import "moment-timezone";
import ayu_logo from "../../../assets/images/ayu_logo.png";

const PrintableSalesReceipt = React.forwardRef(({ salesReceipt }, ref) => {
  // Collect all items from all invoices in the receipt
  const allItems = [];
  let itemCounter = 1;
  let totalItemsPrice = 0;

  salesReceipt?.salesReceiptSalesInvoices?.forEach((receiptInvoice) => {
    receiptInvoice.salesInvoice?.salesInvoiceDetails?.forEach((detail) => {
      const netPrice = detail.totalPrice || 0;
      totalItemsPrice += netPrice;

      allItems.push({
        sno: itemCounter++,
        itemName: detail.itemMaster?.itemName || "N/A",
        quantity: detail.quantity || 0,
        unitPrice: detail.unitPrice || 0,
        netPrice: netPrice,
      });
    });
  });

  // Calculate invoice total amount (after discount)
  const invoiceTotalAmount =
    salesReceipt?.salesReceiptSalesInvoices?.reduce(
      (sum, item) => sum + (item.salesInvoice?.totalAmount || 0),
      0
    ) || 0;

  // Calculate total discount (difference between items subtotal and invoice total)
  const totalDiscount = totalItemsPrice - invoiceTotalAmount;

  const settledAmount =
    salesReceipt?.salesReceiptSalesInvoices?.reduce(
      (sum, item) => sum + (item.settledAmount || 0),
      0
    ) || 0;
  const outstandingAmount = salesReceipt?.outstandingAmount || 0;

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
            alignItems: "center", // Align items to center vertically
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
            <p style={{ margin: "2px 0", fontSize: "10px" }}>
              <strong>Pharmacy</strong> :{" "}
              {salesReceipt?.referenceNumber || "N/A"}
            </p>
            <p style={{ margin: "2px 0", fontSize: "10px" }}>
              <strong>B.Date</strong> :{" "}
              {salesReceipt?.receiptDate
                ? moment(salesReceipt.receiptDate).format("DD-MMM-YYYY h:mm a")
                : "N/A"}
            </p>
            <p
              style={{ margin: "2px 0", fontSize: "10px", fontWeight: "bold" }}
            >
              PHARMACY OP
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div
          style={{
            borderTop: "2px solid #000",
            borderBottom: "2px solid #000",
            padding: "5px 0",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <table style={{ width: "100%", fontSize: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "15%", padding: "2px 0" }}>
                  <strong>UHID</strong>
                </td>
                <td style={{ width: "35%", padding: "2px 0" }}>
                  {salesReceipt?.salesReceiptSalesInvoices
                    ?.map((check) => check.salesInvoice?.referenceNo)
                    .filter((refNo) => refNo)
                    .join(", ") || "N/A"}
                </td>
                <td style={{ width: "15%", padding: "2px 0" }}>
                  <strong>Name</strong>
                </td>
                <td style={{ width: "35%", padding: "2px 0" }}>
                  {salesReceipt?.salesReceiptSalesInvoices?.[0]?.salesInvoice
                    ?.inVoicedPersonName || "N/A"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0" }}>
                  <strong>Doctor</strong>
                </td>
                <td colSpan="3" style={{ padding: "2px 0" }}>
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
          marginBottom: "10px",
          fontSize: "10px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px dashed #000" }}>
            <th style={{ padding: "5px 3px", textAlign: "left", width: "8%" }}>
              Sno
            </th>
            <th style={{ padding: "5px 3px", textAlign: "left", width: "47%" }}>
              Item Name
            </th>
            <th
              style={{ padding: "5px 3px", textAlign: "right", width: "15%" }}
            >
              Qty
            </th>
            <th
              style={{ padding: "5px 3px", textAlign: "right", width: "15%" }}
            >
              UnitPrice
            </th>
            <th
              style={{ padding: "5px 3px", textAlign: "right", width: "15%" }}
            >
              NetPrice
            </th>
          </tr>
        </thead>
        <tbody>
          {allItems.length > 0 ? (
            allItems.map((item, index) => (
              <tr
                key={index}
                style={{
                  borderBottom:
                    index === allItems.length - 1 ? "1px dashed #000" : "none",
                }}
              >
                <td style={{ padding: "5px 3px", textAlign: "left" }}>
                  {item.sno}
                </td>
                <td style={{ padding: "5px 3px", textAlign: "left" }}>
                  {item.itemName}
                </td>
                <td style={{ padding: "5px 3px", textAlign: "right" }}>
                  {item.quantity % 1 === 0
                    ? item.quantity
                    : item.quantity.toFixed(2)}
                </td>
                <td style={{ padding: "5px 3px", textAlign: "right" }}>
                  {item.unitPrice.toFixed(2)}
                </td>
                <td style={{ padding: "5px 3px", textAlign: "right" }}>
                  {item.netPrice.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginTop: "10px", fontSize: "10px" }}>
        <table
          style={{
            width: "100%",
            marginLeft: "auto",
            maxWidth: "300px",
            float: "right",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "3px 10px", textAlign: "left" }}>
                Total Bill Amt
              </td>
              <td
                style={{
                  padding: "3px 10px",
                  textAlign: "right",
                  borderBottom: "1px solid #000",
                }}
              >
                {totalItemsPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "3px 10px", textAlign: "left" }}>
                Discount
              </td>
              <td style={{ padding: "3px 10px", textAlign: "right" }}>
                {totalDiscount.toFixed(2)}
              </td>
            </tr>
            <tr style={{ fontWeight: "bold" }}>
              <td
                style={{
                  padding: "3px 10px",
                  textAlign: "left",
                  //borderTop: "1px solid #000",
                }}
              >
                Net Amount
              </td>
              <td
                style={{
                  padding: "3px 10px",
                  textAlign: "right",
                  borderTop: "1px solid #000",
                }}
              >
                {invoiceTotalAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "3px 10px", textAlign: "left" }}>
                Settled Amount
              </td>
              <td style={{ padding: "3px 10px", textAlign: "right" }}>
                {settledAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "3px 10px", textAlign: "left" }}>
                Outstanding Amount
              </td>
              <td
                style={{
                  padding: "3px 10px",
                  textAlign: "right",
                  borderBottom: "3px double #000",
                }}
              >
                {outstandingAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ clear: "both" }}></div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid #000",
            paddingBottom: "2px",
            marginBottom: "2px",
          }}
        >
          <div
            style={{ fontSize: "12px", fontWeight: "bold", paddingLeft: "5px" }}
          >
            24 hour services
          </div>
          <div style={{ textAlign: "center", paddingRight: "5px" }}>
            <div style={{ height: "30px" }}>
              {/* Signature space */}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                // borderTop: "1px solid #000",
                minWidth: "100px",
                display: "inline-block",
              }}
            >
              Pharmacist
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "10px",
            lineHeight: "1.2",
            paddingTop: "2px",
          }}
        >
          <div style={{ marginBottom: "2px" }}>
            Note: 1. DRUG ONCE SOLD WILL NOT BE TAKEN BACK OR EXCHANGED.
          </div>
          <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
            Ayu Lanka Hospital
          </div>
          <div
            style={{
              fontFamily: '"Nirmala UI", "Segoe UI", sans-serif', // Fallback for Sinhala/Tamil
              fontSize: "10px",
              marginBottom: "5px",
            }}
          >
            සුවෙන් සැපෙන් • CARING CURING • பராமரித்தல் குணமாக்கல்
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 5px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            <div>Revision No :01</div>
            <div>LH-CP-02</div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableSalesReceipt.displayName = "PrintableSalesReceipt";

export default PrintableSalesReceipt;

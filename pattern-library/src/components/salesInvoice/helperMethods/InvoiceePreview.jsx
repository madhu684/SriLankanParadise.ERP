import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { FaPrint, FaEye, FaWindowClose } from "react-icons/fa";
import useNumberToWords from "./useNumberToWords";
import useFormatCurrency from "./useFormatCurrency";

const InvoicePrintPreview = ({
  salesInvoice,
  charges,
  company,
  show,
  handleClose,
}) => {
  const componentRef = useRef(null);
  const numberToWords = useNumberToWords();

  const formatTotals = useFormatCurrency({ showCurrency: false });

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${salesInvoice?.referenceNumber || "TEMP"}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0mm;
      }
      @media print {
        body { 
          margin: 0; 
          padding: 0; 
        }
        .no-print, .invoice-container ~ * { 
          display: none !important; 
        }
        .invoice-container {
          width: 210mm;
          height: auto;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          position: absolute;
          top: 0;
          left: 0;
          border: none !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }
        * {
          font-family: 'Courier New', monospace !important;
          font-size: 10pt !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        table, th, td {
          border-collapse: collapse !important;
          border: 1px solid black !important;
          page-break-inside: avoid;
        }
        tr { 
          page-break-inside: avoid; 
        }
      }
    `,
  });

  if (!show) return null;

  const calculateSubTotal = () => {
    return salesInvoice.salesInvoiceDetails.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  };

  const subTotal = calculateSubTotal();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with buttons */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: "bold" }}>
            Invoice Print Preview
          </h5>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handlePrint}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <FaPrint size={18} />
              Print Invoice
            </button>
            <button
              onClick={handleClose}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                backgroundColor: "transparent",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <FaWindowClose size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
            backgroundColor: "#e9ecef",
          }}
        >
          {/* Invoice Container */}
          <div
            ref={componentRef}
            //className="invoice-container"
            style={{
              backgroundColor: "white",
              maxWidth: "210mm",
              margin: "0 auto",
              padding: "15px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <div style={{ border: "2px solid black", padding: "8px" }}>
              {/* Company Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div style={{ width: "60px", flexShrink: 0 }}>
                  {/* Logo placeholder */}
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                    }}
                  >
                    LOGO
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h1
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
                    ABL Beverages International Limited
                  </h1>
                  <p
                    style={{
                      fontSize: "11px",
                      fontStyle: "italic",
                      margin: "2px 0",
                      textAlign: "center",
                    }}
                  >
                    House of Finest Wines & Spirits
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                  >
                    No. 24, Fairfield Gardens, Colombo 8, Sri Lanka
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                  >
                    Tel: 011 267 9146 Fax: 011 267 9149 Email:
                    sales@adlbeverages.com Web: www.adlbeverages.com
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                  >
                    Warehouse: No. 65, Keshewa Road, Boralesgamuwa
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                  >
                    Company Reg. No: PB 4922
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                  >
                    VAT Reg: 134049227-7000
                  </p>
                </div>
                <div
                  style={{ width: "80px", flexShrink: 0, textAlign: "right" }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {salesInvoice.referenceNo}
                  </div>
                  <div style={{ fontSize: "10px", marginTop: "75px" }}>
                    <span className="fw-bold">Customer Copy</span>
                  </div>
                </div>
              </div>

              {/* INVOICE Title */}
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderTop: "2px solid black",
                  borderBottom: "2px solid black",
                  padding: "6px",
                  margin: "8px 0",
                }}
              >
                INVOICE
              </h2>

              {/* Customer Info */}
              <div
                style={{ display: "flex", fontSize: "10px", marginTop: "5px" }}
              >
                <div
                  style={{
                    flex: 1,
                    border: "1px solid black",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "1px solid black",
                      padding: "3px 0 0 0",
                    }}
                  >
                    <strong>Bill To</strong>
                  </div>
                  <div style={{ minHeight: "60px", padding: "5px 0" }}>
                    <p style={{ margin: "2px 0" }}>
                      {salesInvoice.customer.customerName}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                      {salesInvoice.customer.billingAddressLine1 +
                        ", " +
                        salesInvoice.customer.billingAddressLine2}
                    </p>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid black",
                      borderBottom: "1px solid black",
                      padding: "3px 0 0 0",
                    }}
                  >
                    <strong>Deliver To</strong>
                  </div>
                  <div style={{ minHeight: "40px", padding: "5px 0" }}>
                    <p style={{ margin: "2px 0" }}>
                      {(() => {
                        const deliveryAddress =
                          salesInvoice.customer.customerDeliveryAddress.find(
                            (cd) =>
                              cd.id === salesInvoice.customerDeliveryAddressId
                          );
                        return deliveryAddress
                          ? `${deliveryAddress.addressLine1}, ${deliveryAddress.addressLine2}`
                          : "No address found";
                      })()}
                    </p>
                  </div>
                </div>
                {/* Invoice Info Table */}
                <div style={{ width: "180px", paddingLeft: "10px" }}>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "10px",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontWeight: "bold",
                          }}
                        >
                          Date
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {new Date().toISOString().split("T")[0]}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontWeight: "bold",
                          }}
                        >
                          VAT No.
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        ></td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontWeight: "bold",
                          }}
                        >
                          Invoice No.
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {salesInvoice.referenceNo}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontWeight: "bold",
                          }}
                        >
                          Order No.
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        ></td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontWeight: "bold",
                          }}
                        >
                          Delivery No.
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        ></td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            fontWeight: "bold",
                          }}
                        >
                          Driver Name/ Vehicle No.
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {salesInvoice.driverName || ""} <br />
                          {salesInvoice.vehicleNumber || " "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table
              style={{
                width: "100%",
                marginTop: "8px",
                border: "2px solid black",
                fontSize: "9px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "30px",
                    }}
                  >
                    NO
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "80px",
                    }}
                  >
                    PRODUCT
                    <br />
                    CODE
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                    }}
                  >
                    DESCRIPTION
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "40px",
                    }}
                  >
                    PACK
                    <br />
                    SIZE
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "50px",
                    }}
                  >
                    NO.OF
                    <br />
                    BOTTLE
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "50px",
                    }}
                  >
                    TOTAL
                    <br />
                    ML
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "60px",
                    }}
                  >
                    UNIT
                    <br />
                    PRICE
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "80px",
                    }}
                  >
                    AMOUNT (LKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesInvoice.salesInvoiceDetails.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td style={{ border: "1px solid black", padding: "3px" }}>
                      {item.itemMaster?.itemCode}
                    </td>
                    <td style={{ border: "1px solid black", padding: "3px" }}>
                      {item.itemMaster?.itemName}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      {formatTotals(item.itemMaster?.conversionRate)}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px",
                        textAlign: "right",
                      }}
                    >
                      {formatTotals(
                        item.itemMaster?.conversionRate * item.quantity
                      )}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px",
                        textAlign: "right",
                      }}
                    >
                      {formatTotals(item.unitPrice.toFixed(2))}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {formatTotals(item.totalPrice.toFixed(2))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom Section */}
            <div
              style={{ display: "flex", marginTop: "8px", fontSize: "10px" }}
            >
              <div style={{ flex: 1, paddingRight: "10px" }}>
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    border: "2px solid black",
                    padding: "5px",
                    backgroundColor: "#FFF4CC",
                  }}
                >
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                    TOTAL LITRES:
                  </p>
                  <p
                    style={{
                      margin: "2px 0",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    {numberToWords(salesInvoice.totalLitres.toFixed(2))}
                  </p>
                </div>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "8px 0 5px 0",
                    fontSize: "11px",
                  }}
                >
                  All cheques should be drawn in favour of ABL Beverages
                  International Limited.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "50px",
                  }}
                >
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        borderTop: "1px dotted black",
                        paddingTop: "5px",
                        marginTop: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      Authorized by
                    </div>
                  </div>
                  <div className="px-2"></div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        borderTop: "1px dotted black",
                        paddingTop: "5px",
                        marginTop: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      Checked by
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ width: "190px" }}>
                <table
                  style={{
                    width: "100%",
                    border: "2px solid black",
                    borderCollapse: "collapse",
                    fontSize: "10px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "4px" }}>
                        Sub Total
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {formatTotals(subTotal.toFixed(2))}
                      </td>
                    </tr>
                    {charges.map((charge, index) => {
                      const value = Math.abs(charge.appliedValue);
                      const percentage = charge.chargesAndDeduction.percentage
                        ? ((value / subTotal) * 100).toFixed(2)
                        : null;

                      return (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "4px",
                            }}
                          >
                            {charge.chargesAndDeduction.displayName}
                            {percentage && ` (${percentage}%)`}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "4px",
                              textAlign: "right",
                            }}
                          >
                            {charge.chargesAndDeduction.sign === "+"
                              ? "+"
                              : "-"}
                            {value.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{ backgroundColor: "#FFF4CC" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        TOTAL VALUE
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        {formatTotals(salesInvoice.totalAmount.toFixed(2))}
                      </td>
                    </tr>
                    {/* <tr style={{ backgroundColor: "#FFF4CC" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        TOTAL LITRES
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        {salesInvoice.totalLitres.toFixed(2)}
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "12px",
                border: "2px solid black",
                fontSize: "9px",
              }}
            >
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid black",
                    padding: "8px",
                    borderBottom: "1px solid black",
                    height: "80px",
                  }}
                ></div>
                <div
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid black",
                    padding: "8px",
                    borderBottom: "1px solid black",
                    height: "80px",
                  }}
                ></div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    borderBottom: "1px solid black",
                    height: "80px",
                  }}
                ></div>
              </div>
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid black",
                    padding: "8px",
                  }}
                >
                  <p style={{ fontWeight: "bold", margin: 0 }}>
                    Contact Person / Number
                  </p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid black",
                    padding: "8px",
                  }}
                >
                  <p style={{ fontWeight: "bold", margin: 0 }}>
                    Name and Designation
                  </p>
                </div>
                <div style={{ textAlign: "center", padding: "8px" }}>
                  <p style={{ fontWeight: "bold", margin: 0 }}>
                    Signature & Rubber Stamp
                  </p>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "6px",
                  borderTop: "1px solid black",
                }}
              >
                <p className="fw-bold" style={{ margin: 0, fontSize: "9px" }}>
                  Received the above mentioned goods in order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        {/* <style>{`
          @media print {
            body { margin: 0; padding: 0; }
            .no-print, .invoice-container ~ * { display: none !important; }
            .invoice-container {
              width: 210mm;
              height: auto;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              position: absolute;
              top: 0;
              left: 0;
              border: none !important;
            }
            @page {
              size: auto;
              margin: 0mm;
            }
            * {
              font-family: 'Courier New', monospace !important;
              font-size: 10pt !important;
              color: black !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table, th, td {
              border-collapse: collapse !important;
              border: 1px solid black !important;
              page-break-inside: avoid;
            }
            tr { page-break-inside: avoid; }
          }
          .invoice-container { font-family: 'Courier New', monospace; }
        `}</style> */}
      </div>
    </div>
  );
};

export default InvoicePrintPreview;

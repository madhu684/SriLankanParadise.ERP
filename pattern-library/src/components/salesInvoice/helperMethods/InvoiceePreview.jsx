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
                    ABEYWARDANA DISTRIBUTORS (PVT) LTD
                  </h1>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                    className="fw-semibold"
                  >
                    No. 89/4, Stanley Thilakaratne Mw, Nugegoda, Sri Lanka
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                    className="fw-semibold"
                  >
                    Tel: 011 2699797 Email: sales@adlbeverages.com Web:
                    www.adlbeverages.com
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                    className="fw-semibold"
                  >
                    Warehouse: No.189/2, Stanley Thilakaratne Mw, Nugegoda, Sri
                    Lanka
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                    className="fw-semibold"
                  >
                    VAT REG NO - 114201863 - 7000
                  </p>
                  <p
                    style={{
                      fontSize: "9px",
                      margin: "1px 0",
                      textAlign: "center",
                    }}
                    className="fw-semibold"
                  >
                    Reg. No. PV 6751
                  </p>
                </div>
                <div
                  style={{ width: "80px", flexShrink: 0, textAlign: "right" }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      marginTop: "80px",
                      marginRight: "5px",
                    }}
                  >
                    <span className="fw-bold">Customer Copy</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div
                style={{
                  display: "flex",
                  fontSize: "10px",
                  marginTop: "5px",
                  alignItems: "stretch",
                }}
              >
                {/* Left Table - Customer Info */}
                <div style={{ flex: 1, display: "flex", paddingLeft: "1px" }}>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "10px",
                      borderCollapse: "collapse",
                      border: "2px solid black",
                      height: "100%",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            width: "35%",
                            backgroundColor: "#f8f8f8",
                            height: "38px",
                          }}
                        >
                          CUSTOMER CODE
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            height: "38px",
                          }}
                          className="fw-semibold"
                        >
                          {salesInvoice?.customer ? (
                            <>
                              {`${salesInvoice.customer.customerCode}`} -{" "}
                              <span className="text-uppercase">
                                {salesInvoice.customer.isVATRegistered === true
                                  ? "VAT INVOICE"
                                  : "INVOICE"}
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            backgroundColor: "#f8f8f8",
                            verticalAlign: "top",
                          }}
                        >
                          INVOICED TO
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            verticalAlign: "top",
                          }}
                        >
                          <div>
                            <div style={{ margin: "0" }}>
                              {salesInvoice.customer.customerName}
                            </div>
                            <div style={{ margin: "4px 0 0 0" }}>
                              {salesInvoice.customer.billingAddressLine1 +
                                ", " +
                                salesInvoice.customer.billingAddressLine2}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            backgroundColor: "#f8f8f8",
                            verticalAlign: "top",
                            height: "38px",
                          }}
                        >
                          DELIVERED TO
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            verticalAlign: "top",
                            height: "38px",
                          }}
                        >
                          <div>
                            <div style={{ margin: "0" }}>
                              {(() => {
                                const deliveryAddress =
                                  salesInvoice.customer.customerDeliveryAddress.find(
                                    (cd) =>
                                      cd.id ===
                                      salesInvoice.customerDeliveryAddressId
                                  );
                                return deliveryAddress
                                  ? `${deliveryAddress.addressLine1}, ${deliveryAddress.addressLine2}`
                                  : "No address found";
                              })()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Table - Invoice Info */}
                <div
                  style={{
                    width: "260px",
                    display: "flex",
                    paddingLeft: "10px",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      fontSize: "10px",
                      borderCollapse: "collapse",
                      border: "2px solid black",
                      height: "100%",
                    }}
                  >
                    <tbody>
                      <tr style={{ height: "38px" }}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            width: "50%",
                            backgroundColor: "#f8f8f8",
                            height: "38px",
                          }}
                        >
                          INVOICE NO.
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            color: "#dc3545",
                            height: "38px",
                          }}
                        >
                          {salesInvoice.referenceNo}
                        </td>
                      </tr>
                      <tr style={{ height: "38px" }}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            backgroundColor: "#f8f8f8",
                            height: "38px",
                          }}
                        >
                          INVOICE DATE
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            height: "38px",
                          }}
                        >
                          {salesInvoice.invoiceDate.split("T")[0] || ""}
                        </td>
                      </tr>
                      <tr style={{ height: "38px" }}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            backgroundColor: "#f8f8f8",
                            height: "38px",
                          }}
                        >
                          PO. NO.
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            height: "38px",
                          }}
                        >
                          {salesInvoice.salesOrder.customerPoNumber || ""}
                        </td>
                      </tr>
                      <tr style={{ height: "38px" }}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            fontWeight: "bold",
                            backgroundColor: "#f8f8f8",
                            height: "38px",
                          }}
                        >
                          CUSTOMER VAT NO.
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "8px 10px",
                            height: "38px",
                          }}
                        >
                          {salesInvoice.customer.vatRegistrationNo || ""}
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
              <div
                style={{
                  flex: 1,
                  paddingRight: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    border: "2px solid black",
                    padding: "5px",
                    backgroundColor: "#FFF4CC",
                  }}
                >
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                    Quantity Issued in ml:
                  </p>
                  <p
                    style={{
                      margin: "2px 0",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    {formatTotals((salesInvoice.totalLitres * 1000).toFixed(2))}
                  </p>
                </div>

                <div
                  style={{
                    border: "2px solid black",
                    borderTop: "none",
                    padding: "6px 8px",
                    backgroundColor: "#FFF4CC",
                    fontWeight: "bold",
                    textAlign: "left",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  Please Make Payment In Favour Of
                  <br />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      paddingTop: "4px",
                    }}
                  >
                    "ABEYWARDANA DISTRIBUTORS (PVT) LTD"
                  </span>
                </div>
              </div>

              <div style={{ width: "230px" }}>
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

                    {charges.length > 0 ? (
                      charges.map((charge, index) => {
                        const value = Math.abs(charge.appliedValue);
                        return (
                          <tr key={index}>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "4px",
                              }}
                            >
                              {charge.chargesAndDeduction.displayName}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "4px",
                                textAlign: "right",
                              }}
                            >
                              {formatTotals(value.toFixed(2))}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "4px",
                          }}
                        >
                          VAT
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "4px",
                            textAlign: "right",
                          }}
                        ></td>
                      </tr>
                    )}

                    <tr>
                      <td
                        style={{ border: "1px solid black", padding: "4px" }}
                      ></td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "right",
                          height: "18px",
                        }}
                      ></td>
                    </tr>

                    <tr style={{ backgroundColor: "#FFF4CC" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          fontWeight: "bold",
                          fontSize: "8.5px",
                        }}
                      >
                        TOTAL INVOICE VALUE
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
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "12px",
                fontFamily: "Arial, sans-serif",
                fontSize: "9px",
                color: "black",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "2px solid black",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="2"
                      style={{
                        border: "1px solid black",
                        padding: "6px 8px",
                        width: "70%",
                      }}
                    >
                      <strong>THIS INVOICE SHOULD BE SETTLED ON</strong>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "6px 8px",
                        width: "15%",
                      }}
                    >
                      <strong>Current Balance</strong>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "6px 8px",
                        width: "15%",
                      }}
                    >
                      <strong>
                        {/* {salesInvoice?.customer?.outstandingAmount || "0.00"} */}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        height: "35px",
                        width: "25%",
                      }}
                    >
                      <strong>Prepared and Issued by</strong>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        height: "35px",
                        width: "25%",
                      }}
                    ></td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      <strong>Driver’s Signature</strong>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        height: "35px",
                      }}
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        verticalAlign: "top",
                      }}
                    >
                      <div>
                        Received above goods in correct quantity and in good
                        condition
                      </div>
                      <div style={{ marginTop: "10px" }}>Name/Designation</div>
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    ></td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      <strong>Vehicle No</strong>
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {salesInvoice?.vehicleNumber || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      rowSpan="2"
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        height: "35px",
                      }}
                    >
                      <strong>Signature & Rubber Stamp</strong>
                    </td>
                    <td
                      rowSpan="2"
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    ></td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      <strong>Security Officer</strong>
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    ></td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      <strong>Manager’s Signature</strong>
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    ></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        border: "1px solid black",
                        padding: "6px 8px",
                        fontSize: "9px",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <strong>Serial No</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
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

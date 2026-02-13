import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaWindowClose } from "react-icons/fa";
import moment from "moment";
import "moment-timezone";
import logo from "../../../assets/images/ADL_logo.jpeg";

const GrnPrintPreview = ({
  grn,
  getStatusLabel,
  grnTypeDisplayMap,
  show,
  handleClose,
}) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `GRN_${grn?.custDekNo || "TEMP"}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        body { 
          margin: 0; 
          padding: 0; 
        }
        .no-print, .grn-container ~ * { 
          display: none !important; 
        }
        .grn-container {
          width: 100% !important;
          height: auto;
          margin: 0 !important;
          padding: 10mm !important;
          box-shadow: none !important;
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
        table {
          border-collapse: collapse !important;
          border: 1px solid black !important;
          page-break-inside: avoid;
          overflow: visible !important;
          border-radius: 0 !important;
        }
        th, td {
          border: 1px solid black !important;
          overflow: visible !important;
          border-radius: 0 !important;
        }
        div {
          overflow: visible !important;
          border-radius: 0 !important;
        }
        tr { 
          page-break-inside: avoid; 
        }
      }
    `,
  });

  if (!show) return null;

  const totalReceived = grn.grnDetails.reduce(
    (sum, item) => sum + (item.receivedQuantity || 0),
    0,
  );

  const totalRejected = grn.grnDetails.reduce(
    (sum, item) => sum + (item.rejectedQuantity || 0),
    0,
  );

  const totalFree = grn.grnDetails.reduce(
    (sum, item) => sum + (item.freeQuantity || 0),
    0,
  );

  const sellableQuantity = totalReceived + totalFree - totalRejected;

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
          <h5 style={{ margin: 0, fontWeight: "bold" }}>GRN Print Preview</h5>
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
              Print GRN
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
          {/* GRN Container */}
          <div
            ref={componentRef}
            className="grn-container"
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
                <div style={{ width: "120px", flexShrink: 0 }}>
                  <img
                    src={logo}
                    alt="ADL Logo"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "110px",
                      display: "block",
                    }}
                  />
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
                  style={{ width: "120px", flexShrink: 0, textAlign: "right" }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {grn?.custDekNo || "N/A"}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "black", marginTop: "2px" }}>
                    {grn?.grnReferenceNo || ""}
                  </div>
                </div>
              </div>

              {/* GOOD RECEIVE NOTE Title */}
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
                GOOD RECEIVED NOTE
              </h2>

              {/* GRN Info */}
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
                    <strong>Warehouse Information</strong>
                  </div>
                  <div style={{ minHeight: "60px", padding: "5px 0" }}>
                    <p style={{ margin: "2px 0" }}>
                      <strong>Location:</strong>{" "}
                      {grn?.warehouseLocation?.locationName || "N/A"}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                      <strong>GRN Type:</strong>{" "}
                      {grnTypeDisplayMap[grn?.grnType] || "N/A"}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                      <strong>Status:</strong> {getStatusLabel(grn.status)}
                    </p>
                  </div>
                  {grn?.purchaseOrder?.referenceNo && (
                    <>
                      <div
                        style={{
                          borderTop: "1px solid black",
                          borderBottom: "1px solid black",
                          padding: "3px 0 0 0",
                        }}
                      >
                        <strong>Purchase Order</strong>
                      </div>
                      <div style={{ minHeight: "40px", padding: "5px 0" }}>
                        <p style={{ margin: "2px 0" }}>
                          <strong>Reference No:</strong>{" "}
                          {grn.purchaseOrder.referenceNo}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {/* GRN Info Table */}
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
                          GRN Date
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {grn?.grnDate?.split("T")[0]}
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
                          Received Date
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {grn?.receivedDate?.split("T")[0]}
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
                          Received By
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {grn.receivedBy || "N/A"}
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
                          Created Date
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "3px" }}
                        >
                          {moment
                            .utc(grn?.createdDate)
                            .tz("Asia/Colombo")
                            .format("YYYY-MM-DD")}
                        </td>
                      </tr>
                      {parseInt(grn.status.toString().charAt(1), 10) === 2 && (
                        <>
                          <tr>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "3px",
                                fontWeight: "bold",
                              }}
                            >
                              Approved By
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "3px",
                              }}
                            >
                              {grn.approvedBy || "N/A"}
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
                              Approved Date
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "3px",
                              }}
                            >
                              {moment
                                .utc(grn?.approvedDate)
                                .tz("Asia/Colombo")
                                .format("YYYY-MM-DD")}
                            </td>
                          </tr>
                        </>
                      )}
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
                    }}
                  >
                    ITEM NAME
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "50px",
                    }}
                  >
                    UNIT
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "60px",
                    }}
                  >
                    RECEIVED
                    <br />
                    QTY
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "60px",
                    }}
                  >
                    REJECTED
                    <br />
                    QTY
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "60px",
                    }}
                  >
                    FREE
                    <br />
                    QTY
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "70px",
                    }}
                  >
                    EXPIRY
                    <br />
                    DATE
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px",
                      textAlign: "center",
                      width: "70px",
                    }}
                  >
                    UNIT
                    <br />
                    PRICE
                  </th>
                </tr>
              </thead>
              <tbody>
                {grn.grnDetails.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
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
                        {item.item?.itemName}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.item?.unit.unitName}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.receivedQuantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.rejectedQuantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.freeQuantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.expiryDate.split("T")[0]}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "3px",
                          textAlign: "right",
                        }}
                      >
                        {item.unitPrice.toFixed(2)}
                      </td>
                    </tr>
                    {parseFloat(item.rejectedQuantity) > 0 && (
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            border: "1px solid black",
                            padding: "3px",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <strong>Rejection Reason:</strong>{" "}
                          {item.rejectedReason || "N/A"}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Bottom Section */}
            <div
              style={{ display: "flex", marginTop: "8px", fontSize: "10px" }}
            >
              <div style={{ flex: 1, paddingRight: "10px" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "8px 0 5px 0",
                    fontSize: "11px",
                  }}
                >
                  All goods received are subject to inspection and quality
                  verification.
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
                      Received by
                    </div>
                  </div>
                  <div style={{ width: "20px" }}></div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        borderTop: "1px dotted black",
                        paddingTop: "5px",
                        marginTop: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      Approved by
                    </div>
                  </div>
                  <div style={{ width: "20px" }}></div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        borderTop: "1px dotted black",
                        paddingTop: "5px",
                        marginTop: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      Authorized Signature
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
                        Total Items
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {grn.grnDetails.length}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "4px" }}>
                        Total Received
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {totalReceived}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "4px" }}>
                        Total Rejected
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {totalRejected}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "4px" }}>
                        Total Free
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {totalFree}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#90EE90" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        TOTAL SELLABLE
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
                        {sellableQuantity}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Note */}
            <div
              style={{
                marginTop: "12px",
                border: "2px solid black",
                padding: "8px",
                textAlign: "center",
                fontSize: "9px",
              }}
            >
              <p style={{ fontWeight: "bold", margin: 0 }}>
                This is a computer generated document. No signature required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrnPrintPreview;

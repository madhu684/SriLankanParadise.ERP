import React from "react";
import { Modal, Button } from "react-bootstrap";
import LoadingSpinner from "../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../errorComponent/errorComponent";
import useSupplierReturnList from "../supplierReturnList/useSupplierReturnList";
import moment from "moment";
import "moment-timezone";

const SupplierReturnDetail = ({ show, handleClose, supplyReturnMaster }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSupplierReturnList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header>
        <Modal.Title>Supplier Return</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {supplyReturnMaster && (
          <>
            <div className="mb-3 d-flex justify-content-between">
              <h6>
                Details for Supplier Return : {supplyReturnMaster.referenceNo}
              </h6>
              <div>
                Status :{" "}
                <span
                  className={`badge rounded-pill ${getStatusBadgeClass(
                    supplyReturnMaster.status
                  )}`}
                >
                  {getStatusLabel(supplyReturnMaster.status)}
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <strong>Return Type:</strong>{" "}
                  {supplyReturnMaster.returnType === "creditNote"
                    ? "Credit Note"
                    : "Good Receive Note"}
                </p>
                {supplyReturnMaster.supplierId !== null && (
                  <>
                    <p>
                      <strong>Supplier Name:</strong>{" "}
                      {supplyReturnMaster.supplier.supplierName}
                    </p>
                    <p>
                      <strong>Contact Person:</strong>{" "}
                      {supplyReturnMaster.supplier.contactPerson}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {supplyReturnMaster.supplier.phone}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {supplyReturnMaster.supplier.email}
                    </p>
                  </>
                )}
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Created By:</strong> {supplyReturnMaster.returnedBy}
                </p>
                <p>
                  <strong>Return Date:</strong>{" "}
                  {supplyReturnMaster?.returnDate?.split("T")[0]}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {moment
                    .utc(supplyReturnMaster?.createdDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                <p>
                  <strong>Last Updated Date:</strong>{" "}
                  {moment
                    .utc(supplyReturnMaster?.lastUpdatedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
                {supplyReturnMaster.status === 2 && (
                  <>
                    <p>
                      <strong>Approved By:</strong>{" "}
                      {supplyReturnMaster.approvedBy}
                    </p>
                    <p>
                      <strong>Approved Date:</strong>{" "}
                      {moment
                        .utc(supplyReturnMaster?.approvedDate)
                        .tz("Asia/Colombo")
                        .format("YYYY-MM-DD hh:mm:ss A")}
                    </p>
                  </>
                )}
              </div>
            </div>

            <h6>Item Details</h6>
            <div className="table-responsive mb-2">
              <table className="table mt-2" style={{ overflowY: "auto" }}>
                <thead>
                  <th>Item Name</th>
                  <th>Batch</th>
                  <th>Unit</th>
                  <th>Return Quantity</th>
                </thead>
                <tbody>
                  {supplyReturnMaster.supplyReturnDetails ? (
                    supplyReturnMaster.supplyReturnDetails.map((item) => (
                      <tr key={item.supplyReturnDetailId}>
                        <td>{item.itemMaster.itemName}</td>
                        <td>{item.batch.batchRef}</td>
                        <td>{item.itemMaster.unit.unitName}</td>
                        <td>{item.returnedQuantity.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <div></div>
                  )}
                </tbody>
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

export default SupplierReturnDetail;

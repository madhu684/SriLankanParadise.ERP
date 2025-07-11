import React from "react";
import useSupplierReturnList from "../supplierReturnList/useSupplierReturnList";
import { Button, Modal } from "react-bootstrap";
import ErrorComponent from "../../errorComponent/errorComponent";
import moment from "moment";
import "moment-timezone";
import ButtonLoadingSpinner from "../../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import useSupplierReturnApprove from "./useSupplierReturnApprove";

const SupplierReturnApprove = ({ show, handleClose, supplyReturnMaster }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSupplierReturnList();

  const { approvalStatus, loading, alertRef, handleApprove } =
    useSupplierReturnApprove({
      onFormSubmit: () => {
        handleClose();
      },
    });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="lg"
      centered
      scrollable
    >
      <Modal.Header>
        <Modal.Title>Approve Supply Return</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!supplyReturnMaster && (
          <ErrorComponent error={"Error fetching data"} />
        )}
        <>
          <div className="d-flex justify-content-between mb-3">
            <h6>
              Details for Supply Return : {supplyReturnMaster.referenceNo}
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
                <strong>Supplier Name:</strong>{" "}
                {supplyReturnMaster.supplier?.supplierName}
              </p>
              <p>
                <strong>Contact Person:</strong>{" "}
                {supplyReturnMaster.supplier?.contactPerson}
              </p>
              <p>
                <strong>Phone:</strong> {supplyReturnMaster.supplier.phone}
              </p>
              <p>
                <strong>Email:</strong> {supplyReturnMaster.supplier.email}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Return Type:</strong>{" "}
                {supplyReturnMaster.retunrType === "creditNote"
                  ? "Credit Note"
                  : "Good Receive Note"}
              </p>
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
            </div>

            <h6>Item Details</h6>
            <div className="table-responsive mb-2">
              <table className="table mt-2" style={{ overflowY: "auto" }}>
                <thead>
                  <th>Item Name</th>
                  <th>Batch</th>
                  <th>Unit</th>
                  <th>Return Quantity</th>
                  <th>Warehouse</th>
                </thead>
                <tbody>
                  {supplyReturnMaster.supplyReturnDetails ? (
                    supplyReturnMaster.supplyReturnDetails.map((item) => (
                      <tr key={item.supplyReturnDetailId}>
                        <td>{item.itemMaster.itemName}</td>
                        <td>{item.batch.batchRef}</td>
                        <td>{item.itemMaster.unit.unitName}</td>
                        <td>{item.returnedQuantity.toFixed(2)}</td>
                        <td>{item.location.locationName}</td>
                      </tr>
                    ))
                  ) : (
                    <div></div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
        </>
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
          onClick={() => handleApprove(supplyReturnMaster)}
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

export default SupplierReturnApprove;

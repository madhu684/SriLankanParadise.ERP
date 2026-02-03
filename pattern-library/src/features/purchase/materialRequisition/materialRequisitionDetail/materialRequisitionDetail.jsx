import { React } from "react";
import useMaterialRequisitionDetial from "./useMaterialRequisitionDetail";
import { Modal, Button, Form } from "react-bootstrap";
import useMaterialRequisitionList from "features/purchase/materialRequisition/materialRequisitionList/useMaterialRequisitionList";
import moment from "moment";
import "moment-timezone";

const MaterialRequisitionDetail = ({
  show,
  handleClose,
  materialRequisition,
}) => {
  const { getStatusLabel, getStatusBadgeClass } = useMaterialRequisitionList();
  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Material Requisition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>
            Details for Material Requisition Ref Number:{" "}
            {materialRequisition.referenceNumber}
          </h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                materialRequisition.status
              )}`}
            >
              {getStatusLabel(materialRequisition.status)}
            </span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Requested By:</strong> {materialRequisition.requestedBy}
            </p>
            <p>
              <strong>Requisition Date:</strong>{" "}
              {moment
                .utc(materialRequisition?.requisitionDate)
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD hh:mm:ss A")}
            </p>
            <p>
              <strong>Purpose of Request:</strong>{" "}
              {materialRequisition.purposeOfRequest}
            </p>
            {materialRequisition.status === 2 && (
              <>
                <p>
                  <strong>Approved By:</strong> {materialRequisition.approvedBy}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {moment
                    .utc(materialRequisition?.approvedDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </>
            )}
          </div>
          <div className="col-md-6">
            <p>
              <strong>Delivery Location:</strong>{" "}
              {materialRequisition.requestedToLocation?.locationName}
            </p>
            <p>
              <strong>Requested From:</strong>{" "}
              {materialRequisition.requestedFromLocation?.locationName}
            </p>
          </div>
        </div>

        <h6>Item Details</h6>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Requested Quantity</th>
            </tr>
          </thead>
          <tbody>
            {materialRequisition.requisitionDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.itemMaster.itemName}</td>
                <td>{item.itemMaster.unit.unitName}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaterialRequisitionDetail;














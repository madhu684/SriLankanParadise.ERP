import React from "react";
import { Modal, Button } from "react-bootstrap";
import useSupplierDetial from "./useSupplierDetail";
import useSupplierList from "../supplierList/useSupplierList";
import moment from "moment";
import "moment-timezone";
import LoadingSpinner from "../../../loadingSpinner/loadingSpinner";
import ErrorComponent from "../../../errorComponent/errorComponent";
import { API_BASE_URL } from "../../../../services/purchaseApi";

const SupplierDetail = ({ show, handleClose, supplier }) => {
  const { getStatusLabel, getStatusBadgeClass } = useSupplierList();

  const { isLoadingSupplierLogo, isSupplierLogoError, supplierLogo } =
    useSupplierDetial(supplier);

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-between">
          <h6>Details for Supplier ID: {supplier.supplierId}</h6>
          <div>
            Status :{" "}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(
                supplier.status
              )}`}
            >
              {getStatusLabel(supplier.status)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="d-flex">
            {isSupplierLogoError && (
              <ErrorComponent
                error={"Error fetching supplier logo"}
                maxHeight="10vh"
              />
            )}
            {isLoadingSupplierLogo && <LoadingSpinner maxHeight="10vh" />}
            {!isSupplierLogoError && !isLoadingSupplierLogo && (
              <div>
                <img
                  src={supplierLogo}
                  alt="Supplier Logo"
                  style={{ maxWidth: "100px", marginRight: "10px" }}
                />
              </div>
            )}
            <div>
              <h4>{supplier.supplierName}</h4>{" "}
              <small className="text-muted">
                {supplier.addressLine1 + ", " + supplier.addressLine2}
              </small>{" "}
              <div className="rating-stars mt-2">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  const fillPercentage = (supplier.rating - index) * 100;
                  const starFill = fillPercentage >= 100 ? 100 : fillPercentage;
                  return (
                    <span key={index}>
                      <svg
                        key={index}
                        className="bi bi-star-fill"
                        width="1.6em"
                        height="1.6em"
                        viewBox="0 0 20 20"
                        fill={"var(--bs-gray-300)"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                        />
                        <defs>
                          <linearGradient
                            id={`fill-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset={`${starFill}%`}
                              style={{ stopColor: "gold" }}
                            />
                            <stop
                              offset={`${starFill}%`}
                              style={{ stopColor: "transparent" }}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          fill={`url(#fill-${index})`}
                          fillRule="evenodd"
                          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                        />
                      </svg>{" "}
                    </span>
                  );
                })}
                <span className="rating-number" style={{ fontSize: "1.0rem" }}>
                  {"  "}
                  {supplier?.rating?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <p>Basic Information</p>
            <p>
              <strong>Supplier name:</strong> {supplier.supplierName}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {supplier.addressLine1 + ", " + supplier.addressLine2}
            </p>
            <p>
              <strong>Contact Person:</strong> {supplier.contactPerson}
            </p>
            <p>
              <strong>Mobile Number:</strong> {supplier.phone}
            </p>
            <p>
              <strong>Office contact number:</strong> {supplier.officeContactNo}
            </p>
            <p>
              <strong>Email Address:</strong> {supplier.email}
            </p>
            <p>
              <strong>Categories:</strong> <br />
              {supplier.supplierCategories?.map((category, index) => (
                <span key={index} className="badge bg-primary me-1">
                  {category?.category?.categoryName}
                </span>
              ))}
            </p>
          </div>
          <div className="col-md-6">
            <p>Business Information</p>
            <p>
              <strong>Business Registration No:</strong>{" "}
              {supplier.businessRegistrationNo}
            </p>
            <p>
              <strong>VAT Registration No:</strong>{" "}
              {supplier?.vatregistrationNo}
            </p>
            <p>
              <strong>Company Type:</strong> {supplier?.companyType?.typeName}
            </p>
            <p>
              <strong>Nature of Business:</strong>{" "}
              {supplier?.businessType?.typeName}
            </p>
            <p>
              <strong>Remarks:</strong> {supplier?.remarks}
            </p>
          </div>
          <div>
            <strong>Attachments:</strong>
            <div className="list-group mt-2 mb-3">
              {supplier.supplierAttachments?.length === 0 ? (
                <p className="list-group-item list-group-item-action text-muted">
                  No attachments found
                </p>
              ) : (
                supplier.supplierAttachments?.map((attachment, index) => {
                  // Split the attachment path by the directory separator
                  const parts = attachment.attachmentPath.split("\\");
                  // Extract the last part, which is the file name
                  const fileName = parts[parts.length - 1];

                  return (
                    <a
                      key={index}
                      href={`${API_BASE_URL}/supplierAttachment/attachment/${attachment.supplierAttachmentId}`} // Replace '/' with the appropriate URL prefix
                      className="list-group-item list-group-item-action"
                      target="_blank" // Open link in a new tab
                    >
                      <i
                        className="bi bi-file-earmark-text text-info"
                        style={{ marginRight: "0.5rem" }}
                      ></i>

                      {fileName}
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between text-muted ">
          <small>
            Created -{" "}
            {moment
              .utc(supplier?.createdDate)
              .tz("Asia/Colombo")
              .format("YYYY-MM-DD hh:mm:ss A")}
          </small>
          <small>
            Last Updated -{" "}
            {moment
              .utc(supplier?.lastUpdatedDate)
              .tz("Asia/Colombo")
              .format("YYYY-MM-DD hh:mm:ss A")}
          </small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierDetail;

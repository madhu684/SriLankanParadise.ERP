import React from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendar,
  FaUserCircle,
} from "react-icons/fa";

const SalesPersonDetail = ({ show, salesPerson, handleClose }) => {
  const getStatusLabel = (status) => (status === true ? "Active" : "Inactive");
  const getStatusBadgeClass = (status) =>
    status === true ? "success" : "danger";

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose} centered scrollable>
      <Modal.Header className="border-bottom bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <Modal.Title className="mb-1 text-dark d-flex align-items-center gap-2">
              <FaUserCircle className="text-primary" />
              Sales Person Details
            </Modal.Title>
            <small className="text-muted">
              ID: {salesPerson.salesPersonId || "N/A"}
            </small>
          </div>
          <div className="d-flex flex-column text-start">
            <small className="text-dark d-block fw-semibold">Status</small>
            <Badge
              bg={getStatusBadgeClass(salesPerson.isActive)}
              className="px-3 py-2 mt-2"
            >
              {getStatusLabel(salesPerson.isActive)}
            </Badge>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="bg-light p-4">
        {/* Personal Information Section */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-primary text-white py-2">
            <h6 className="mb-0 fw-semibold">
              <FaUser className="me-2" />
              Personal Information
            </h6>
          </div>
          <div className="card-body p-3">
            <div className="row g-3">
              {/* Sales Person Code */}
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <div
                    className="bg-light rounded p-2 me-3"
                    style={{ minWidth: "40px" }}
                  >
                    <FaIdCard className="text-primary" size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">
                      Sales Person Code
                    </small>
                    <p className="mb-0 fw-semibold text-dark">
                      {salesPerson.salesPersonCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <div
                    className="bg-light rounded p-2 me-3"
                    style={{ minWidth: "40px" }}
                  >
                    <FaUser className="text-primary" size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">Full Name</small>
                    <p className="mb-0 fw-semibold text-dark">
                      {salesPerson.firstName && salesPerson.lastName
                        ? `${salesPerson.firstName} ${salesPerson.lastName}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">
                      First Name
                    </small>
                    <p className="mb-0 fw-semibold text-dark">
                      {salesPerson.firstName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Name */}
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">Last Name</small>
                    <p className="mb-0 fw-semibold text-dark">
                      {salesPerson.lastName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-info text-white py-2">
            <h6 className="mb-0 fw-semibold">
              <FaPhone className="me-2" />
              Contact Information
            </h6>
          </div>
          <div className="card-body p-3">
            <div className="row g-3">
              {/* Email */}
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <div
                    className="bg-light rounded p-2 me-3"
                    style={{ minWidth: "40px" }}
                  >
                    <FaEnvelope className="text-info" size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">
                      Email Address
                    </small>
                    <p className="mb-0 fw-semibold text-dark">
                      {salesPerson.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Number */}
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <div
                    className="bg-light rounded p-2 me-3"
                    style={{ minWidth: "40px" }}
                  >
                    <FaPhone className="text-info" size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">
                      Contact Number
                    </small>
                    <p className="mb-0 fw-semibold text-dark">
                      {salesPerson.contactNo || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information Section */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-secondary text-white py-2">
            <h6 className="mb-0 fw-semibold">
              <FaCalendar className="me-2" />
              System Information
            </h6>
          </div>
          <div className="card-body p-3">
            <div className="row g-3">
              {/* Created Date */}
              <div className="col-12">
                <small className="text-muted d-block mb-1">Created Date</small>
                <p className="mb-0 fw-semibold text-dark">
                  {formatDateTime(salesPerson.createdDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-white border-top">
        <div className="d-flex justify-content-end align-items-center w-100 gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesPersonDetail;

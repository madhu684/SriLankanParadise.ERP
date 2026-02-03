import moment from "moment";
import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
} from "react-bootstrap";
import {
  FaBox,
  FaChartLine,
  FaDollarSign,
  FaInfoCircle,
  FaLayerGroup,
} from "react-icons/fa";

const CustomerView = ({ show, handleClose, customer }) => {
  const getStatusLabel = (status) => (status === 1 ? "Active" : "Inactive");
  const getStatusBadgeClass = (status) => (status === 1 ? "success" : "danger");

  const formatCurrency = (value) => {
    // if (!value) return "N/A";
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const InfoCard = ({ icon: Icon, title, children, variant = "light" }) => (
    <Card className="h-100 shadow-sm border-start border-3 border-primary">
      <Card.Header className="bg-light">
        <div className="d-flex align-items-center">
          <Icon className="text-primary me-2" size={18} />
          <h6 className="mb-0 fw-semibold text-dark">{title}</h6>
        </div>
      </Card.Header>
      <Card.Body className="p-3">{children}</Card.Body>
    </Card>
  );

  const InfoRow = ({ label, value, highlight = false }) => (
    <div
      className={`d-flex justify-content-between align-items-center py-2 ${
        highlight ? "bg-primary bg-opacity-10 px-2 rounded" : ""
      }`}
    >
      <small className="text-muted fw-medium">{label}:</small>
      <span
        className={`small ${highlight ? "fw-bold text-primary" : "text-dark"}`}
      >
        {value || "N/A"}
      </span>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, variant }) => (
    <Card className={`text-white bg-${variant} border-0 h-100`}>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-white-50">{label}</small>
            <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
              {value}
            </div>
          </div>
          <Icon size={24} className="text-white-50" />
        </div>
      </Card.Body>
    </Card>
  );
  return (
    <Modal
      size="xl"
      show={show}
      onHide={handleClose}
      centered
      scrollable
      className="item-master-modal"
    >
      <Modal.Header className="border-bottom">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <Modal.Title className="mb-1 text-dark">
              Customer Details
            </Modal.Title>
            <small className="text-dark">
              Customer Type:{" "}
              <span className="fw-semibold">
                {customer?.customerType === "patient"
                  ? "Patient"
                  : "Sales Customer"}
              </span>
            </small>
          </div>
          <div className="d-flex flex-column text-start">
            <small className="text-dark d-block">Status</small>
            <Badge
              bg={getStatusBadgeClass(customer.status)}
              className="px-3 py-2 mt-2"
            >
              {getStatusLabel(customer.status)}
            </Badge>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="bg-light p-4">
        <Container fluid>
          {/* Basic Info and Specifications */}
          <Row className="mb-4">
            <Col lg={6} className="mb-3">
              <InfoCard
                icon={FaInfoCircle}
                title="Basic Information"
                variant="info"
              >
                <div>
                  <InfoRow
                    label="Customer Name"
                    value={customer?.customerName}
                  />
                  <InfoRow
                    label="Customer Code"
                    value={customer?.customerCode}
                  />
                  <InfoRow
                    label="Contact Person"
                    value={customer?.contactPerson}
                  />
                  <InfoRow label="Phone Number" value={customer?.phone} />
                </div>
                <InfoRow label="Email" value={customer?.email} />
                <InfoRow
                  label="Billing Address"
                  value={
                    customer?.billingAddressLine1 &&
                    customer?.billingAddressLine2
                      ? `${customer.billingAddressLine1}, ${customer.billingAddressLine2}`
                      : "N/A"
                  }
                />
                <InfoRow
                  label="Created Date"
                  value={
                    customer?.createdDate
                      ? moment(customer?.createdDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : "N/A"
                  }
                />
              </InfoCard>
            </Col>

            <Col lg={6} className="mb-3">
              <InfoCard
                icon={FaBox}
                title="Business Information"
                variant="success"
              >
                <div>
                  <InfoRow
                    label="License Number"
                    value={customer?.lisenNumber}
                  />
                  <InfoRow
                    label="License Period"
                    value={
                      customer?.lisenStartDate && customer?.lisenEndDate
                        ? `${customer.lisenStartDate.split("T")[0]} - ${
                            customer.lisenEndDate.split("T")[0]
                          }`
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Credit Limit"
                    highlight={true}
                    value={formatCurrency(customer?.creditLimit)}
                  />
                  <InfoRow
                    label="Credit Duration"
                    value={
                      customer?.creditDuration !== null
                        ? customer?.creditDuration + " days"
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Outstanding Amount"
                    highlight={true}
                    value={formatCurrency(customer?.outstandingAmount)}
                  />
                  <InfoRow
                    label="Business Registration No"
                    value={customer?.businessRegistrationNo}
                  />
                  {customer?.isVATRegistered === true && (
                    <InfoRow
                      label="VAT Registration No"
                      value={customer?.vatRegistrationNo}
                    />
                  )}
                </div>
              </InfoCard>
            </Col>
          </Row>

          {/* Quick Stats */}
          {/* <Row className="g-3">
            <Col sm={6} lg={3}>
              <StatCard
                icon={FaLayerGroup}
                label="License Number"
                value={customer?.lisenNumber}
                variant="secondary"
              />
            </Col>
            <Col sm={6} lg={3}>
              <StatCard
                icon={FaDollarSign}
                label="Credit Limit"
                value={formatCurrency(customer?.creditLimit)}
                variant="success"
              />
            </Col>
            <Col sm={6} lg={3}>
              <StatCard
                icon={FaChartLine}
                label="Credit Duration"
                value={customer?.creditDuration + " days"}
                variant="info"
              />
            </Col>
            <Col sm={6} lg={3}>
              <StatCard
                icon={FaDollarSign}
                label="Outstanding Amount"
                value={formatCurrency(customer?.outstandingAmount)}
                variant="danger"
              />
            </Col>
          </Row> */}
        </Container>
      </Modal.Body>

      <Modal.Footer className="bg-white border-top">
        <div className="d-flex justify-content-end align-items-center w-100">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>

      <style jsx>{`
        .card:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </Modal>
  );
};

export default CustomerView;














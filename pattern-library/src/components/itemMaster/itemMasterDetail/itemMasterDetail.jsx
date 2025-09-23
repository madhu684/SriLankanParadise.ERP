import React from "react";
import {
  Modal,
  Button,
  Card,
  Badge,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import {
  FaInfoCircle,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaTag,
  FaUser,
  FaBarcode,
  FaLayerGroup,
  FaTruck,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ItemMasterDetail = ({ show, handleClose, itemMaster }) => {
  // Mock functions since we don't have the actual hook
  const getStatusLabel = (status) => (status === true ? "Active" : "Inactive");
  const getStatusBadgeClass = (status) =>
    status === true ? "success" : "danger";

  const formatCurrency = (value) => {
    if (!value || value === 0) return "N/A";
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const isServiceItemType = () => {
    if (itemMaster?.itemType?.name === "Service") {
      return true;
    }

    return false;
  };

  const colSize = isServiceItemType() ? 4 : 3;

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

  console.log(itemMaster, "itemMaster 84");

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
              Item Master Details
            </Modal.Title>
            <small className="text-muted">ID: {itemMaster.itemMasterId}</small>
          </div>
          <div className="d-flex flex-column text-start">
            <small className="text-dark d-block">Status</small>
            <Badge
              bg={getStatusBadgeClass(itemMaster.status)}
              className="px-3 py-2 mt-2"
            >
              {getStatusLabel(itemMaster.status)}
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
                  <InfoRow label="Item Name" value={itemMaster?.itemName} />
                  <InfoRow label="Item Code" value={itemMaster?.itemCode} />
                  <InfoRow
                    label="Item Type"
                    value={itemMaster?.itemType?.name}
                  />
                  <InfoRow
                    label="Category"
                    value={itemMaster?.category?.categoryName}
                  />
                </div>
                <InfoRow label="Created By" value={itemMaster.createdBy} />
              </InfoCard>
            </Col>

            <Col lg={6} className="mb-3">
              <InfoCard icon={FaBox} title="Specifications" variant="success">
                <div>
                  <InfoRow
                    label="Measurement Type"
                    value={itemMaster.unit?.measurementType?.name}
                  />
                  <InfoRow label="Unit" value={itemMaster.unit?.unitName} />
                  <InfoRow
                    label="Unit Price"
                    value={formatCurrency(itemMaster?.unitPrice)}
                  />
                  {/* {!isServiceItemType() && (
                    <InfoRow
                      label="Reorder Level"
                      value={itemMaster?.reorderLevel}
                    />
                  )} */}

                  <InfoRow
                    label="Hierarchy Type"
                    value={
                      itemMaster.parentId !== itemMaster.itemMasterId
                        ? "Sub Item"
                        : "Main Item"
                    }
                  />
                </div>
              </InfoCard>
            </Col>
          </Row>

          {/* Supplier Information */}
          {itemMaster.supplier && (
            <Row className="mb-4">
              <Col xs={12}>
                <InfoCard
                  icon={FaTruck}
                  title="Supplier Information"
                  variant="info"
                >
                  <Row>
                    <Col md={6}>
                      <div>
                        <InfoRow
                          label="Supplier Name"
                          value={itemMaster.supplier.supplierName}
                        />
                        <InfoRow
                          label="Contact Person"
                          value={itemMaster.supplier.contactPerson}
                        />
                        <InfoRow
                          label="Phone"
                          value={itemMaster.supplier.phone}
                        />
                        <InfoRow
                          label="Email"
                          value={itemMaster.supplier.email}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>
                        <InfoRow
                          label="Office Contact"
                          value={itemMaster.supplier.officeContactNo || "N/A"}
                        />
                        <InfoRow
                          label="Address Line 1"
                          value={itemMaster.supplier.addressLine1 || "N/A"}
                        />
                        <InfoRow
                          label="Address Line 2"
                          value={itemMaster.supplier.addressLine2 || "N/A"}
                        />
                        <InfoRow
                          label="Rating"
                          value={
                            itemMaster.supplier.rating
                              ? `${itemMaster.supplier.rating}/5`
                              : "Not Rated"
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                </InfoCard>
              </Col>
            </Row>
          )}

          {/* Pricing Information */}
          {!isServiceItemType() && (
            <>
              <Row className="mb-4">
                <Col xs={12}>
                  <InfoCard
                    icon={FaDollarSign}
                    title="Pricing Information"
                    variant="warning"
                  >
                    <Row>
                      <Col md={6}>
                        <div>
                          <InfoRow
                            label="Cost Ratio"
                            value={itemMaster.costRatio}
                          />
                          <InfoRow
                            label="FOB in USD"
                            value={formatCurrency(itemMaster.fobInUSD)}
                          />
                          <InfoRow
                            label="Landed Cost"
                            value={formatCurrency(itemMaster.landedCost)}
                          />
                          <InfoRow
                            label="Min Net Selling Price"
                            value={formatCurrency(
                              itemMaster.minNetSellingPrice
                            )}
                          />
                          <InfoRow
                            label="Selling Price"
                            value={formatCurrency(itemMaster.sellingPrice)}
                          />
                          <InfoRow
                            label="Bulk Price"
                            value={formatCurrency(itemMaster.bulkPrice)}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div>
                          <InfoRow
                            label="MRP"
                            value={formatCurrency(itemMaster.mrp)}
                          />
                          <InfoRow
                            label="Competitor Price"
                            value={formatCurrency(itemMaster.competitorPrice)}
                          />
                          <InfoRow
                            label="Label Price"
                            value={formatCurrency(itemMaster.labelPrice)}
                          />
                          <InfoRow
                            label="Average Selling Price"
                            value={formatCurrency(
                              itemMaster.averageSellingPrice
                            )}
                          />
                          <InfoRow
                            label="Stock Clearance"
                            value={formatCurrency(itemMaster.stockClearance)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </InfoCard>
                </Col>
              </Row>
            </>
          )}

          {/* Quick Stats */}
          <Row className="g-3">
            <Col sm={6} lg={colSize}>
              <StatCard
                icon={FaDollarSign}
                label="Unit Price"
                value={formatCurrency(itemMaster?.unitPrice)}
                variant="success"
              />
            </Col>
            {!isServiceItemType() && (
              <>
                <Col sm={6} lg={colSize}>
                  <StatCard
                    icon={FaTag}
                    label="Selling Price"
                    value={formatCurrency(itemMaster.sellingPrice)}
                    variant="info"
                  />
                </Col>
              </>
            )}
            <Col sm={6} lg={colSize}>
              <StatCard
                icon={FaChartLine}
                label="Item Category"
                value={itemMaster?.category?.categoryName || "N/A"}
                variant="warning"
              />
            </Col>
            <Col sm={6} lg={colSize}>
              <StatCard
                icon={FaLayerGroup}
                label="Item Type"
                value={itemMaster?.itemType?.name || "N/A"}
                variant="secondary"
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer className="bg-white border-top">
        <div className="d-flex justify-content-between align-items-center w-100">
          <small className="text-muted">
            <FaUser className="me-3" />
            Created by <span className="fw-medium">{itemMaster.createdBy}</span>
          </small>
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

export default ItemMasterDetail;

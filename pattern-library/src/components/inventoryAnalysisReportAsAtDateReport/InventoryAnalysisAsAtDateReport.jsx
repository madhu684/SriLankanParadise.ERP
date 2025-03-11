import React from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import companyLogoUrl from "../../assets/images/erp_logo.jpg";
import useInventoryAnalysisReport from "./useInventoryAnalysisReportAsAtDateReport";
import { EmojiAngry } from "react-bootstrap-icons";
import Pagination from "../common/Pagination/Pagination";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const InventoryAnalysisAsAtDateReport = () => {
  const {
    data,
    loading,
    error,
    locationTypes,
    locations,
    filteredLocations,
    handleStartDateChange,
    handleLocationTypeChange,
    handleLocationChange,
    handleSubmit,
    getCurrentDate,
    startDate,
    locationTypeId,
    locationId,
    totalPages,
    currentPage,
    currentItems,
    itemsPerPage,
    handlePageChange,
    handleExportToExcel,
    handlePrint,
  } = useInventoryAnalysisReport();

  return (
    <Container>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <img src={companyLogoUrl} alt="Company Logo" height={40} />
          <p className="mb-0">
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Inventory As At Date Report</h1>
        <hr />
      </div>
      <Row className="my-4">
        <Col md={10}>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group controlId="startDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="locationType">
                  <Form.Label>Location Type</Form.Label>
                  <Form.Select
                    value={locationTypeId}
                    onChange={handleLocationTypeChange}
                  >
                    <option value="" disabled>
                      Select a Location Type
                    </option>
                    {locationTypes && locationTypes.length > 0 ? (
                      locationTypes.map((locType) => (
                        <option
                          key={locType.locationTypeId}
                          value={locType.locationTypeId}
                        >
                          {locType.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No location types found</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Select
                    value={locationId}
                    onChange={handleLocationChange}
                  >
                    <option value={0}>All</option>
                    {filteredLocations && filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <option key={loc.locationId} value={loc.locationId}>
                          {loc.locationName}
                        </option>
                      ))
                    ) : (
                      <option value="">No locations found</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  onClick={handleSubmit}
                  disabled={!startDate}
                >
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {!Array.isArray(currentItems) && loading && <LoadingSpinner />}

      {!Array.isArray(currentItems) &&
        !loading &&
        (!startDate ? (
          <p className="text-center bg-light text-black fw-bold p-2 border">
            Please select the date
          </p>
        ) : (
          !locationTypeId && (
            <p className="text-center bg-light text-black fw-bold p-2 border">
              Please select the location type
            </p>
          )
        ))}

      {error && (
        <Alert variant="danger">
          <EmojiAngry className="me-2" />
          {error}
        </Alert>
      )}

      {Array.isArray(currentItems) && currentItems.length !== 0 && (
        <>
          <Row className="mb-3">
            <Col className="d-flex justify-content-end">
              <Button
                variant="secondary"
                //onClick={handleExportToExcel}
                className="me-2"
              >
                Export to Excel
              </Button>
              <Button
                variant="secondary"
                //onClick={handlePrint}
              >
                Print Report
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div id="printableTable">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Inventory</th>
                      <th>Raw Material</th>
                      <th>Item Code</th>
                      <th>UOM</th>
                      <th>Lot No</th>
                      <th>Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.inventory}</td>
                        <td>{item.rawMaterial}</td>
                        <td className="text-end">{item.itemCode}</td>
                        <td className="text-center">{item.uom}</td>
                        <td className="text-end">{item.batchNo}</td>
                        <td className="text-end">
                          {item.openingBalance?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
                paginate={handlePageChange}
                currentPage={currentPage}
              />
            </Col>
          </Row>
        </>
      )}

      {Array.isArray(currentItems) && currentItems.length === 0 && (
        <p className="text-center bg-light p-2 border">No data available.</p>
      )}
    </Container>
  );
};

export default InventoryAnalysisAsAtDateReport;

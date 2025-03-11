import React from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import CurrentDateTime from "../currentDateTime/currentDateTime";
import companyLogoUrl from "../../assets/images/erp_logo.jpg";
import useInventoryAnalysisReport from "./useInventoryAnalysisReport";
import { EmojiAngry } from "react-bootstrap-icons";
import Pagination from "../common/Pagination/Pagination";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";

const InventoryAnalysisReport = () => {
  const {
    data,
    loading,
    companyLocations,
    error,
    startDate,
    endDate,
    selectedWarehouse,
    currentPage,
    totalPages,
    itemsPerPage,
    currentItems,
    handleStartDateChange,
    handleEndDateChange,
    handleWarehouseOnChange,
    handleSubmit,
    getCurrentDate,
    handleExportToExcel,
    handlePrint,
    handlePageChange,
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
        <h1 className="mt-2 text-center">Inventory Analysis Report</h1>
        <hr />
      </div>
      <Row className="my-4">
        <Col md={10}>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="warehouse">
                  <Form.Label>Warehouse</Form.Label>
                  <Form.Select
                    id="warehouse"
                    defaultValue=""
                    onChange={handleWarehouseOnChange}
                  >
                    <option value="" disabled>
                      Select a Warehouse
                    </option>
                    {companyLocations && companyLocations.length > 0 ? (
                      companyLocations
                        .filter((location) => location.locationTypeId === 2)
                        .map((warehouse) => (
                          <option
                            key={warehouse.id}
                            value={warehouse.locationId}
                          >
                            {warehouse.locationName}
                          </option>
                        ))
                    ) : (
                      <option value="">No warehouses found</option>
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
                  disabled={!startDate || !endDate || !selectedWarehouse}
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
            Please select start date
          </p>
        ) : !endDate ? (
          <p className="text-center bg-light text-black fw-bold p-2 border">
            Please select the end date
          </p>
        ) : (
          !selectedWarehouse && (
            <p className="text-center bg-light text-black fw-bold p-2 border">
              Please select the warehouse
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
            <Col className="d-flex justify-content-start">
              <Button
                variant="secondary"
                onClick={handleExportToExcel}
                className="me-2"
              >
                Export to Excel
              </Button>
              <Button variant="secondary" onClick={handlePrint}>
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
                      <th>Opening Balance</th>
                      {/* Received */}
                      <th>GRN</th>
                      <th>Production In</th>
                      <th>Return In</th>
                      <th>Total In</th>

                      {/* Consumed */}
                      <th>Production Out</th>
                      <th>Return</th>
                      <th>Total Out</th>

                      {/*Stock Adjusted and Disposal*/}
                      <th>Stock Adjusted In</th>
                      <th>Stock Adjusted Out</th>
                      <th>Stock Disposal</th>

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
                        {/* Received */}
                        <td className="text-end">{item.grnQty?.toFixed(2)}</td>
                        <td className="text-end">
                          {item.productionInQty?.toFixed(2)}
                        </td>
                        <td className="text-end">
                          {item.returnInQty?.toFixed(2)}
                        </td>
                        <td className="text-end">
                          {item.receivedQty?.toFixed(2)}
                        </td>

                        {/* Consumed */}
                        <td className="text-end text-danger">
                          {item.productionOutQty?.toFixed(2)}
                        </td>
                        <td className="text-end">
                          {item.returnQty?.toFixed(2)}
                        </td>
                        <td className="text-end text-danger">
                          {item.actualUsage?.toFixed(2)}
                        </td>
                        <td className="text-end">{item.stAdjIn?.toFixed(2)}</td>
                        <td className="text-end text-danger">
                          {item.stAdjOut?.toFixed(2)}
                        </td>
                        <td className="text-end text-danger">
                          {item.stDisOut?.toFixed(2)}
                        </td>
                        <td className="text-end">
                          {item.closingBalance?.toFixed(2)}
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

export default InventoryAnalysisReport;

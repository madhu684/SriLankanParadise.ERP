import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update_stock_api } from "../../services/purchaseApi";
import LoadingSpinner from "../loadingSpinner/buttonLoadingSpinner/buttonLoadingSpinner";
import toast from "react-hot-toast";

const StockAdjustmentModal = ({
  show,
  onHide,
  selectedItem,
  selectedLocation,
}) => {
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const queryClient = useQueryClient();

  const adjustmentMutation = useMutation({
    mutationFn: (newQuantity) =>
      update_stock_api(selectedItem.locationInventoryId, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries(["inventories", selectedLocation]);
      toast.success("Stock adjusted successfully!");
      onHide();
    },
    onError: (error) => {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock. Please try again.");
    },
  });

  useEffect(() => {
    if (show) {
      setAdjustmentValue("");
    }
  }, [show]);

  const handleValueChange = (e) => {
    setAdjustmentValue(e.target.value);
  };

  const handleSave = () => {
    adjustmentMutation.mutate(adjustmentValue);
  };

  const calculateDifference = () => {
    if (adjustmentValue && selectedItem) {
      const diff =
        parseFloat(adjustmentValue) - parseFloat(selectedItem.stockInHand);
      return diff;
    }
    return 0;
  };

  const difference = calculateDifference();

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <i className="bi bi-box-seam me-2"></i>
          Adjust Stock
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {selectedItem && (
          <Form>
            {/* Item Information Card */}
            <div className="bg-light rounded p-3 mb-4">
              <h6 className="text-muted mb-3 fw-bold">Item Information</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted mb-1">
                      Item Code
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedItem.itemCode}
                      readOnly
                      className="bg-white border-0 fw-semibold"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small text-muted mb-1">
                      Batch Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedItem.batchNo || "N/A"}
                      readOnly
                      className="bg-white border-0 fw-semibold"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="small text-muted mb-1">
                      Item Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedItem.itemName}
                      readOnly
                      className="bg-white border-0 fw-semibold"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Stock Adjustment Section */}
            <div className="border rounded p-3 mb-3">
              <Row className="g-3 align-items-end">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold mb-2">
                      Current Stock
                    </Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type="text"
                        value={selectedItem.stockInHand}
                        readOnly
                        className="bg-light text-center fw-bold border-2"
                        style={{ fontSize: "1.1rem" }}
                      />
                      <InputGroup.Text className="bg-light border-2">
                        {selectedItem?.unitName || "units"}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold mb-2">
                      New Stock Value <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type="number"
                        placeholder="Enter value"
                        value={adjustmentValue}
                        onChange={handleValueChange}
                        autoFocus
                        className="text-center fw-bold border-2 border-primary"
                        style={{ fontSize: "1.1rem" }}
                        min="0"
                      />
                      <InputGroup.Text className="border-2 border-primary">
                        {selectedItem?.unitName || "units"}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Difference Indicator */}
            {adjustmentValue && (
              <div className="alert alert-info border-0 d-flex align-items-center mb-0">
                <i className="bi bi-info-circle-fill me-2"></i>
                <div className="flex-grow-1">
                  <strong>Stock Change:</strong>{" "}
                  {difference > 0 ? (
                    <Badge bg="success" className="ms-2 fs-6">
                      <i className="bi bi-arrow-up"></i> +
                      {difference.toFixed(2)}{" "}
                      {selectedItem?.unitName || "units"}
                    </Badge>
                  ) : difference < 0 ? (
                    <Badge bg="danger" className="ms-2 fs-6">
                      <i className="bi bi-arrow-down"></i>{" "}
                      {difference.toFixed(2)}{" "}
                      {selectedItem?.unitName || "units"}
                    </Badge>
                  ) : (
                    <Badge bg="secondary" className="ms-2 fs-6">
                      No Change
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="outline-danger" onClick={onHide} className="px-4">
          <i className="bi bi-x-circle me-2"></i>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className="px-4"
          disabled={
            !adjustmentValue ||
            adjustmentValue === selectedItem?.stockInHand ||
            adjustmentMutation.isPending
          }
        >
          {adjustmentMutation.isPending ? (
            <LoadingSpinner />
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Save Changes
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StockAdjustmentModal;

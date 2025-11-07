import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { get_item_price_list_by_id_api } from "../../../services/inventoryApi";
import { get_location_by_locationId_api } from "../../../services/purchaseApi";

const LocationView = ({ location, isOpen, handleClose }) => {
  // Fetch price list data
  const {
    data: priceListResponse,
    isLoading: isPriceListLoading,
    isError: isPriceListError,
  } = useQuery({
    queryKey: ["priceList", location?.priceMasterId],
    queryFn: () => get_item_price_list_by_id_api(location.priceMasterId),
    enabled: isOpen && !!location?.priceMasterId,
    select: (response) => response?.data?.result,
  });

  // Fetch parent location data if parentId exists
  const {
    data: parentLocationResponse,
    isLoading: isParentLocationLoading,
    isError: isParentLocationError,
  } = useQuery({
    queryKey: ["parentLocation", location?.parentId],
    queryFn: () => get_location_by_locationId_api(location.parentId),
    enabled: isOpen && !!location?.parentId,
    select: (response) => response?.data?.result,
  });

  if (!location) return null;

  const priceListData = priceListResponse;
  const parentLocation = parentLocationResponse;
  const isLoading = isPriceListLoading || isParentLocationLoading;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered scrollable size="xl">
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="fw-bold">Location Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="mb-4 p-3 bg-light rounded border">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0 fw-bold text-primary">
                  {location.locationName}
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold">Status:</span>
                  <span
                    className={`badge rounded-pill fs-6 ${
                      location.status ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {location.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="row g-4 mb-4">
              {/* Left Column - Location Information */}
              <div className="col-lg-6">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0 fw-semibold">
                      <i className="bi bi-geo-alt me-2"></i>Location Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Location ID:</span>
                          <span className="fw-semibold text-end">
                            {location.locationId}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Location Name:</span>
                          <span className="fw-semibold text-end">
                            {location.locationName}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Location Type:</span>
                          <span className="fw-semibold text-end">
                            {location.locationType?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                          <span className="text-muted">Company ID:</span>
                          <span className="fw-semibold text-end">
                            {location.companyId}
                          </span>
                        </div>
                      </div>
                      {location.parentId && (
                        <>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span className="text-muted">
                                Parent Location ID:
                              </span>
                              <span className="fw-semibold text-end">
                                {location.parentId}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                              <span className="text-muted">
                                Parent Location Name:
                              </span>
                              <span className="fw-semibold text-end">
                                {isParentLocationLoading ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </span>
                                ) : isParentLocationError ? (
                                  <span className="text-danger">
                                    Error loading
                                  </span>
                                ) : (
                                  parentLocation?.locationName || "N/A"
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Price List */}
              <div className="col-lg-6">
                <div className="card shadow-sm">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0 fw-semibold">
                      <i className="bi bi-currency-dollar me-2"></i>Item Price
                      List
                    </h6>
                  </div>
                  <div className="card-body">
                    {isPriceListError ? (
                      <div
                        className="alert alert-danger d-flex align-items-center"
                        role="alert"
                      >
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>Error loading price list data.</div>
                      </div>
                    ) : priceListData ? (
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span className="text-muted">List Name:</span>
                            <span className="fw-semibold text-end">
                              {priceListData.listName}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span className="text-muted">Effective Date:</span>
                            <span className="fw-semibold text-end">
                              {formatDate(priceListData.effectiveDate)}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span className="text-muted">Status:</span>
                            <span className="fw-semibold text-end">
                              <span
                                className={`badge ${
                                  priceListData.status === 1
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {priceListData.status === 1
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span className="text-muted">Total Items:</span>
                            <span className="fw-semibold text-end">
                              {priceListData.itemPriceDetails?.length || 0}{" "}
                              items
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2">
                            <span className="text-muted">Created By:</span>
                            <span className="fw-semibold text-end">
                              {priceListData.createdBy}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start">
                            <span className="text-muted">Created Date:</span>
                            <span className="fw-semibold text-end">
                              {formatDate(priceListData.createdDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="alert alert-warning d-flex align-items-center"
                        role="alert"
                      >
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>
                          No price list data available for this location.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationView;

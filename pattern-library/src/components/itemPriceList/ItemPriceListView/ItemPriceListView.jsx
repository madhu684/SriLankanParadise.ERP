import React, { memo } from "react";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";

const ItemPriceListViewModal = memo(({ itemPriceList, show, handleClose }) => {
  if (!itemPriceList) return null;

  const totalItems = itemPriceList.itemPriceDetails?.length || 0;
  const totalValue =
    itemPriceList.itemPriceDetails?.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    ) || 0;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      scrollable
    >
      {/* Modal Header */}
      <Modal.Header className="border-bottom">
        <Modal.Title className="mb-1 text-dark">Price List Details</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>
        {/* Basic Information Card */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-light">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-info-circle me-2"></i>
              Basic Information
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-tag-fill text-primary me-3 mt-1 fs-5"></i>
                  <div>
                    <small className="text-muted d-block">List Name</small>
                    <span className="fw-semibold">
                      {itemPriceList.listName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-calendar-check text-success me-3 mt-1 fs-5"></i>
                  <div>
                    <small className="text-muted d-block">Effective Date</small>
                    <span className="fw-semibold">
                      {moment(itemPriceList.effectiveDate).format(
                        "MMMM Do, YYYY"
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-person-circle text-info me-3 mt-1 fs-5"></i>
                  <div>
                    <small className="text-muted d-block">Created By</small>
                    <span className="fw-semibold">
                      {itemPriceList.createdBy}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-clock-history text-warning me-3 mt-1 fs-5"></i>
                  <div>
                    <small className="text-muted d-block">Created Date</small>
                    <span className="fw-semibold">
                      {moment(itemPriceList.createdDate).format(
                        "MMMM Do, YYYY [at] h:mm A"
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-toggle-on text-success me-3 mt-1 fs-5"></i>
                  <div>
                    <small className="text-muted d-block">Status</small>
                    {itemPriceList.status === 1 ? (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Active
                      </span>
                    ) : (
                      <span className="badge bg-danger">
                        <i className="bi bi-x-circle me-1"></i>
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {itemPriceList.remark && (
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-chat-left-text text-secondary me-3 mt-1 fs-5"></i>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">Remarks</small>
                      <p className="mb-0 text-muted fst-italic">
                        "{itemPriceList.remark}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {/* <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm bg-primary bg-opacity-10">
              <div className="card-body text-center">
                <i className="bi bi-box-seam text-primary fs-1 mb-2"></i>
                <h3 className="fw-bold text-primary mb-0">{totalItems}</h3>
                <small className="text-muted">Total Items</small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm bg-success bg-opacity-10">
              <div className="card-body text-center">
                <i className="bi bi-currency-exchange text-success fs-1 mb-2"></i>
                <h3 className="fw-bold text-success mb-0">
                  LKR{" "}
                  {totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
                <small className="text-muted">Total Price Value</small>
              </div>
            </div>
          </div>
        </div> */}

        {/* Items Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-dark text-white">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-list-ul me-2"></i>
              Item Details ({totalItems} items)
            </h6>
          </div>
          <div className="card-body p-0">
            {itemPriceList.itemPriceDetails &&
            itemPriceList.itemPriceDetails.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4" style={{ width: "60px" }}></th>
                      <th>Item Name</th>
                      <th className="text-end pe-4" style={{ width: "200px" }}>
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemPriceList.itemPriceDetails.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="ps-4 text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="fw-semibold">
                              {item.itemMaster.itemName || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <span className="badge bg-success bg-opacity-10 text-success fw-semibold px-3 py-2">
                            LKR{" "}
                            {parseFloat(item.price || 0).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted fs-1 d-block mb-3"></i>
                <p className="text-muted">No items in this price list</p>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

ItemPriceListViewModal.displayName = "ItemPriceListViewModal";

export default ItemPriceListViewModal;

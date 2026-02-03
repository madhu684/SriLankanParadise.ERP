import React from 'react'
import useSaleOrderReportViewHook from './useSaleOrderReportView'
import { Button, Modal, Table } from 'react-bootstrap'
import CurrentDateTime from 'common/components/currentDateTime/currentDateTime'
import LoadingSpinner from 'common/components/loadingSpinner/loadingSpinner'

const SalesOrderReportView = ({showModal, onCancel, salesOrderId}) => {

  const { salesOrderDetails, loading, handleExportExcel } =
    useSaleOrderReportViewHook(salesOrderId)
    

  return (
    <Modal
      show={showModal}
      backdrop="static"
      centered
      contentClassName="w-auto"
      dialogClassName="modal-lg"
    >
      <Modal.Header>
        <div className="d-flex justify-content-end align-items-end w-100">
          <p className="mb-0">
            <CurrentDateTime />
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <h3 className="text-center">Sales Order Details</h3>
        <hr />
        <Table striped bordered hover>
          <thead className="thead-dark">
            <tr>
              <th>Sales Order Detail Id</th>
              <th>Batch Id</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div className="d-flex justify-content-center align-content-center">
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : salesOrderDetails && salesOrderDetails.length > 0 ? (
              salesOrderDetails.map((item, index) => (
                <tr key={index}>
                  <td>{item.salesOrderDetailId}</td>
                  <td>{item.itemBatchBatchId}</td>
                  <td>{item.itemBatch.itemMaster.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.totalPrice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end gap-3">
          <Button color="#17B169" onClick={onCancel}>
            Close
          </Button>
          <Button
            color="blue"
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SalesOrderReportView













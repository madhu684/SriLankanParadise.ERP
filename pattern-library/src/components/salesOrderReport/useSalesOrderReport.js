import { useState } from 'react'
import { get_sales_orders_with_details_by_date_range } from '../../services/salesApi'

const SalesOrderReportHook = () => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isFromDateSelected, setIsFromDateSelected] = useState(false)
  const [isToDateSelected, setIsToDateSelected] = useState(false)
  const [salesOrderData, setsalesOrderData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSearched, setIsSearched] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [salesOrderId, setSalesOrderId] = useState('')
  

  const fetchSalesOrders = async () => {
    setLoading(true)
    try {
      const response = await get_sales_orders_with_details_by_date_range(
        fromDate,
        toDate,
      )
      setsalesOrderData(response.data.result)
      console.log('Sales Orders: ', response.data.result)
    } catch (error) {
      console.error('Error fetching sales orders:', error)
    } finally {
      setLoading(false)
    }
  }

  

  const handleFromDateChange = (e) => {
    console.log('fromDate: ', e.target.value)
    setFromDate(e.target.value)
    setIsFromDateSelected(true)
  }

  const handleToDateChange = (e) => {
    console.log('toDate: ', e.target.value)
    setToDate(e.target.value) 
    setIsToDateSelected(true)
  }

  const handleSearch = () => {
    if (isFromDateSelected && isToDateSelected) {
      fetchSalesOrders()
    }
    setIsSearched(true)
  }

  const handleShowModal = (salesOrderId) => {
    setShowModal(true)
    setSalesOrderId(salesOrderId)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return {
    handleFromDateChange,
    handleToDateChange,
    handleSearch,
    handleShowModal,
    handleCloseModal,
    showModal,
    isSearched,
    fromDate,
    toDate,
    isFromDateSelected,
    isToDateSelected,
    salesOrderData,
    loading,
    salesOrderId,
  }
}

export default SalesOrderReportHook

import { useQuery } from '@tanstack/react-query'
import { get_charges_and_deductions_applied_api } from 'common/services/purchaseApi'
import { get_company_api } from 'common/services/salesApi'

const usePackingSlipDetail = (packingSlip) => {
  const calculateSubTotal = () => {
    const subTotal = packingSlip.packingSlipDetails.reduce(
      (total, detail) => total + detail.totalPrice,
      0
    )
    return subTotal
  }

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        9,
        packingSlip.packingSlipId,
        sessionStorage.getItem('companyId')
      )
      return response.data.result
    } catch (error) {
      console.error('Error fetching charges and deductions:', error)
    }
  }

  const {
    data: chargesAndDeductionsApplied,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['chargesAndDeductionsApplied', packingSlip.packingSlipId],
    queryFn: fetchChargesAndDeductionsApplied,
  })

  const separateChargesByLineItem = () => {
    const lineItemChargesAndDeductions = []
    const commonChargesAndDeductions = []

    chargesAndDeductionsApplied?.forEach((charge) => {
      if (charge.lineItemId) {
        lineItemChargesAndDeductions.push(charge)
      } else {
        commonChargesAndDeductions.push(charge)
      }
    })

    return { lineItemChargesAndDeductions, commonChargesAndDeductions }
  }

  const { lineItemChargesAndDeductions, commonChargesAndDeductions } =
    separateChargesByLineItem()

  // Get unique display names of charges and deductions for line items and common charges
  const uniqueLineItemDisplayNames = Array.from(
    new Set(
      lineItemChargesAndDeductions.map(
        (charge) => charge.chargesAndDeduction.displayName
      )
    )
  )
  const uniqueCommonDisplayNames = Array.from(
    new Set(
      commonChargesAndDeductions.map(
        (charge) => charge.chargesAndDeduction.displayName
      )
    )
  )

  const fetchCompany = async () => {
    try {
      const response = await get_company_api(
        sessionStorage?.getItem('companyId')
      )
      return response.data.result
    } catch (error) {
      console.error('Error fetching company:', error)
    }
  }

  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ['company'],
    queryFn: fetchCompany,
  })

  // Group sales order details by item master ID
  const groupedPackingSlipDetails = packingSlip.packingSlipDetails.reduce(
    (acc, item) => {
      const itemMasterId = item.itemBatch?.itemMaster?.itemMasterId
      if (!acc[itemMasterId]) {
        acc[itemMasterId] = { ...item, quantity: 0, totalPrice: 0 }
      }
      acc[itemMasterId].quantity += item.quantity
      acc[itemMasterId].totalPrice += item.totalPrice
      return acc
    },
    {}
  )

  const renderPackingSlipDetails = () => {
    if (company.batchStockType === 'FIFO') {
      return Object.values(groupedPackingSlipDetails)
    } else {
      return packingSlip.packingSlipDetails
    }
  }

  return {
    chargesAndDeductionsApplied,
    isLoading,
    isError,
    error,
    uniqueLineItemDisplayNames,
    uniqueCommonDisplayNames,
    lineItemChargesAndDeductions,
    commonChargesAndDeductions,
    isCompanyLoading,
    isCompanyError,
    company,
    groupedPackingSlipDetails,
    renderPackingSlipDetails,
    calculateSubTotal,
  }
}

export default usePackingSlipDetail














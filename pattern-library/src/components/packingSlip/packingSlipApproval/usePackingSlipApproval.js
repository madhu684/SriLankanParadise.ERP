import { useEffect, useRef, useState } from "react";
import { approve_packing_slip_api, get_company_api } from "../../../services/salesApi";
import { get_charges_and_deductions_applied_api } from "../../../services/purchaseApi";
import { useQuery } from "@tanstack/react-query";

const usePackingSlipApproval = ({ onFormSubmit, packingSlip }) => {
  const [approvalStatus, setApprovalStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const alertRef = useRef(null)

  useEffect(() => {
    if (approvalStatus === 'approved') {
      setTimeout(() => {
        onFormSubmit()
      }, 2000)
    }
  }, [approvalStatus, onFormSubmit])

  const handleApprove = async (packingSlipId) => {
    try {
      console.log("Handle approve button triggered")
      setLoading(true)
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString()
      const approvalData = {
        status: 2,
        approvedBy: sessionStorage.getItem('username'),
        approvedUserId: sessionStorage.getItem('userId'),
        approvedDate: formattedDate,
        permissionId: 1086,
      }

      const approvalResponse = await approve_packing_slip_api(
        packingSlipId,
        approvalData
      )
      console.log('Packing Slip approval response', approvalResponse)

      if (approvalResponse.status === 200) {
        setApprovalStatus('approved')
        console.log('Packing Slip approved successfully', approvalResponse)
      } else {
        setApprovalStatus('error')
      }

      setTimeout(() => {
        setApprovalStatus(null)
        setLoading(false)
      }, 2000)
    } catch (error) {
      setApprovalStatus('error')
      console.error('Error approving packing slips:', error)
      setTimeout(() => {
        setApprovalStatus(null)
        setLoading(false)
      }, 2000)
    }
  }

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

  // Separate charges/deductions
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

  useEffect(() => {
    if (approvalStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [approvalStatus])

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
     approvalStatus,
     chargesAndDeductionsApplied,
     isLoading,
     isError,
     error,
     uniqueLineItemDisplayNames,
     uniqueCommonDisplayNames,
     lineItemChargesAndDeductions,
     commonChargesAndDeductions,
     loading,
     alertRef,
     isCompanyLoading,
     isCompanyError,
     company,
     groupedPackingSlipDetails,
     renderPackingSlipDetails,
     calculateSubTotal,
     handleApprove,
   }
}

export default usePackingSlipApproval;
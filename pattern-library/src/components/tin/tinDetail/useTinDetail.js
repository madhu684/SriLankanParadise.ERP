import { useEffect, useState } from 'react'
import {
  patch_issue_detail_api,
  get_issue_details_api,
} from '../../../services/purchaseApi'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'

const useTinDetail = (tin, handleClose) => {

  const queryClient = useQueryClient()

  const isRequester =
    Number(sessionStorage?.getItem('userId')) ===
    tin.requisitionMaster.requestedUserId

  const { data: issuedetails } = useQuery({
    queryKey: ['tinDetails', tin.issueMasterId],
    queryFn: () => get_issue_details_api(tin.issueMasterId),
    select: (r) => r?.data?.result || [],
  })

  const handleQuantityChange = (issueDetailId, newQuantity) => {
    setReceivedQuantities((prev) => ({
      ...prev,
      [issueDetailId]: newQuantity,
    }))
  }

  const [receivedQuantities, setReceivedQuantities] = useState({})

  // Update receivedQuantities when issuedetails are fetched
  useEffect(() => {
    if (issuedetails?.length > 0) {
      const updatedQuantities = issuedetails.reduce((acc, item) => {
        acc[item.issueDetailId] = item.receivedQuantity || ''
        return acc
      }, {})
      setReceivedQuantities(updatedQuantities)
    }
  }, [issuedetails]) 

  const mutation = useMutation({
    mutationFn: ({ issuemasterid, updatedDetails }) =>
      patch_issue_detail_api(issuemasterid, updatedDetails),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tinDetails', tin.issueMasterId])
      handleClose()
    },
    onError: (error) => {
      console.error('Failed to update received quantities:', error)
    },
  })

  
  const handleAccept = () => {
    const updatedDetails = issuedetails.map((item) => ({
      issueDetailId: item.issueDetailId,
      receivedQuantity: receivedQuantities[item.issueDetailId] || 0, 
    }))

    mutation.mutate({ issuemasterid: tin.issueMasterId, updatedDetails })
  }

  return {
    receivedQuantities,
    isRequester,
    handleQuantityChange,
    handleAccept,
  }
}

export default useTinDetail
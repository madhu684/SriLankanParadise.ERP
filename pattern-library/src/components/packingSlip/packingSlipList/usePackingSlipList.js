import { useEffect, useState } from 'react'
import { get_user_permissions_api } from '../../../services/userManagementApi'
import { useQuery } from '@tanstack/react-query'
import {
  get_packing_slips_by_user_id_api,
  get_packing_slips_with_out_drafts_api,
} from '../../../services/salesApi'

const usePackingSlipList = () => {
  const [packingSlips, setPackingSlips] = useState([])
  const [error, setError] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowData, setSelectedRowData] = useState([])
  const [showApprovePSModal, setShowApprovePSModal] = useState(false)
  const [showCreatePSForm, setShowCreatePSForm] = useState(false)
  const [showApprovePSModalInParent, setShowApprovePSModalInParent] =
    useState(false)
  const [showDetailPSModal, setShowDetailPSModal] = useState(false)
  const [showDetailPSModalInParent, setShowDetailPSModalInParent] =
    useState(false)
  const [showUpdatePSForm, setShowUpdatePSForm] = useState(false)
  const [PSDetail, setPSDetail] = useState('')
  const [showConvertPSForm, setShowConvertPSForm] = useState(false)

  const fetchUserPermissions = async () => {
    try {
      const response = await get_user_permissions_api(
        sessionStorage.getItem('userId')
      )
      return response.data.result
    } catch (error) {
      console.error('Error fetching user permissions:', error)
    }
  }

  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
    error: permissionError,
  } = useQuery({
    queryKey: ['userPermissions'],
    queryFn: fetchUserPermissions,
  })

  const fetchData = async () => {
    try {
      if (!isLoadingPermissions && userPermissions) {
        if (hasPermission('Approve Packing Slip')) {
          const PackingSlipWithoutDraftsResponse =
            await get_packing_slips_with_out_drafts_api(
              sessionStorage.getItem('companyId')
            )

          const PackingSlipByUserIdResponse =
            await get_packing_slips_by_user_id_api(
              sessionStorage.getItem('userId')
            )

          let newPackingSlips = []

          if (
            PackingSlipWithoutDraftsResponse &&
            PackingSlipWithoutDraftsResponse.data.result
          ) {
            newPackingSlips = PackingSlipWithoutDraftsResponse.data.result
          }

          let additionalPackingSlips = []

          if (
            PackingSlipByUserIdResponse &&
            PackingSlipByUserIdResponse.data.result
          ) {
            additionalPackingSlips = PackingSlipByUserIdResponse.data.result
          }

          const uniqueNewPackingSlips = additionalPackingSlips.filter(
            (packingSlip) =>
              !newPackingSlips.some(
                (existingPackingSlip) =>
                  existingPackingSlip.packingSlipId ===
                  packingSlip.packingSlipId
              )
          )

          newPackingSlips = [...newPackingSlips, ...uniqueNewPackingSlips]
          setPackingSlips(newPackingSlips)
        } else {
          const PackingSlipResponse = await get_packing_slips_by_user_id_api(
            sessionStorage.getItem('userId')
          )
          setPackingSlips(PackingSlipResponse.data.result || [])
        }
      }
    } catch (error) {
      setError('Error fetching data')
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    fetchUserPermissions()
  }, [])

  useEffect(() => {
    fetchData()
  }, [isLoadingPermissions, userPermissions])

  const handleShowApprovePSModal = () => {
    setShowApprovePSModal(true)
    setShowApprovePSModalInParent(true)
  }

  const handleCloseApprovePSModal = () => {
    setShowApprovePSModal(false)
    handleCloseApprovePSModalInParent()
  }

  const handleCloseApprovePSModalInParent = () => {
    const delay = 300
    setTimeout(() => {
      setShowApprovePSModalInParent(false)
    }, delay)
  }

  const handleApproved = async () => {
    fetchData();
    setSelectedRows([])
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([])
    },delay)
  }

  const handleShowDetailPSModal = () => {
    setShowDetailPSModal(true)
    setShowDetailPSModalInParent(true)
  }

  const handleCloseDetailPSModal = () => {
    setShowDetailPSModal(false)
    handleCloseDetailPSModalInParent()
  }

  const handleCloseDetailPSModalInParent = () => {
    const delay = 300
    setTimeout(() => {
      setShowDetailPSModalInParent(false)
      setPSDetail('')
    }, delay)
  }

  const handleViewDetails = (packingSlip) => {
    setPSDetail(packingSlip);
    handleShowDetailPSModal();
  }

  const handleUpdate = (packingSlip) => {
    setPSDetail(packingSlip)
    setShowUpdatePSForm(true)
  };

  const handleUpdated = async () => {
    fetchData()
    setSelectedRows([])
    const delay = 300
    setTimeout(() => {
      setSelectedRowData([])
      setPSDetail('')
    }, delay)
  }

  const handleClose = () => {
    setShowUpdatePSForm(false)
    setShowConvertPSForm(false)
    setPSDetail('')
  }

  const handleConvert = (packingSlip) => {
    setPSDetail(packingSlip)
    setShowConvertPSForm(true)
  }

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id)
    const selectedRow = packingSlips.find((ps) => ps.packingSlipId === id)

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      )
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.packingSlipId !== id)
      )
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, id])
      setSelectedRowData((prevSelectedData) => [
        ...prevSelectedData,
        selectedRow,
      ])
    }
  }

  const isAnyRowSelected = selectedRows.length === 1

  const getStatusLabel = (statusCode) => {
    const statusLabels = {
      0: 'Draft',
      1: 'Pending Approval',
      2: 'Approved',
      3: 'Rejected',
      4: 'In Progress',
      5: 'Completed',
      6: 'Cancelled',
      7: 'On Hold',
    }

    return statusLabels[statusCode] || 'Unknown Status'
  }

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      0: 'bg-secondary',
      1: 'bg-warning',
      2: 'bg-success',
      3: 'bg-danger',
      4: 'bg-info',
      5: 'bg-primary',
      6: 'bg-dark',
      7: 'bg-secondary',
    }

    return statusClasses[statusCode] || 'bg-secondary'
  }

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) => packingSlips.find((ps) => ps.packingSlipId === id)?.status === 1
    )
  }
  
  const hasPermission = (permissionName) => {
    return userPermissions?.some(
      (permission) =>
        permission.permission.permissionName === permissionName &&
        permission.permission.permissionStatus
    )
  }

  const areAnySelectedRowsApproved = (selectedRows) => {
    return selectedRows.some(
      (id) => packingSlips.find((ps) => ps.packingSlipId === id)?.status === 2
    )
  }

  return {
    packingSlips,
    isLoadingData,
    showCreatePSForm,
    error,
    isPermissionsError,
    isLoadingPermissions,
    permissionError,
    isAnyRowSelected,
    selectedRows,
    showApprovePSModal,
    showApprovePSModalInParent,
    showDetailPSModal,
    showDetailPSModalInParent,
    selectedRowData,
    showUpdatePSForm,
    userPermissions,
    PSDetail,
    showConvertPSForm,
    areAnySelectedRowsPending,
    setSelectedRows,
    handleViewDetails,
    getStatusLabel,
    getStatusBadgeClass,
    handleRowSelect,
    handleShowApprovePSModal,
    handleCloseApprovePSModal,
    handleShowDetailPSModal,
    handleCloseDetailPSModal,
    handleApproved,
    setShowUpdatePSForm,
    setShowCreatePSForm,
    hasPermission,
    handleUpdate,
    handleUpdated,
    handleClose,
    areAnySelectedRowsApproved,
    handleConvert,
    setShowConvertPSForm
  }
}

export default usePackingSlipList

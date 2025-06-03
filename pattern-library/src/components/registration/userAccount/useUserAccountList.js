import { useState, useEffect } from "react";
import {
  get_all_users_by_company_id_api,
  deactivate_user,
  activate_user,
} from "../../../services/userManagementApi";

const useUserAccountList = () => {
  const [users, setUsers] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeactivateConfirmation, setShowDeactivateConfirmation] =
    useState(false);
  const [showActivateConfirmation, setShowActivateConfirmation] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [userDetail, setUserDetail] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isUserUpdated, setIsUserUpdated] = useState(false);

  const [refetch, setRefetch] = useState(false);

  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  // const [showDetailIMModalInParent, setShowUserDetailModalInParent] =
  //   useState(false);

  const fetchData = async () => {
    try {
      const usersResponse = await get_all_users_by_company_id_api(
        sessionStorage.getItem("companyId")
      );
      setUserAccounts(usersResponse.data.result || []);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
    setIsUserUpdated(false);
    if (refetch == true) {
      handleRefetchFalse();
    }
  }, [isUserUpdated, setIsUserUpdated, refetch]);

  // view Model handle start
  // const handleShowUserDetailsModal = () => {
  //   setShowUserDetailModal(true);
  //   setShowUserDetailModalInParent(true);
  // };

  const handleCloseUserDetailModal = () => {
    setShowUserDetailModal(false);
    setUserDetail("");
    //handleCloseUserDetailModalInParent();
  };

  // const handleCloseUserDetailModalInParent = () => {
  //   const delay = 300;
  //   setTimeout(() => {
  //     setShowUserDetailModalInParent(false);
  //     setUserDetail("");
  //   }, delay);
  // };

  const handleViewUserDetails = (user) => {
    setUserDetail(user);
    setShowUserDetailModal(true);
  };
  // end Model handle start

  const handleEdit = (user) => {
    console.log("Editing user:", user);
    setUserDetail(user);
    setShowEditForm(true); // Should change to true here
    console.log("Updated showEditForm to true");
  };

  const handleClose = () => {
    console.log("Closing Registration form");
    setShowEditForm(false);
  };

  const handleUpdated = async () => {
    fetchData();
    setSelectedRows([]);
    const delay = 300;
    setTimeout(() => {
      setSelectedRowData([]);
      setUserDetail("");
    }, delay);
  };

  const handleRefetchTrue = () => {
    setRefetch(true);
  };

  const handleRefetchFalse = () => {
    setRefetch(false);
  };

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const selectedRow = users.find((u) => u.userId === id);

    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setSelectedRowData((prevSelectedData) =>
        prevSelectedData.filter((data) => data.userId !== id)
      );
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, id]);
      setSelectedRowData((prevSelectedData) => [
        ...prevSelectedData,
        selectedRow,
      ]);
    }
  };

  const handleDeactivate = (user) => {
    console.log("User to be deactivated:", user);
    setShowDeactivateConfirmation(true);
    setSelectedUser(user);
    setIsUserUpdated(true);
  };

  const handleActivate = (user) => {
    console.log("User to be activated:", user);
    setShowActivateConfirmation(true);
    setSelectedUser(user);
    setIsUserUpdated(true);
  };

  const userDeactivate = async (id) => {
    try {
      await deactivate_user(id);
      setIsUserUpdated(true);
      setShowDeactivateConfirmation(false);
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const userActivate = async (id) => {
    try {
      await activate_user(id);
      setIsUserUpdated(true);
      setShowActivateConfirmation(false);
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const areAnySelectedRowsPending = (selectedRows) => {
    return selectedRows.some(
      (id) => users.find((u) => u.usersId === id)?.status === 1
    );
  };

  const isAnyRowSelected = selectedRows.length === 1;
  const getStatusLabel = (statusCode) => {
    const statusLabels = {
      false: "Inactive",
      true: "Active",
    };
    return statusLabels[statusCode] || "Unknown Status";
  };

  const getStatusBadgeClass = (statusCode) => {
    const statusClasses = {
      false: "bg-secondary",
      true: "bg-success",
    };

    return statusClasses[statusCode] || "bg-secondary";
  };

  return {
    userAccounts,
    isLoadingData,
    error,
    selectedRows,
    showEditForm,
    showDeactivateConfirmation,
    selectedRowData,
    userDetail,
    users,
    showRegistrationForm,
    showActivateConfirmation,
    selectedUser,
    showUserDetailModal,
    handleCloseUserDetailModal,
    handleViewUserDetails,
    //showDetailIMModalInParent,
    handleRowSelect,
    setShowEditForm,
    handleEdit,
    // handleShowUserDetailsModal,
    handleCloseUserDetailModal,
    getStatusBadgeClass,
    getStatusLabel,
    areAnySelectedRowsPending,
    handleUpdated,
    handleClose,
    handleDeactivate,
    handleActivate,
    setShowRegistrationForm,
    setShowActivateConfirmation,
    setShowDeactivateConfirmation,
    handleRefetchTrue,
    userActivate,
    userDeactivate,
  };
};

export default useUserAccountList;

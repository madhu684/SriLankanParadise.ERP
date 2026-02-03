import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  get_cashier_expense_outs_by_userId_date_api,
  get_approved_expense_out_requisitions,
} from "../../../services/salesApi";
import { UserContext } from "../../../context/userContext";
import toast from "react-hot-toast";

const useCashierExpenseOutList = () => {
  const { user, activeCashierSession } = useContext(UserContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: cashierExpenseOutList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cashierExpenseOutList", user?.userId, date],
    queryFn: async () => {
      const response = await get_cashier_expense_outs_by_userId_date_api(
        date,
        null,
        null
      );
      return response.data.result;
    },
    enabled: !!user?.userId && !!date,
  });

  const {
    data: requisitions = [],
    isLoading: isRequisitionsLoading,
    refetch: refetchRequisitions,
  } = useQuery({
    queryKey: ["approvedExpenseOutRequisitions", 3, searchQuery],
    queryFn: async () => {
      try {
        const response = await get_approved_expense_out_requisitions(
          sessionStorage.getItem("companyId"),
          3,
          searchQuery
        );
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.result)) return response.result;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.data?.result)) return response.data.result;
        return [];
      } catch (error) {
        console.error("Error fetching requisitions:", error);
        return [];
      }
    },
  });

  const handleCreateClick = () => {
    if (activeCashierSession) {
      setShowCreateForm(true);
    } else {
      toast.error(
        "No active cashier session found. Please start a session first."
      );
    }
  };

  const handleRequisitionClick = (requisition) => {
    if (activeCashierSession) {
      setInitialData(requisition);
      setShowCreateForm(true);
    } else {
      toast.error(
        "No active cashier session found. Please start a session first."
      );
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setInitialData(null);
    refetch();
    refetchRequisitions();
  };

  return {
    cashierExpenseOutList,
    isLoading,
    date,
    showCreateForm,
    setDate,
    handleCreateClick,
    handleCloseForm,
    requisitions,
    isRequisitionsLoading,
    handleRequisitionClick,
    initialData,
    searchQuery,
    setSearchQuery,
  };
};

export default useCashierExpenseOutList;

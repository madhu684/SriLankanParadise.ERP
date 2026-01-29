import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { get_cashier_expense_outs_by_userId_date_api } from "../../../services/salesApi";
import { UserContext } from "../../../context/userContext";
import toast from "react-hot-toast";

const useCashierExpenseOutList = () => {
  const { user, activeCashierSession } = useContext(UserContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleCreateClick = () => {
    if (activeCashierSession) {
      setShowCreateForm(true);
    } else {
      toast.error(
        "No active cashier session found. Please start a session first."
      );
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    refetch();
  };

  return {
    cashierExpenseOutList,
    isLoading,
    date,
    showCreateForm,
    setDate,
    handleCreateClick,
    handleCloseForm,
  };
};

export default useCashierExpenseOutList;

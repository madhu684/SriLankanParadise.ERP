import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_user_by_user_id } from "../services/userManagementApi";
import { get_cashier_session_by_user_id_api } from "../services/salesApi";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const fetchUser = async () => {
    if (!user) return;
    try {
      const response = await get_user_by_user_id(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user", sessionStorage.getItem("userId")],
    queryFn: fetchUser,
    enabled: !!sessionStorage.getItem("userId"),
  });

  const fetchCashierSessionByUserId = async () => {
    try {
      const response = await get_cashier_session_by_user_id_api(
        parseInt(sessionStorage.getItem("userId"))
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching cashier session:", error);
    }
  };

  const {
    data: activeCashierSession,
    isLoading: activeCashierSessionLoading,
    isError: activeCashierSessionError,
  } = useQuery({
    queryKey: ["activeCashierSession", sessionStorage.getItem("userId")],
    queryFn: fetchCashierSessionByUserId,
    enabled: !!sessionStorage.getItem("userId"),
  });

  return (
    <UserContext.Provider
      value={{
        user,
        activeCashierSession,
        userLoading,
        activeCashierSessionLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

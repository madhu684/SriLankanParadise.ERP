import { createContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_user_by_user_id } from "../services/userManagementApi";
import { get_cashier_session_by_user_id_api } from "../services/salesApi";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

  const fetchUser = async () => {
    if (!userId) return null;
    try {
      const response = await get_user_by_user_id(userId);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: fetchUser,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const fetchCashierSessionByUserId = async () => {
    if (!userId) return null;
    try {
      const response = await get_cashier_session_by_user_id_api(userId);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching cashier session:", error);
      return null;
    }
  };

  const {
    data: activeCashierSession,
    isLoading: activeCashierSessionLoading,
    isError: activeCashierSessionError,
  } = useQuery({
    queryKey: ["activeCashierSession", userId],
    queryFn: fetchCashierSessionByUserId,
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Function to update userId when user logs in
  const updateUserId = (newUserId) => {
    sessionStorage.setItem("userId", newUserId);
    setUserId(newUserId);
  };

  // Function to clear userId on logout
  const clearUserId = () => {
    sessionStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        activeCashierSession,
        userLoading,
        activeCashierSessionLoading,
        updateUserId,
        clearUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

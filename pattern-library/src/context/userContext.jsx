import { createContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  get_user_by_user_id,
  get_user_permissions_api,
} from "../services/userManagementApi";
import { get_cashier_session_by_user_id_api } from "../services/salesApi";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await get_user_by_user_id(userId);
      return response.data.result;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: activeCashierSession,
    isLoading: activeCashierSessionLoading,
    isError: activeCashierSessionError,
  } = useQuery({
    queryKey: ["activeCashierSession", userId],
    queryFn: async () => {
      const response = await get_cashier_session_by_user_id_api(userId);
      return response.data.result;
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
    error: permissionError,
  } = useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: async () => {
      const response = await get_user_permissions_api(userId);
      return response.data.result;
    },
    enabled: !!userId,
  });

  const permissionsMap = useMemo(() => {
    if (!userPermissions) return new Set();
    return new Set(
      userPermissions
        .filter((p) => p.permission?.permissionStatus)
        .map((p) => p.permission.permissionName)
    );
  }, [userPermissions]);

  // Single permission checking
  const hasPermission = useMemo(() => {
    return (permissionName) => {
      return permissionsMap.has(permissionName);
    };
  }, [permissionsMap]);

  // Multiple permission checking (all required)
  const hasAllPermissions = useMemo(() => {
    return (permissionNames) => {
      return permissionNames.every((name) => permissionsMap.has(name));
    };
  }, [permissionsMap]);

  // Multiple permission checking (any required)
  const hasAnyPermission = useMemo(() => {
    return (permissionNames) => {
      return permissionNames.some((name) => permissionsMap.has(name));
    };
  }, [permissionsMap]);

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
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        updateUserId,
        clearUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

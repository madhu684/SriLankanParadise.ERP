import { useState } from "react";
import {
  get_user_permissions_by_user_id_api,
  get_user_modules_by_user_id_api,
  get_user_roles_by_user_id_api,
  getUserLocationsByUserId,
  company_modules_api,
  module_roles_api,
  role_permissions_api,
} from "../../../services/userManagementApi";
import { useQuery } from "@tanstack/react-query";

const useViewUserDetails = (user) => {
  const [userDetails, setUserDetails] = useState({
    modules: [],
    roles: [],
    permissions: [],
  });

  const [roleIds, setRoleIds] = useState([]);
  const [errors, setErrors] = useState({
    userPermissionsError: "",
    userModulesError: "",
    userRolesError: "",
  });

  const fetchuserLocations = async () => {
    try {
      const response = await getUserLocationsByUserId(parseInt(user.userId));
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching user locations:", error);
    }
  };

  const {
    data: userLocations = [],
    isLoading: userLocationsLoading,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", user.userId],
    queryFn: fetchuserLocations,
  });

  const fetchUserModules = async () => {
    try {
      const response = await get_user_modules_by_user_id_api(
        parseInt(user.userId)
      );

      if (response.status != 200) {
        setErrors((prev) => {
          return {
            ...prev,
            userModulesError: "Error fetching user modules",
          };
        });
      }
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching user modules:", error);
    }
  };

  const { data: userModules = [], isLoading: userModulesLoading } = useQuery({
    queryKey: ["userModules", user.userId],
    queryFn: fetchUserModules,
  });

  const fetchUserRoles = async () => {
    try {
      const response = await get_user_roles_by_user_id_api(
        parseInt(user.userId)
      );

      if (response.status != 200) {
        setErrors((prev) => {
          return {
            ...prev,
            userRolesError: "Error fetching user roles",
          };
        });
      }
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  const { data: userRoles = [], isLoading: userRolesLoading } = useQuery({
    queryKey: ["userRoles", user.userId],
    queryFn: fetchUserRoles,
  });

  const fetchUserPermissions = async () => {
    try {
      const response = await get_user_permissions_by_user_id_api(
        parseInt(user.userId)
      );

      if (response.status != 200) {
        setErrors((prev) => {
          return {
            ...prev,
            userPermissionsError: "Error fetching user permissions",
          };
        });
      }
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  };

  const { data: userPermissions = [], isLoading: userPermissionsLoading } =
    useQuery({
      queryKey: ["userPermissions", user.userId],
      queryFn: fetchUserPermissions,
    });

  return {
    userLocations,
    userModules,
    userRoles,
    userPermissions,
    userLocationsLoading,
    userModulesLoading,
    userRolesLoading,
    userPermissionsLoading,
    userLocationsError,
    errors,
  };
};

export default useViewUserDetails;

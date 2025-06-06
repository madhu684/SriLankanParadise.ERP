namespace SriLankanParadise.ERP.UserManagement.Utilities
{
    public class AuditLogExclusions
    {
        public static readonly List<(string Path, string Method)> ExcludedRoutes = new()
        {
            ("/api/itemMaster/GetItemMastersByItemMasterIds", "POST"),
            ("/api/userPermission/GetUserPermissionsByUserId", "GET"),
            ("/api/audit-log", "POST"),
            ("/api/companySubscriptionModule/modules/company", "GET"),
            ("/api/location/{params}", "GET"),
            ("/api/user/GetAllUsersByCompanyId", "GET"),
            ("/api/location/GetLocationsByCompanyId", "GET"),
            ("/api/userLocation/GetUserLocationsByUserId", "GET"),
            ("/api/role/GetRolesByModuleIds", "GET"),
            ("/api/rolePermission/GetRolePermissionsByRoleIds", "GET"),
            ("/api/module/GetModulesByUserId", "GET"),
            ("/api/userRole/GetUserRolesByUserId", "GET"),
            ("/api/role/GetRolesByCompanyId", "GET"),
            ("/api/permission/GetPermissionsByCompanyId", "GET"),
            ("/api/itemMaster/GetItemMastersByCompanyId", "GET"),
            ("/api/itemMaster/GetItemMastersByUserId", "GET"),
            ("/api/itemMaster/GetItemMastersByCompanyIdWithQuery", "GET"),
            ("/api/unit/GetAllUnitsByCompanyId", "GET"),
            ("/api/measurementType/GetMeasurementTypesByCompanyId", "GET"),
            ("/api/category/GetAllCategoriesByCompanyId", "GET"),
            ("/api/location", "GET"),
            ("/api/locationInventoryMovement", "GET"),
            ("/api/itemMaster/GetItemMasterByItemMasterId","GET"),
            ("/api/issueDetail","GET"),
            ("/api/locationInventory/GetLocationInventoriesByLocationId", "GET"),
            ("/api/audit-log/GetAuditLogByDate", "GET")   // Remove later
        };

        public static bool IsExcluded(string path, string method)
        {
            return ExcludedRoutes.Any(e =>
                (path.Equals(e.Path, StringComparison.OrdinalIgnoreCase) ||
                 path.StartsWith(e.Path + "/", StringComparison.OrdinalIgnoreCase)) &&
                method.Equals(e.Method, StringComparison.OrdinalIgnoreCase));
        }
    }
}

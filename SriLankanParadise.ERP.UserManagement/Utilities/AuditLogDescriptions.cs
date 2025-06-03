using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.Utilities;

public static class AuditLogDescriptions
{
    // Case-insensitive comparer for (string RouteTemplate, string Method)
    private class CaseInsensitiveTupleComparer : IEqualityComparer<(string RouteTemplate, string Method)>
    {
        public bool Equals((string RouteTemplate, string Method) x, (string RouteTemplate, string Method) y)
        {
            return string.Equals(x.RouteTemplate, y.RouteTemplate, StringComparison.OrdinalIgnoreCase) &&
                   string.Equals(x.Method, y.Method, StringComparison.OrdinalIgnoreCase);
        }

        public int GetHashCode((string RouteTemplate, string Method) obj)
        {
            return HashCode.Combine(
                StringComparer.OrdinalIgnoreCase.GetHashCode(obj.RouteTemplate ?? ""),
                StringComparer.OrdinalIgnoreCase.GetHashCode(obj.Method ?? "")
            );
        }
    }

    public static readonly Dictionary<(string RouteTemplate, string Method), string> Descriptions =
        new(new CaseInsensitiveTupleComparer())
        {
            // GET
            { ("/api/productionreports/GetWorkOrderAnalysisReport/{param}/{param}", "GET"), "View Work order analysis report" },
            { ("/api/InventoryReport/InventoryAnalysisReport/{param}/{param}/{param}", "GET"), "View Inventory analysis report" },
            { ("/api/InventoryReport/InventoryAsAtDateReport/{param}/{param}/{param}", "GET"), "View Inventory analysis as at date report" },
            { ("/api/productionreports/GetTraceabilityReport/{param}", "GET"), "View Traceability report" },
            { ("/api/productionreports/GetSFGInventoryAnalysisReport/{param}/{param}", "GET"), "View SFG analysis report" },
            { ("/api/productionreports/GetSFGInventoryAnalysisReportAsAtDate/{param}/{param}", "GET"), "View SFG analysis as at date report" },
            { ("/api/StockMaster/GetStockMastersByDateRangeAndTransactionType", "GET"), "View Stock management report" },
            { ("/api/StockDetail/GetStockTransferDetails", "GET"), "View Stock transfer/adjustment report" },
            { ("/api/productionreports/GetFinishedGoodReport", "GET"), "View Finished goods report" },
            { ("/apiproductionreports/GetFreshnessReport/{param}/{param}", "GET"), "View Freshness report" },
            { ("/api/productionreports/GetVisualWorkOrderAnalysisReport/{param}", "GET"), "View visual Work order analysis report" },

            // POST
            { ("/api/user/logout", "POST"), "User logout" },
            { ("/api/user/register", "POST"), "User Registration create" },
            { ("/api/companySubscriptionModuleUser", "POST"), "User company subscription module create" },
            { ("/api/userRole", "POST"), "User role create" },
            { ("/api/userPermission", "POST"), "User permission create" },
            { ("/api/userLocation", "POST"), "User location create" },
            { ("/api/UserProductionStageMapping", "POST"), "User production mapping create" },
            { ("/api/rolePermission", "POST"), "Role permission create" },
            { ("/api/role", "POST"), "Role create" },
            { ("/api/permission", "POST"), "Permission create" },
            { ("/api/itemMaster", "POST"), "Item master create" },
            { ("/api/unit", "POST"), "Unit create" },
            { ("/api/category", "POST"), "Category create" },
            { ("/api/workOrder", "POST"), "Work order create" },
            { ("/api/locationInventory", "POST"), "Location inventory create" },
            { ("/api/locationInventoryMovement", "POST"), "Location inventory movement create" },
            { ("/api/ClosedWorkOrderMaster", "POST"), "Close work order create" },
            { ("/api/requisitionMaster", "POST"), "MRN master create" },
            { ("/api/requisitionDetail", "POST"), "MRN detail create" },
            { ("/api/sfgTransfer", "POST"), "SFG Create" },
            { ("/api/volumeTransferLog", "POST"), "Volume transfer log create" },
            { ("/api/locationVolumeTransferLog", "POST"), "Location volume transfer log create" },
            { ("/api/receivingWorkOrderMaster", "POST"), "Receiving work order create (work order transfer)" },
            { ("/api/StockMaster", "POST"), "Stock master create" },
            { ("/api/StockDetail", "POST"), "Stock detail create" },
            { ("/api/productionStageItem", "POST"), "Production stage item create" },
            { ("/api/productionLocation", "POST"), "Production location create" },
            { ("/api/productionWarehouseMapping", "POST"), "Production warehouse mapping create" },
            { ("/api/productionStage", "POST"), "Production stage create" },
            { ("/api/location", "POST"), "Company location create" },

            // PUT
            { ("/api/user/deactivate/{param}", "PUT"), "User deactivate" },
            { ("/api/user/activate/{param}", "PUT"), "User activate" },
            { ("/api/user/{param}", "PUT"), "user update" },
            { ("/api/userLocation/UpdateUserLocations/{param}", "PUT"), "User location update" },
            { ("/api/companySubscriptionModuleUser", "PUT"), "User company subscription module update" },
            { ("/api/userRole/UpdateUserRole/{param}", "PUT"), "User role update" },
            { ("/api/userPermission/UpdateUserPermissions/{param}", "PUT"), "User permissions update" },
            { ("/api/UserProductionStageMapping", "PUT"), "User production mapping update" },
            { ("/api/role/{param}", "PUT"), "Role update" },
            { ("/api/permission/{param}", "PUT"), "Permission update" },
            { ("/api/itemMaster/{param}", "PUT"), "Item master update" },
            { ("/api/unit/{param}", "PUT"), "Unit update" },
            { ("/api/category/{param}", "PUT"), "Category update" },
            { ("/api/workOrder/UpdateWorkOrder/{param}", "PUT"), "Update work order" },
            { ("/api/ClosedWorkOrderMaster/{param}", "PUT"), "Update closed work order" },
            { ("/api/sfgTransfer/{param}", "PUT"), "SFG update" },
            { ("/api/productionStageItem/{param}", "PUT"), "Production stage item update" },
            { ("/api/productionLocation/{param}", "PUT"), "Production location update" },
            { ("/api/productionWarehouseMapping/{param}", "PUT"), "Production warehouse mapping update" },
            { ("/api/productionStage/{param}", "PUT"), "Production stage update" },
            { ("/api/location/{param}", "PUT"), "Company location update" },

            // PATCH
            { ("/api/user/reset-password/{param}", "PATCH"), "Reset password" },
            { ("/api/user/reset-password-admin/{param}/{param}", "PATCH"), "Reset password admin" },

            // DELETE
            { ("/api/rolePermission/DeleteRolePermissionByRoleId/{param}", "DELETE"), "Role permission delete" },
            { ("/api/role/{param}", "DELETE"), "Eole delete" },
            { ("/api/permission/{param}", "DELETE"), "Permission delete" },
            { ("/api/itemMaster/{param}", "DELETE"), "Item master delete" },
            { ("/api/unit/{param}", "DELETE"), "Unit delete" },
            { ("/api/category/{param}", "DELETE"), "Category delete" },
            { ("/api/productionStageItem/{param}", "DELETE"), "Production stage item delete" },
            { ("/api/productionLocation/{param}", "DELETE"), "Production location delete" },
            { ("/api/productionWarehouseMapping/{param}", "DELETE"), "Production warehouse mapping delete" },
            { ("/api/productionStage/{param}", "DELETE"), "Production stage delete" },
            { ("/api/location/{param}", "DELETE"), "Company location delete" },
        };

    // Helper to get audit description
    public static string GetDescription(string actualPath, string method)
    {
        foreach (var entry in Descriptions)
        {
            var routeTemplate = entry.Key.RouteTemplate;
            if (IsRouteMatch(routeTemplate, actualPath) &&
                method.Equals(entry.Key.Method, StringComparison.OrdinalIgnoreCase))
            {
                return entry.Value;
            }
        }

        return "Fetch reference data";
    }

    private static bool IsRouteMatch(string template, string actual)
    {
        var templateSegments = template.Trim('/').Split('/');
        var actualSegments = actual.Trim('/').Split('/');

        if (templateSegments.Length != actualSegments.Length)
            return false;

        for (int i = 0; i < templateSegments.Length; i++)
        {
            if (templateSegments[i].StartsWith("{") && templateSegments[i].EndsWith("}"))
                continue;
            if (!string.Equals(templateSegments[i], actualSegments[i], StringComparison.OrdinalIgnoreCase))
                return false;
        }

        return true;
    }
}


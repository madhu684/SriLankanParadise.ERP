﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IRolePermissionService
    {
        Task AddRolePermission(RolePermission rolePermission);

        Task<IEnumerable<RolePermission>> GetRolePermissionsByRoleId(int roleId);

        Task<Boolean> IsRolePermissionAlreadyAssigned(int permissionId);

        Task DeleteRolePermission(int roleId, int permissionId);
        Task DeleteRolePermissionByRoleId(int roleId);

        Task<Dictionary<int, List<RolePermission>>> GetRolePermissionsByRoleIds(int[] roleIds);
    }
}

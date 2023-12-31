﻿using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class UserPermissionRepository : IUserPermissionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public UserPermissionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddUserPermission(UserPermission userPermission)
        {
            try
            {
                _dbContext.UserPermissions.Add(userPermission);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

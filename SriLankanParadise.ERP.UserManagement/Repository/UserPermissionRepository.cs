﻿using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
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
                await _dbContext.UserPermissions.AddAsync(userPermission);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<UserPermission>> GetUserPermissionsByUserId(int userId)
        {
            try
            {
                var userPermissions = await _dbContext.UserPermissions
                    .Where(up => up.UserId == userId)
                    .Include(up => up.Permission)
                    .ToListAsync();

                if (userPermissions.Any())
                {
                    return userPermissions;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteUserPermissions(int userId)
        {
            try
            {
                var userPermissions = await _dbContext.UserPermissions
                    .Where(up => up.UserId == userId)
                    .ToListAsync();

                if (userPermissions.Any())
                {
                    _dbContext.UserPermissions.RemoveRange(userPermissions);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

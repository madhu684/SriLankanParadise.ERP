﻿using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ModuleRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddModule(Module module)
        {
            try
            {
                _dbContext.Modules.Add(module);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteModule(int moduleId)
        {
            try
            {
                var module = await _dbContext.Modules.FindAsync(moduleId);

                if (module != null)
                {
                    _dbContext.Modules.Remove(module);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Module>> GetAll()
        {
            try
            {
                return await _dbContext.Modules.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Module> GetModuleByModuleId(int moduleId)
        {
            try
            {
                var module = await _dbContext.Modules
                .Where(c => c.ModuleId == moduleId)
                .FirstOrDefaultAsync();

                return module;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateModule(int moduleId, Module module)
        {
            try
            {
                var existModule = await _dbContext.Modules.FindAsync(moduleId);

                if (existModule != null)
                {
                    _dbContext.Entry(existModule).CurrentValues.SetValues(module);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<ModuleWithIdDto>> GetModulesByUserId(int userId)
{
    try
    {
        var modules = await _dbContext.CompanySubscriptionModuleUsers
            .Where(csmu => csmu.UserId == userId)
            .Join(
                _dbContext.CompanySubscriptionModules,
                csmu => csmu.CompanySubscriptionModuleId,
                csm => csm.CompanySubscriptionModuleId,
                (csmu, csm) => new { csmu.CompanySubscriptionModuleId, csm }
            )
            .Join(
                _dbContext.SubscriptionModules,
                x => x.csm.SubscriptionModuleId,
                sm => sm.SubscriptionModuleId,
                (x, sm) => new { x.CompanySubscriptionModuleId, sm }
            )
            .Join(
                _dbContext.Modules,
                x => x.sm.ModuleId,
                m => m.ModuleId,
                (x, m) => new ModuleWithIdDto
                {
                    CompanySubscriptionModuleId = x.CompanySubscriptionModuleId,
                    ModuleId = m.ModuleId,
                    ModuleName = m.ModuleName,
                    Status = m.Status,
                    SubModules = m.SubModules.Select(sm => new SubModuleDto
                    {
                        SubModuleName = sm.SubModuleName,
                        Status = sm.Status,
                        ModuleId = sm.ModuleId,
                    })
                }
            )
            .ToListAsync();

        return modules;
    }
    catch (Exception)
    {
        throw;
    }
}


    }
}

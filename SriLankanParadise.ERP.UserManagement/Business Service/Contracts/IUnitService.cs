﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUnitService
    {
        Task AddUnit(Unit unit);

        Task<IEnumerable<Unit>> GetAll();

        Task<IEnumerable<Unit>> GetUnitsByCompanyId(int companyId);

        Task<IEnumerable<Unit>> GetAllUnitsByCompanyId(int companyId);

        Task<Unit> GetUnitByUnitId(int unitId);

        Task UpdateUnit(int unitId, Unit unit);

        Task DeleteUnit(int unitId);
    }
}

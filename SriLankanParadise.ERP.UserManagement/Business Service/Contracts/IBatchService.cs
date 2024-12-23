﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IBatchService
    {
        Task AddBatch(Batch batch);

        Task<IEnumerable<Batch>> GetAll();

        Task<IEnumerable<Batch>> GetBatchesByCompanyId(int companyId);
    }
}

﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IIssueMasterRepository
    {
        Task AddIssueMaster(IssueMaster issueMaster);

        Task<IEnumerable<IssueMaster>> GetAll();

        Task<IEnumerable<IssueMaster>> GetIssueMastersWithoutDraftsByCompanyId(int companyId);

        Task ApproveIssueMaster(int issueMasterId, IssueMaster issueMaster);

        Task<IssueMaster> GetIssueMasterByIssueMasterId(int issueMasterId);

        Task<IEnumerable<IssueMaster>> GetIssueMastersByUserId(int userId);

        Task<IEnumerable<IssueMaster>> GetIssueMastersByRequisitionMasterId(int requisitionMasterId);
    }
}

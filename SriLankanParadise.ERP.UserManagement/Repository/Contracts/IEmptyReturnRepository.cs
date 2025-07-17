using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IEmptyReturnRepository
    {
        Task<EmptyReturnMaster> AddEmptyReturnAsync(EmptyReturnMaster master);
        Task<IEnumerable<EmptyReturnMaster>> GetEmptyReturnsByCompanyAsync(int companyId);
        Task<EmptyReturnMaster> GetEmptyReturnMasterById(int id);
        //Task UpdateEmptyReturnMasterAndDetails(EmptyReturnMaster masterWithDetails);
        Task UpdateEmptyReturnMasterAndDetails(int emptyReturnMasterId, UpdateEmptyReturnRequestModel requestModel);
        Task<bool> ApproveEmptyReturnMaster(int emptyReturnMasterId, ApproveEmptyReturnRequestModel request);


    }
}

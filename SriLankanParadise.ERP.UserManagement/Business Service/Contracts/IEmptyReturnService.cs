using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IEmptyReturnService
    {
        Task<EmptyReturnMaster> AddEmptyReturnAsync(AddEmptyReturnRequestModel requestModel);
        Task<IEnumerable<EmptyReturnMaster>> GetEmptyReturnsAsync(int companyId);
        Task<EmptyReturnMaster> GetEmptyReturnMasterById(int id);
        Task UpdateEmptyReturnMasterAndDetails(EmptyReturnMaster masterWithDetails);
        Task<bool> ApproveEmptyReturnMaster(int emptyReturnMasterId, ApproveEmptyReturnRequestModel request);


    }
}

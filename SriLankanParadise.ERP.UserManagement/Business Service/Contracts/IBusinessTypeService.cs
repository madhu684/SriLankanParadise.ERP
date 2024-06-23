using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IBusinessTypeService
    {
        Task AddBusinessType(BusinessType businessType);

        Task<IEnumerable<BusinessType>> GetAll();
    }
}

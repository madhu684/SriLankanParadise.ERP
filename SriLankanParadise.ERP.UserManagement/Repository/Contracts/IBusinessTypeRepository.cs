using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IBusinessTypeRepository
    {
        Task AddBusinessType(BusinessType businessType);

        Task<IEnumerable<BusinessType>> GetAll();
    }
}

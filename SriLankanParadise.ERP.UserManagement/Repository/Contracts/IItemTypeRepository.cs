using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemTypeRepository
    {
        Task<IEnumerable<ItemType>> GetItemTypesByCompanyId(int companyId);
    }
}

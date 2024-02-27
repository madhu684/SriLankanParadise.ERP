using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemTypeService
    {
        Task<IEnumerable<ItemType>> GetItemTypesByCompanyId(int companyId);
    }
}

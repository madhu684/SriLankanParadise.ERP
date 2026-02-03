using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemModeService
    {
        Task<IEnumerable<ItemMode>> GetAllItemModesAsync();
    }
}

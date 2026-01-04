using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemModeRepository
    {
        Task<IEnumerable<ItemMode>> GetAllItemModesAsync();
    }
}

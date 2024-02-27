using SriLankanParadise.ERP.UserManagement.DataModels;
using System.Threading.Tasks;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemMasterRepository
    {
        Task AddItemMaster(ItemMaster itemMaster);

        Task<IEnumerable<ItemMaster>> GetAll();

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId);

        Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId);

        Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster);

        Task DeleteItemMaster(int itemMasterId);

        Task<IEnumerable<ItemMaster>> GetItemMastersByUserId(int userId);
    }
}

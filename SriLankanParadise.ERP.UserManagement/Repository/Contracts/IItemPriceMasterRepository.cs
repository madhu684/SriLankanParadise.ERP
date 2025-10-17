using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemPriceMasterRepository
    {
        Task AddItemPriceMaster(ItemPriceMaster itemPriceMaster);
        Task<ItemPriceMaster> GetItemPriceMasterById(int id);
        Task<IEnumerable<ItemPriceMaster>> GetItemPriceMasterByCompanyId(int companyId);
    }
}

using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemPriceMasterService
    {
        Task AddItemPriceMaster(ItemPriceMaster itemPriceMaster);
        Task UpdateItemPriceMaster(int id, ItemPriceMaster itemPriceMaster);
        Task ChangeStatus(int id, ItemPriceMaster itemPriceMaster);
        Task<ItemPriceMaster> GetItemPriceMasterById(int id);
        Task<ItemPriceMaster> GetItemPriceMasterByLocationId(int locationId);
        Task<IEnumerable<ItemPriceMaster>> GetItemPriceMasterByCompanyId(int companyId);
    }
}

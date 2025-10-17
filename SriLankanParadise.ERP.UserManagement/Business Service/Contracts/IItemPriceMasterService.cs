using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemPriceMasterService
    {
        Task AddItemPriceMaster(ItemPriceMaster itemPriceMaster);
        Task<ItemPriceMaster> GetItemPriceMasterById(int id);
        Task<IEnumerable<ItemPriceMaster>> GetItemPriceMasterByCompanyId(int companyId);
    }
}

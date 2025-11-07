using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemPriceDetailService
    {
        Task AddItemPriceDetail(ItemPriceDetail itemPriceDetail);
        Task<ItemPriceDetail> GetById(int id);
        Task<IEnumerable<ItemPriceDetail>> GetByItemPriceMasterId(int itemPriceMasterId);
    }
}

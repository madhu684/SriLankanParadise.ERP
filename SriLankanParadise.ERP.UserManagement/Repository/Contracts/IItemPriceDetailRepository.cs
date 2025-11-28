using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemPriceDetailRepository
    {
        Task AddItemPriceDetail(ItemPriceDetail itemPriceDetail);
        Task UpdateItemPriceDetail(int id, ItemPriceDetail itemPriceDetail);
        Task DeleteItemPriceDetail(int id);
        Task<ItemPriceDetail> GetById(int id);
        Task<IEnumerable<ItemPriceDetail>> GetByItemPriceMasterId(int itemPriceMasterId);
    }
}

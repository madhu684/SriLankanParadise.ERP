using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemPriceDetailRepository
    {
        Task AddItemPriceDetail(ItemPriceDetail itemPriceDetail);
        Task<ItemPriceDetail> GetById(int id);
        Task<IEnumerable<ItemPriceDetail>> GetByItemPriceMasterId(int itemPriceMasterId);
    }
}

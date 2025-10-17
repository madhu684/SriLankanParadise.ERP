using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemPriceDetailService : IItemPriceDetailService
    {
        private readonly IItemPriceDetailRepository _repository;

        public ItemPriceDetailService(IItemPriceDetailRepository repository)
        {
            _repository = repository;
        }

        public async Task AddItemPriceDetail(ItemPriceDetail itemPriceDetail)
        {
            await _repository.AddItemPriceDetail(itemPriceDetail);
        }

        public async Task<ItemPriceDetail> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<IEnumerable<ItemPriceDetail>> GetByItemPriceMasterId(int itemPriceMasterId)
        {
            return await _repository.GetByItemPriceMasterId(itemPriceMasterId);
        }
    }
}

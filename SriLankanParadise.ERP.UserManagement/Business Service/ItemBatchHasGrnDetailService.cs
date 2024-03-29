using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemBatchHasGrnDetailService : IItemBatchHasGrnDetailService
    {
        private readonly IItemBatchHasGrnDetailRepository _itemBatchHasGrnDetailRepository;
        public ItemBatchHasGrnDetailService(IItemBatchHasGrnDetailRepository itemBatchHasGrnDetailRepository)
        {
            _itemBatchHasGrnDetailRepository = itemBatchHasGrnDetailRepository;
        }

        public async Task AddItemBatchHasGrnDetail(ItemBatchHasGrnDetail itemBatchHasGrnDetail)
        {
            await _itemBatchHasGrnDetailRepository.AddItemBatchHasGrnDetail(itemBatchHasGrnDetail);
        }
    }
}

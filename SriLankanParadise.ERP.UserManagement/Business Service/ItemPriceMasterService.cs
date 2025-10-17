using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemPriceMasterService : IItemPriceMasterService
    {
        private readonly IItemPriceMasterRepository _repository;

        public ItemPriceMasterService(IItemPriceMasterRepository repository)
        {
            _repository = repository;
        }

        public async Task AddItemPriceMaster(ItemPriceMaster itemPriceMaster)
        {
            await _repository.AddItemPriceMaster(itemPriceMaster);
        }

        public Task<IEnumerable<ItemPriceMaster>> GetItemPriceMasterByCompanyId(int companyId)
        {
            return _repository.GetItemPriceMasterByCompanyId(companyId);
        }

        public Task<ItemPriceMaster> GetItemPriceMasterById(int id)
        {
            return _repository.GetItemPriceMasterById(id);
        }
    }
}

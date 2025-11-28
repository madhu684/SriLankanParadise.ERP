using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemPriceMasterService : IItemPriceMasterService
    {
        private readonly IItemPriceMasterRepository _repository;
        private readonly ILocationRepository _locationRepository;

        public ItemPriceMasterService(IItemPriceMasterRepository repository, ILocationRepository locationRepository)
        {
            _repository = repository;
            _locationRepository = locationRepository;
        }

        public async Task AddItemPriceMaster(ItemPriceMaster itemPriceMaster)
        {
            await _repository.AddItemPriceMaster(itemPriceMaster);
        }

        public async Task ChangeStatus(int id, ItemPriceMaster itemPriceMaster)
        {
            await _repository.ChangeStatus(id, itemPriceMaster);
        }

        public Task<IEnumerable<ItemPriceMaster>> GetItemPriceMasterByCompanyId(int companyId)
        {
            return _repository.GetItemPriceMasterByCompanyId(companyId);
        }

        public Task<ItemPriceMaster> GetItemPriceMasterById(int id)
        {
            return _repository.GetItemPriceMasterById(id);
        }

        public async Task<ItemPriceMaster> GetItemPriceMasterByLocationId(int locationId)
        {
            var location = await _locationRepository.GetLocationByLocationId(locationId);
            if (location == null)
            {
                return null;
            }

            if (location.PriceMasterId == null)
            {
                return null;
            }

            var itemPriceMaster = await _repository.GetItemPriceMasterById(location.PriceMasterId.Value);
            return itemPriceMaster;
        }

        public async Task UpdateItemPriceMaster(int id, ItemPriceMaster itemPriceMaster)
        {
            await _repository.UpdateItemPriceMaster(id, itemPriceMaster);
        }
    }
}

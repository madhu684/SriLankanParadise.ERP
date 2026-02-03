using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemModeService : IItemModeService
    {
        private readonly IItemModeRepository _repository;

        public ItemModeService(IItemModeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ItemMode>> GetAllItemModesAsync()
        {
            return await _repository.GetAllItemModesAsync();
        }
    }
}

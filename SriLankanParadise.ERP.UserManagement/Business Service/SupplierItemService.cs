using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SupplierItemService : ISupplierItemService
    {
        private readonly ISupplierItemRepository _repository;

        public SupplierItemService(ISupplierItemRepository repository)
        {
            _repository = repository;
        }

        public async Task Create(SupplierItem supplierItem)
        {
           await _repository.Create(supplierItem);
        }

        public async Task Delete(int itemMasterId)
        {
            await _repository.Delete(itemMasterId);
        }

        public async Task<SupplierItem> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<IEnumerable<SupplierItem>> GetItemsBySupplierId(int supplierId)
        {
            return await _repository.GetItemsBySupplierId(supplierId);
        }

        public async Task Update(int itemMasterId, SupplierItem supplierItem)
        {
            await _repository.Update(itemMasterId, supplierItem);
        }
    }
}

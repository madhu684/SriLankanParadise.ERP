using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;
        public SupplierService(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId)
        {
            return await _supplierRepository.GetSuppliersByCompanyId(companyId);
        }

        public async Task AddSupplier(Supplier supplier)
        {
            await _supplierRepository.AddSupplier(supplier);
        }

        public async Task<Supplier> GetSupplierBySupplierId(int supplierId)
        {
            return await _supplierRepository.GetSupplierBySupplierId(supplierId);
        }

        public async Task UpdateSupplier(int supplierId, Supplier supplier)
        {
            await _supplierRepository.UpdateSupplier(supplierId, supplier);
        }

        public async Task DeleteSupplier(int supplierId)
        {
            await _supplierRepository.DeleteSupplier(supplierId);
        }

    }
}

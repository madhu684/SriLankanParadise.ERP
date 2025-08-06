using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplierRepository
    {
        Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId);

        Task<IEnumerable<Supplier>> GetSuppliersByCompanyIdWithSearchQuery(int companyId, string searchQuery);

        Task AddSupplier(Supplier supplier);

        Task<Supplier> GetSupplierBySupplierId(int supplierId);

        Task UpdateSupplier(int supplierId, Supplier supplier);

        Task DeleteSupplier(int supplierId);

        Task<string> SaveSupplierLogo(IFormFile file, string fileName);

        Task<string> SaveSupplierAttachment(IFormFile file, string fileName);

        Task<string> GetSupplierLogoPathAsync(int supplierId);

    }
}

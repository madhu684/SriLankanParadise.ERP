using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId);

        Task<IEnumerable<Supplier>> GetSuppliersByCompanyIdWithSearchQuery(int companyId, string searchQuery);

        Task AddSupplier(Supplier supplier);

        Task<Supplier> GetSupplierBySupplierId(int supplierId);

        Task UpdateSupplier(int supplierId, Supplier supplier);

        Task DeleteSupplier(int supplierId);

        Task<string> UploadSupplierLogo(IFormFile file);

        Task<string> UploadSupplierAttachment(IFormFile file);

        Task<(byte[], string)> GetSupplierLogoFileAndContentTypeAsync(int supplierId);
    }
}

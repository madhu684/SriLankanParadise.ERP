using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
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

        public async Task<string> UploadSupplierLogo(IFormFile file)
        {

            // Validate and process the file if needed
            // Generate a unique filename
            //var uniqueFileName = Path.GetFileNameWithoutExtension(file.FileName) + "_" + Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var fileName = file.FileName;
            return await _supplierRepository.SaveSupplierLogo(file, fileName);

        }

        public async Task<string> UploadSupplierAttachment(IFormFile file)
        {

            // Validate and process the file if needed
            var fileName = file.FileName;
            return await _supplierRepository.SaveSupplierAttachment(file, fileName);

        }

        public async Task<(byte[], string)> GetSupplierLogoFileAndContentTypeAsync(int supplierId)
        {
            var logoPath = await _supplierRepository.GetSupplierLogoPathAsync(supplierId);
            if (logoPath == null)
            {
                return (null, null); 
            }

            // Load the logo file based on the logo path
            if (!File.Exists(logoPath))
            {
                return (null, null); 
            }

            // Read the logo file as bytes
            var logoBytes = await File.ReadAllBytesAsync(logoPath);

            // Get the content type based on the logo file extension
            var contentType = GetContentType(logoPath);

            return (logoBytes, contentType);
        }


        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            switch (extension)
            {
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                // Add more cases as needed
                default:
                    return "application/octet-stream"; // Default content type
            }
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersByCompanyIdWithSearchQuery(int companyId, string searchQuery)
        {
            return await _supplierRepository.GetSuppliersByCompanyIdWithSearchQuery(companyId, searchQuery);
        }
    }
}

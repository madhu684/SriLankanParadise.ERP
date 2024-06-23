using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SupplierAttachmentService : ISupplierAttachmentService
    {
        private readonly ISupplierAttachmentRepository _supplierAttachmentRepository;

        public SupplierAttachmentService(ISupplierAttachmentRepository supplierAttachmentRepository)
        {
            _supplierAttachmentRepository = supplierAttachmentRepository;
        }

        public async Task AddSupplierAttachment(SupplierAttachment supplierAttachment)
        {
            await _supplierAttachmentRepository.AddSupplierAttachment(supplierAttachment);
        }

        public async Task<SupplierAttachment> GetSupplierAttachmentBySupplierAttachmentId(int supplierAttachmentId)
        {
            return await _supplierAttachmentRepository.GetSupplierAttachmentBySupplierAttachmentId(supplierAttachmentId);
        }

        public async Task DeleteSupplierAttachment(int supplierAttachmentId)
        {
            await _supplierAttachmentRepository.DeleteSupplierAttachment(supplierAttachmentId);
        }

        public async Task<(byte[], string)> GetSupplierAttachmentFileAndContentTypeAsync(int supplierAttachmentId)
        {
            var attachmentPath = await _supplierAttachmentRepository.GetSupplierAttachmentPathAsync(supplierAttachmentId);
            if (attachmentPath == null || !attachmentPath.Any())
            {
                return (null, null);
            }

            // Load the attachment file based on the attachment file path
            if (!File.Exists(attachmentPath))
            {
                return (null, null);
            }

            // Read the attachment file as bytes
            var fileBytes = await File.ReadAllBytesAsync(attachmentPath);

            // Get the content type based on the logo file extension
            var contentType = GetContentType(attachmentPath);

            return (fileBytes, contentType);
        }


        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName)?.ToLower();
            switch (extension)
            {
                case ".pdf":
                    return "application/pdf";
                case ".doc":
                case ".docx":
                    return "application/msword";
                case ".xls":
                case ".xlsx":
                    return "application/vnd.ms-excel";
                case ".ppt":
                case ".pptx":
                    return "application/vnd.ms-powerpoint";
                // Add more cases as needed
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                default:
                    return "application/octet-stream"; // Default content type
            }
        }

        public async Task UpdateSupplierAttachment(int supplierAttachmentId, SupplierAttachment supplierAttachment)
        {
            await _supplierAttachmentRepository.UpdateSupplierAttachment(supplierAttachmentId, supplierAttachment);
        }
    }
}

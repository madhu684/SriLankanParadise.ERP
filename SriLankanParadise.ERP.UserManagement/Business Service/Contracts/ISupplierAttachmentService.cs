using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplierAttachmentService
    {
        Task AddSupplierAttachment(SupplierAttachment supplierAttachment);

        Task<SupplierAttachment> GetSupplierAttachmentBySupplierAttachmentId(int supplierAttachmentId);

        Task DeleteSupplierAttachment(int supplierAttachmentId);

        Task<(byte[], string)> GetSupplierAttachmentFileAndContentTypeAsync(int supplierAttachmentId);

        Task UpdateSupplierAttachment(int supplierAttachmentId, SupplierAttachment supplierAttachment);
    }
}

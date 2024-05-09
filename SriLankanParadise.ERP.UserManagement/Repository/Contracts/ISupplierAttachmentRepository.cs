using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplierAttachmentRepository
    {
        Task AddSupplierAttachment(SupplierAttachment supplierAttachment);

        Task<SupplierAttachment> GetSupplierAttachmentBySupplierAttachmentId(int supplierAttachmentId);

        Task DeleteSupplierAttachment(int supplierAttachmentId);

        Task<string> GetSupplierAttachmentPathAsync(int supplierAttachmentId);

        Task UpdateSupplierAttachment(int supplierAttachmentId, SupplierAttachment supplierAttachment);
    }
}

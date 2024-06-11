namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SupplierAttachmentRequestModel
    {
        public int? SupplierId { get; set; }

        public string? AttachmentPath { get; set; }

        public int? Status { get; set; }

        public int PermissionId { get; set; }

    }
}

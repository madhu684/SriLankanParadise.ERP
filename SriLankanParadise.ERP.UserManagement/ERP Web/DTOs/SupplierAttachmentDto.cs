namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplierAttachmentDto
    {
        public int SupplierAttachmentId { get; set; }

        public int? SupplierId { get; set; }

        public string? AttachmentPath { get; set; }

        public int? Status { get; set; }
    }
}

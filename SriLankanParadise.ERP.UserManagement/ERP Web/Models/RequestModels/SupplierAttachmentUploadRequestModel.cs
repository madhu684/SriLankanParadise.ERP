namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SupplierAttachmentUploadRequestModel
    {
        public int PermissionId { get; set; }
        public IFormFile AttachmentFile { get; set; }
    }
}

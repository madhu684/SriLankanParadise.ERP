namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class InitializeItemBatchRequestModel
    {
        public int ItemMasterId { get; set; }
        public int CompanyId { get; set; }
        public int LocationId { get; set; }
        public string? CreatedBy { get; set; }
        public int? CreatedUserId { get; set; }
    }
}

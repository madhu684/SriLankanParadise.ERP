namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ApproveEmptyReturnRequestModel
    {
        public int Status { get; set; }
        public string ApprovedBy { get; set; } = string.Empty;
        public int ApprovedUserId { get; set; }
    }
}

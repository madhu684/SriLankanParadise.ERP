namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class UpdateIssueDetailRequestModel
    {
        public int IssueDetailId { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public decimal? ReturnedQuantity { get; set; }
    }
}

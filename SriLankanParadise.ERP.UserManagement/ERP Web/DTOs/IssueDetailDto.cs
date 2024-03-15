namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class IssueDetailDto
    {
        public int IssueDetailId { get; set; }

        public int IssueMasterId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int? Quantity { get; set; }
    }
}

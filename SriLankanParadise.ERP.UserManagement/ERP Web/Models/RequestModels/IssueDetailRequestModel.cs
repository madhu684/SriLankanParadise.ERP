namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public interface IssueDetailRequestModel
    {
        public int IssueMasterId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int? Quantity { get; set; }

        public int PermissionId { get; set; }
    }
}

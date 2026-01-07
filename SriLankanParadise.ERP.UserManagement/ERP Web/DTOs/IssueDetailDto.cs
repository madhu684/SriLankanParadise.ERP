namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class IssueDetailDto
    {
        public int IssueDetailId { get; set; }

        public int IssueMasterId { get; set; }


        public int ItemMasterId { get; set; }

        public virtual ItemMasterDto? ItemMaster { get; set; }

        public int? BatchId { get; set; }

        public virtual BatchDto? Batch { get; set; }

        public int? Quantity { get; set; }

        public decimal? ReceivedQuantity { get; set; }

        public decimal? ReturnedQuantity { get; set; }
    }
}

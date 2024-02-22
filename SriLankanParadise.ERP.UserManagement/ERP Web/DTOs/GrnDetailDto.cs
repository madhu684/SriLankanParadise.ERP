namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class GrnDetailDto
    {
        public int GrnDetailId { get; set; }

        public int GrnMasterId { get; set; }

        public int? ReceivedQuantity { get; set; }

        public int? AcceptedQuantity { get; set; }

        public int? RejectedQuantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? TotalPrice { get; set; }

        public string? ItemId { get; set; }
    }
}

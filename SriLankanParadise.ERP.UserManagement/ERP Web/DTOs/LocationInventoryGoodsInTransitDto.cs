namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LocationInventoryGoodsInTransitDto
    {
        public int LocationInventoryGoodsInTransitId { get; set; }

        public int ToLocationId { get; set; }

        public int FromLocationId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public DateTime? Date { get; set; }

        public int? Status { get; set; }

        public int? Qty { get; set; }
    }
}

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LocationInventoryMovementDto
    {
        public int LocationInventoryMovementId { get; set; }

        public int MovementTypeId { get; set; }

        public int TransactionTypeId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }
        public int? ReferenceNo { get; set; }
        public string? BatchNo { get; set; }

        public DateTime? Date { get; set; }

        public decimal? Qty { get; set; }
    }
}

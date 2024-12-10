using System.ComponentModel.DataAnnotations.Schema;

namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class DailyLocationInventory
    {
        public int Id { get; set; }

        public DateOnly RunDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public int LocationInventoryId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        [Column(TypeName = "decimal(18, 8)")]
        public decimal? StockInHand { get; set; }

        public string? BatchNo { get; set; }
        public DateTime? ExpirationDate { get; set; }

        public virtual LocationInventory LocationInventory { get; set; } = null!;

        public virtual ItemMaster ItemMaster { get; set; } = null!;

        public virtual Location Location { get; set; } = null!;
    }
}

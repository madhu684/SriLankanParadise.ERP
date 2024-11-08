using SriLankanParadise.ERP.UserManagement.DataModels;
using System.ComponentModel.DataAnnotations.Schema;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class DailyLocationInventoryDto
    {
        public int Id { get; set; }

        public DateOnly RunDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public int LocationInventoryId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public decimal? StockInHand { get; set; }

        public string? BatchNo { get; set; }

        public virtual LocationInventoryDto LocationInventory { get; set; } = null!;

        public virtual ItemMasterDto ItemMaster { get; set; } = null!;

        public virtual BatchDto Batch { get; set; } = null!;

        public virtual LocationDto Location { get; set; } = null!;
    }
}

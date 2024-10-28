using SriLankanParadise.ERP.UserManagement.DataModels;
using System.ComponentModel.DataAnnotations.Schema;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class DailyLocationInventoryDto
    {
        public DateTime RunDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public int LocationInventoryId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public decimal? StockInHand { get; set; }

        public string? BatchNo { get; set; }

        public virtual LocationInventory LocationInventory { get; set; } = null!;

        public virtual ItemMaster ItemMaster { get; set; } = null!;

        public virtual Batch Batch { get; set; } = null!;

        public virtual Location Location { get; set; } = null!;
    }
}

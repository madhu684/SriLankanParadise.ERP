using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ItemMasterDto
    {
        public int ItemMasterId { get; set; }

        public int UnitId { get; set; }

        public int CategoryId { get; set; }

        public string? ItemName { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? ItemTypeId { get; set; }

        public int? ParentId { get; set; }

        public int? InventoryUnitId { get; set; }
        public decimal? UnitPrice { get; set; }

        public decimal? ConversionRate { get; set; }

        public string? ItemCode { get; set; }

        public int? ReorderLevel { get; set; }

        public bool? IsInventoryItem { get; set; }

        //new properties

        public decimal? CostRatio { get; set; }

        public decimal? FOBInUSD { get; set; }

        public decimal? LandedCost { get; set; }

        public decimal? MinNetSellingPrice { get; set; }

        public decimal? SellingPrice { get; set; }

        public decimal? MRP { get; set; }

        public decimal? CompetitorPrice { get; set; }

        public decimal LabelPrice { get; set; }

        public decimal? AverageSellingPrice { get; set; }

        public decimal? StockClearance { get; set; }

        public decimal? BulkPrice { get; set; }

        public int? SupplierId { get; set; }

        public virtual UnitDto? Unit { get; set; }
        public virtual CategoryDto? Category { get; set; }
        public virtual UnitDto? InventoryUnit { get; set; }
        public virtual ItemTypeDto? ItemType { get; set; }
        public virtual SupplierDto? Supplier { get; set; }
        public ICollection<SubItemMasterDto>? SubItemMasters { get; set; }


    }
}
namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemMasterRequestModel
    {
        public int? UnitId { get; set; }

        public int CategoryId { get; set; }

        public string? ItemName { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? ItemTypeId { get; set; }

        public int? ParentId { get; set; }
        public int? InventoryUnitId { get; set; }
        public decimal? ConversionRate { get; set; }
        public string? ItemCode { get; set; }
        public int? ReorderLevel { get; set; }
        public bool? IsInventoryItem { get; set; }
        public decimal? UnitPrice { get; set; }

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

        //new properties

        public int PermissionId { get; set; }
        public IEnumerable<SubItemMasterRequestModel>? SubItemMasters { get; set; }
    }
}
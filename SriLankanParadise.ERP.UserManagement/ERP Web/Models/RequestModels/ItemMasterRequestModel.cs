namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemMasterRequestModel
    {
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

        public decimal? ConversionRate { get; set; }

        public string? ItemCode { get; set; }

        public int? ReorderLevel { get; set; }

        public int PermissionId { get; set; }
    }
}

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemMasterRequestModel
    {
        public int UnitId { get; set; }

        public int CategoryId { get; set; }

        public string? ItemName { get; set; }

        public int? StockQuantity { get; set; }

        public decimal? SellingPrice { get; set; }

        public decimal? CostPrice { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}

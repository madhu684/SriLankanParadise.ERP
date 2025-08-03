namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SameCategoryTypeSupplierItemDto
    {
        public int ItemMasterId { get; set; }
        public string ItemName { get; set; }
        public string ItemCode { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? SellingPrice { get; set; }
        public string SupplierName { get; set; }
        public string CategoryName { get; set; }
        public string ItemTypeName { get; set; }
    }
}

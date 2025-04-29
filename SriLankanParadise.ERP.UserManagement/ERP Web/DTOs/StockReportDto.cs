using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class StockReportDto
    {
        public int itemId { get; set; }
        public int? batchId { get; set; }
        public string? batchNumber { get; set; }
        public string? location { get; set; }
        public string ? itemName { get; set; }
        public string? itemCode { get; set; }
        public string unitName { get; set; }
        public int reorderLevel { get; set; }
        public decimal openingBalance { get; set; }
        public decimal totalIn { get; set; }
        public decimal totalOut { get; set; }
        public decimal closingBalance { get; set; }
    }
}

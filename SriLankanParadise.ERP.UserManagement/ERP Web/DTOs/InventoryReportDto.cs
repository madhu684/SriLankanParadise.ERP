namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class InventoryReportDto
    {
        public string Inventory { get; set; }
        public string RawMaterial { get; set; }
        public string ItemCode { get; set; }
        public string UOM { get; set; }
        public decimal OpeningBalance { get; set; }
        public decimal ReceivedQty { get; set; }
        public string BatchNo { get; set; }
        public decimal ActualUsage { get; set; }
        public decimal ClosingBalance { get; set; }
        public decimal GRNQty { get; set; }
        public decimal ProductionInQty { get; set; }
        public decimal ReturnInQty { get; set; }
        public decimal ProductionOutQty { get; set; }
        public decimal ReturnQty { get; set; }
    }
}

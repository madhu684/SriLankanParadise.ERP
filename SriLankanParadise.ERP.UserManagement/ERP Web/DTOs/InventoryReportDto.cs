namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class InventoryReportDto
    {
        public string Inventory { get; set; }
        public string RawMaterial { get; set; }
        public int MaterialId { get; set; }
        public string UOM { get; set; }
        public double OpeningBalance { get; set; }
        public double ReceivedQty { get; set; }
        public string BatchNo { get; set; }
        public double ActualUsage { get; set; }
        public double ClosingBalance { get; set; }
    }
}

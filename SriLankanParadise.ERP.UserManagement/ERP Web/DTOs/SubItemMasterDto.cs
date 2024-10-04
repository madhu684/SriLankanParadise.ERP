namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SubItemMasterDto
    {
        public int Id { get; set; }
        public int MainItemMasterId { get; set; }
        public int SubItemMasterId { get; set; }
        public decimal Quantity { get; set; }
        public ItemMasterDto ItemMaster { get; set; }
    }
}

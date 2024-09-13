namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SubItemMaster
    {
        public int Id { get; set; }
        public int ItemMasterId { get; set; }
        public int SubItemMasterId { get; set; }
        public int Quantity { get; set; }
        public int UnitId { get; set; }
    }
}

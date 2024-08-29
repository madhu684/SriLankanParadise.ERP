namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SubItemMaster
    {
        public int ParentItemMasterId { get; set; }
        public int SubItemMasterId { get; set; }
        public int Quantity { get; set; }
        public int UnitId { get; set; }
    }
}

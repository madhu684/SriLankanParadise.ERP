namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SupplierItem
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public int ItemMasterId { get; set; }

        public virtual Supplier Supplier { get; set; } = null!;
        public virtual ItemMaster ItemMaster { get; set; } = null!;
    }
}

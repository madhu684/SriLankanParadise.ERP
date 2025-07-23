namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplierItemDto
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public int ItemMasterId { get; set; }
        public virtual SupplierDto? Supplier { get; set; }
        public virtual ItemMasterDto? ItemMaster { get; set; }
    }
}

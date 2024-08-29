namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SubItemMasterRequestModel
    {
        public int ParentItemMasterId { get; set; }
        public int SubItemMasterId { get; set; }
        public int Quantity { get; set; }
        public int UnitId { get; set; }
    }
}
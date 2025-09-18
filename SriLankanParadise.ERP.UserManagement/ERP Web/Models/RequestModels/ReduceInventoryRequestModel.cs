namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ReduceInventoryRequestModel
    {
        public int LocationId { get; set; }
        public int ItemMasterId { get; set; }
        public int TransactionTypeId { get; set; }
        public decimal Quantity { get; set; }
    }
}

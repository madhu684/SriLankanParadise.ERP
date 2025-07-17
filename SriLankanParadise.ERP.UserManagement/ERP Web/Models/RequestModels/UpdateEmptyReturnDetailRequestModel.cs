namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class UpdateEmptyReturnDetailRequestModel
    {
        public int EmptyReturnDetailId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal ReturnQuantity { get; set; }
    }
}

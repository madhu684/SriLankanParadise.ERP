namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class AddEmptyReturnRequestModel
    {
        public int CompanyId { get; set; }
        public int FromLocationId { get; set; }
        public int ToLocationId { get; set; }
        public int? Status { get; set; }
        public DateTime CreateDate { get; set; }
        public int CreatedBy { get; set; }
        public List<EmptyReturnDetailRequestModel> EmptyReturnDetails { get; set; } = new();
    }
}

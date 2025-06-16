namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class UpdateEmptyReturnRequestModel
    {
        public int EmptyReturnMasterId { get; set; }
        public int CompanyId { get; set; }
        public int FromLocationId { get; set; }
        public int ToLocationId { get; set; }
        public int? Status { get; set; }
        public int ModifyedBy { get; set; }
        public DateTime ModifyDate { get; set; }
       

        public List<EmptyReturnDetailRequestModel> EmptyReturnDetails { get; set; } = new();
    }
}

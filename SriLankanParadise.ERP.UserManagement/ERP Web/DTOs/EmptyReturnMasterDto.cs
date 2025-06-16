namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class EmptyReturnMasterDto
    {
        public int EmptyReturnMasterId { get; set; }
        public int CompanyId { get; set; }
        public int FromLocationId { get; set; }
        public int ToLocationId { get; set; }
        public int? Status { get; set; }
        public string? ApprovedBy { get; set; }
        public int? ApprovedUserId { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string ReferenceNo { get; set; } 
        public DateTime CreateDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public int? ModifyedBy { get; set; }
        public List<EmptyReturnDetailDto> EmptyReturnDetails { get; set; } = new();


        //public virtual EmptyReturnDetailDto? Details { get; set; } 



    }
}

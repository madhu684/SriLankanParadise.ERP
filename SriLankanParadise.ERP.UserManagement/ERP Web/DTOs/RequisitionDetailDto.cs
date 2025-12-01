namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class RequisitionDetailDto
    {
        public int RequisitionDetailId { get; set; }

        public int RequisitionMasterId { get; set; }

        public int ItemMasterId { get; set; }


        public string? CustDekNo { get; set; }

        public virtual ItemMasterDto? ItemMaster { get; set; }

        public int? Quantity { get; set; }
    }
}

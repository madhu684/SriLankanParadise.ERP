namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseRequisitionDetailDto
    {
        public int PurchaseRequisitionDetailId { get; set; }


        public int PurchaseRequisitionId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public int? ItemMasterId { get; set; }

        public virtual ItemMasterDto? ItemMaster { get; set; }
    }
}

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class EmptyReturnDetailDto
    {
        public int EmptyReturnDetailId { get; set; }
        public int EmptyReturnMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public int? BatchId { get; set; }
        public decimal ReturnQuantity { get; set; }
    }
}

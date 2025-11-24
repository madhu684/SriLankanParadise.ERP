using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class GrnDetailDto
    {
        public int GrnDetailId { get; set; }

        public int GrnMasterId { get; set; }

        public int? ReceivedQuantity { get; set; }

        public int? AcceptedQuantity { get; set; }

        public int? RejectedQuantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public int? ItemId { get; set; }

        public virtual ItemMasterDto? Item { get; set; }

        public int? FreeQuantity { get; set; }

        public string? ItemBarcode { get; set; }

        public int? OrderedQuantity { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public string? RejectedReason { get; set; }

    }
}

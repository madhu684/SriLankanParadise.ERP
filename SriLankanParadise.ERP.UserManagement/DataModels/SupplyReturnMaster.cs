namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SupplyReturnMaster
    {
        public int SupplyReturnMasterId { get; set; }
        public DateTime ReturnDate { get; set; }
        public int SupplierId { get; set; }
        public int? Status { get; set; }
        public string ReturnedBy { get; set; } = null!;
        public int ReturnedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ApprovedBy { get; set; } = null!;
        public int? ApprovedUserId { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public  DateTime? LastUpdatedDate { get; set; }
        public string? ReturnType { get; set; } = null!;
        public int? CompanyId { get; set; }
        public string? ReferenceNo { get; set; }

        //Navigations
        public virtual Supplier Supplier { get; set; } = null!;
        public virtual ICollection<SupplyReturnDetail> SupplyReturnDetails { get; set; } = new List<SupplyReturnDetail>();
    }
}

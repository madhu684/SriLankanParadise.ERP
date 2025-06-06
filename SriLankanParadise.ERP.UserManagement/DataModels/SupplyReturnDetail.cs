namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SupplyReturnDetail
    {
        public int SupplyReturnDetailId { get; set; }
        public int SupplyReturnMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public int BatchId { get; set; }
        public decimal? ReturnedQuantity { get; set; }
        public string? ReferenceNo { get; set; }
        public int LocationId { get; set; }

        //Navigations
        public virtual SupplyReturnMaster SupplyReturnMaster { get; set; } = null!;
        public virtual ItemMaster ItemMaster { get; set; } = null!;
        public virtual Batch Batch { get; set; } = null!;
        public virtual Location Location { get; set; } = null!;

    }
}

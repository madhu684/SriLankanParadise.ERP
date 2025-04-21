namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class PackingSlipDetail
    {
        public int PackingSlipDetailId { get; set; }

        public int ItemBatchItemMasterId { get; set; }

        public int ItemBatchBatchId { get; set; }

        public int PackingSlipId { get; set; }

        public int? Quantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? TotalPrice { get; set; }

        public virtual ItemBatch ItemBatch { get; set; } = null!;

        public virtual PackingSlip PackingSlip { get; set; } = null!;
    }
}

using SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationInventory
{
    public int LocationInventoryId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public int LocationId { get; set; }

    public decimal? StockInHand { get; set; }

    public string? BatchNo { get; set; }

    public string? RackNo { get; set; }

    public int? ReOrderLevel { get; set; }

    public int? MaxStockLevel { get; set; }

    public virtual ItemBatch ItemBatch { get; set; }

    public virtual Location Location { get; set; } = null!;

    public virtual ItemMaster ItemMaster { get; set; } = null!;

    public virtual ICollection<DailyLocationInventory> DailyLocationInventories { get; set; } = new List<DailyLocationInventory>();
}
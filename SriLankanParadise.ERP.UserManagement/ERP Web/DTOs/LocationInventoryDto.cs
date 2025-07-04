using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;

public class LocationInventoryDto
{
    public int LocationInventoryId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public virtual ItemBatchDto? ItemBatch { get; set; }

    public virtual ItemMasterDto? ItemMaster { get; set; }

    public int LocationId { get; set; }

    public decimal? StockInHand { get; set; }

    public string? BatchNo { get; set; }

    public string? RackNo { get; set; }

    public int? ReOrderLevel { get; set; }

    public int? MaxStockLevel { get; set; }
}
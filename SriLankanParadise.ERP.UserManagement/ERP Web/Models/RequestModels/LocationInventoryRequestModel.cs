public class LocationInventoryRequestModel
{
    public int ItemMasterId { get; set; }

    public int? BatchId { get; set; }

    public int LocationId { get; set; }

    public int MovementTypeId { get; set; }

    public decimal? StockInHand { get; set; }

    public string? BatchNo { get; set; }

    public int PermissionId { get; set; }

    public string? RackNo { get; set; }

    public int? ReOrderLevel { get; set; }

    public int? MaxStockLevel { get; set; }
}
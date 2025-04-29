using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationInventory
{
    public int LocationInventoryId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public int LocationId { get; set; }

    public decimal? StockInHand { get; set; }

    public string? BatchNo { get; set; }

    public string? RackNo { get; set; }

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;

    public virtual ItemMaster ItemMaster { get; set; } = null!;

}

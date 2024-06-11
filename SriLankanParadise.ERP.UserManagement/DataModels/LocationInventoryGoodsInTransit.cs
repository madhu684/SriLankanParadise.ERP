using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationInventoryGoodsInTransit
{
    public int LocationInventoryGoodsInTransitId { get; set; }

    public int ToLocationId { get; set; }

    public int FromLocationId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public DateTime? Date { get; set; }

    public int? Status { get; set; }

    public int? Qty { get; set; }

    public virtual Location FromLocation { get; set; } = null!;

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual Location ToLocation { get; set; } = null!;
}

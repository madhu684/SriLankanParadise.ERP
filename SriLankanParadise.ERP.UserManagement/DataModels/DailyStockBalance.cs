using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class DailyStockBalance
{
    public int DailyStockBalanceId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public int LocationId { get; set; }

    public DateTime? Date { get; set; }

    public int? StockInHand { get; set; }

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;
}

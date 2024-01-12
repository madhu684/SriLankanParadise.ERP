using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ItemBatch
{
    public int BatchId { get; set; }

    public int ItemMasterId { get; set; }

    public decimal? CostPrice { get; set; }

    public decimal? SellingPrice { get; set; }

    public virtual Batch Batch { get; set; } = null!;

    public virtual ICollection<ItemBatchHasGrnDetail> ItemBatchHasGrnDetails { get; set; } = new List<ItemBatchHasGrnDetail>();

    public virtual ItemMaster ItemMaster { get; set; } = null!;

    public virtual ICollection<LocationChannelItemBatch> LocationChannelItemBatches { get; set; } = new List<LocationChannelItemBatch>();

    public virtual ICollection<SalesOrderDetail> SalesOrderDetails { get; set; } = new List<SalesOrderDetail>();
}

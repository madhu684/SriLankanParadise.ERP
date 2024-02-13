using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Batch
{
    public int BatchId { get; set; }

    public string? BatchRef { get; set; }

    public DateTime? Date { get; set; }

    public virtual ICollection<BatchHasGrnMaster> BatchHasGrnMasters { get; set; } = new List<BatchHasGrnMaster>();

    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();
}

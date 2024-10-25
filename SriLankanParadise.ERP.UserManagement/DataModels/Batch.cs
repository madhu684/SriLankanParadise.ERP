using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Batch
{
    public int BatchId { get; set; }

    public string? BatchRef { get; set; }

    public DateTime? Date { get; set; }

    public int? CompanyId { get; set; }

    public virtual ICollection<BatchHasGrnMaster> BatchHasGrnMasters { get; set; } = new List<BatchHasGrnMaster>();

    public virtual ICollection<IssueDetail> IssueDetails { get; set; } = new List<IssueDetail>();

    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();

    public virtual ICollection<DailyLocationInventory> DailyLocationInventories { get; set; } = new List<DailyLocationInventory>();
}

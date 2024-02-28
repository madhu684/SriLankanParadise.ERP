using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ItemBatchHasGrnDetail
{
    public int ItemBatchHasGrnDetailId { get; set; }

    public int GrnDetailId { get; set; }

    public int ItemBatchItemMasterId { get; set; }

    public int ItemBatchBatchId { get; set; }

    public virtual GrnDetail GrnDetail { get; set; } = null!;

    public virtual ItemBatch ItemBatch { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class GrnDetail
{
    public int GrnDetailId { get; set; }

    public int GrnMasterId { get; set; }

    public int? ReceivedQuantity { get; set; }

    public int? AcceptedQuantity { get; set; }

    public int? RejectedQuantity { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? TotalPrice { get; set; }

    public virtual GrnMaster GrnMaster { get; set; } = null!;

    public virtual ICollection<ItemBatchHasGrnDetail> ItemBatchHasGrnDetails { get; set; } = new List<ItemBatchHasGrnDetail>();
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class GrnDetail
{
    public int GrnDetailId { get; set; }

    public int GrnMasterId { get; set; }

    public int? ReceivedQuantity { get; set; }   // need to be decimal

    public int? AcceptedQuantity { get; set; }    // need to be decimal

    public int? RejectedQuantity { get; set; }    // need to be decimal

    public decimal? UnitPrice { get; set; }

    public int? ItemId { get; set; }

    public int? FreeQuantity { get; set; }

    public string? ItemBarcode { get; set; }

    public int? OrderedQuantity { get; set; }     // need to be decimal

    public DateTime? ExpiryDate { get; set; }

    public virtual GrnMaster GrnMaster { get; set; } = null!;

    public virtual ItemMaster? Item { get; set; }

    public virtual ICollection<ItemBatchHasGrnDetail> ItemBatchHasGrnDetails { get; set; } = new List<ItemBatchHasGrnDetail>();
}

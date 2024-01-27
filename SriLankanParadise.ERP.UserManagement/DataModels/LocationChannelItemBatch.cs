using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationChannelItemBatch
{
    public int LocationChannelItemBatchId { get; set; }

    public int LocationChannelId { get; set; }

    public int ItemBatchItemMasterId { get; set; }

    public int ItemBatchBatchId { get; set; }

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual LocationChannel LocationChannel { get; set; } = null!;
}

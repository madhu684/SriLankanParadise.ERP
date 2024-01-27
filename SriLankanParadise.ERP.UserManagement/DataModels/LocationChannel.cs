using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationChannel
{
    public int ChannelId { get; set; }

    public int LocationId { get; set; }

    public int LocationChannelId { get; set; }

    public virtual Channel Channel { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;

    public virtual ICollection<LocationChannelItemBatch> LocationChannelItemBatches { get; set; } = new List<LocationChannelItemBatch>();
}

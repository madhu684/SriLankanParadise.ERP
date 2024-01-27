using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Channel
{
    public int ChannelId { get; set; }

    public string? ChannelName { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<LocationChannel> LocationChannels { get; set; } = new List<LocationChannel>();
}

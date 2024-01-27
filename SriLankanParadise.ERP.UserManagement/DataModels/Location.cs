using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Location
{
    public int LocationId { get; set; }

    public int CompanyId { get; set; }

    public string? LocationName { get; set; }

    public bool? Status { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<LocationChannel> LocationChannels { get; set; } = new List<LocationChannel>();

    public virtual ICollection<PurchaseRequisition> PurchaseRequisitions { get; set; } = new List<PurchaseRequisition>();
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Subscription
{
    public int SubscriptionId { get; set; }

    public string? PlanName { get; set; }

    public decimal? Price { get; set; }

    public string? Description { get; set; }

    public int? Duration { get; set; }

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();

    public virtual ICollection<SubscriptionModule> SubscriptionModules { get; set; } = new List<SubscriptionModule>();
}

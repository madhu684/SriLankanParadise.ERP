using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Company
{
    public int CompanyId { get; set; }

    public string? CompanyName { get; set; }

    public int? SubscriptionPlanId { get; set; }

    public DateTime? SubscriptionExpiredDate { get; set; }

    public int? MaxUserCount { get; set; }

    public virtual Subscription? SubscriptionPlan { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

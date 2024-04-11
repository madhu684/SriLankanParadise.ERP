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

    public bool Status { get; set; }

    public string? LogoPath { get; set; }

    public string? BatchStockType { get; set; }

    public virtual ICollection<CompanySubscriptionModule> CompanySubscriptionModules { get; set; } = new List<CompanySubscriptionModule>();

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();

    public virtual ICollection<Location> Locations { get; set; } = new List<Location>();

    public virtual Subscription? SubscriptionPlan { get; set; }

    public virtual ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string? CustomerName { get; set; }

    public string? ContactPerson { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public int CompanyId { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();

    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
}

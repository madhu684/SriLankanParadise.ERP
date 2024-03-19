using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationType
{
    public int LocationTypeId { get; set; }

    public string? Name { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public virtual ICollection<Location> Locations { get; set; } = new List<Location>();
}

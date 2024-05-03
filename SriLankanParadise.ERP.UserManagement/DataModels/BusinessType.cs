using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class BusinessType
{
    public int BusinessTypeId { get; set; }

    public string? TypeName { get; set; }

    public virtual ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class MeasurementType
{
    public int MeasurementTypeId { get; set; }

    public string? Name { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public virtual ICollection<Unit> Units { get; set; } = new List<Unit>();
}

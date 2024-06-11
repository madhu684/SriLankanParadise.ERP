using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class MovementType
{
    public int MovementTypeId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<LocationInventoryMovement> LocationInventoryMovements { get; set; } = new List<LocationInventoryMovement>();
}

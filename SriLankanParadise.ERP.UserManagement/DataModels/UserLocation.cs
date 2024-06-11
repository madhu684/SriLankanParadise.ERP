using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class UserLocation
{
    public int UserLocationId { get; set; }

    public int LocationId { get; set; }

    public int UserId { get; set; }

    public virtual Location Location { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

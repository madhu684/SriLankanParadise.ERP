using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ActionLog
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ActionId { get; set; }

    public DateTime Timestamp { get; set; }

    public string? Ipaddress { get; set; }

    public virtual Permission Action { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class AuditLog
{
    public int Id { get; set; }

    public Guid SessionId { get; set; }

    public int UserId { get; set; }

    public string AccessedPath { get; set; } = null!;

    public string AccessedMethod { get; set; } = null!;

    public DateTime Timestamp { get; set; }

    public string Ipaddress { get; set; } = null!;

    public string? Description { get; set; }
    public virtual User User { get; set; } = null!;
}

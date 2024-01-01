using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class AuditLog1
{
    public double? Id { get; set; }

    public double? UserId { get; set; }

    public string? AccessedPath { get; set; }

    public string? AccessedMethod { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? Ipaddress { get; set; }
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ActionLog1
{
    public double? Id { get; set; }

    public double? UserId { get; set; }

    public double? ActionId { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? Ipaddress { get; set; }
}

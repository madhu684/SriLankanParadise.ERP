﻿using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Role
{
    public int RoleId { get; set; }

    public string? RoleName { get; set; }

    public int ModuleId { get; set; }

    public int? CompanyId { get; set; }

    public bool? Status { get; set; }

    public virtual Module Module { get; set; } = null!;

    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Module
{
    public int ModuleId { get; set; }

    public string ModuleName { get; set; } = null!;

    public bool Status { get; set; }

    public virtual ICollection<CompanySubscriptionModuleUser> CompanySubscriptionModuleUsers { get; set; } = new List<CompanySubscriptionModuleUser>();

    public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();

    public virtual ICollection<SubModule> SubModules { get; set; } = new List<SubModule>();

    public virtual ICollection<SubscriptionModule> SubscriptionModules { get; set; } = new List<SubscriptionModule>();
}

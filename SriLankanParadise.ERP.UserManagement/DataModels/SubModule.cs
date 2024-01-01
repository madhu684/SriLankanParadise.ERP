using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SubModule
{
    public int SubModuleId { get; set; }

    public string SubModuleName { get; set; } = null!;

    public bool Status { get; set; }

    public int? ModuleId { get; set; }

    public virtual Module? Module { get; set; }
}

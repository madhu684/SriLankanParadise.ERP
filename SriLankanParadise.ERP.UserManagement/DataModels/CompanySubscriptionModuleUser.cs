using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class CompanySubscriptionModuleUser
{
    public int Id { get; set; }

    public int CompanySubscriptionModuleId { get; set; }

    public int UserId { get; set; }
}

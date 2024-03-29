using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class CashierSession
{
    public int CashierSessionId { get; set; }

    public int? UserId { get; set; }

    public DateTime? SessionIn { get; set; }

    public DateTime? SessionOut { get; set; }

    public decimal? OpeningBalance { get; set; }

    public decimal? ClosingBalance { get; set; }

    public int? CompanyId { get; set; }

    public virtual User? User { get; set; }
}

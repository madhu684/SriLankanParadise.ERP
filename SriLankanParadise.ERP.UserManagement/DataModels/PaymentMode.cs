using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class PaymentMode
{
    public int PaymentModeId { get; set; }

    public string? Mode { get; set; }

    public int? CompanyId { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<SalesReceipt> SalesReceipts { get; set; } = new List<SalesReceipt>();
}

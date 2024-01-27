using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesReceipt
{
    public int SalesReceiptId { get; set; }

    public int CustomerId { get; set; }

    public DateTime? ReceiptDate { get; set; }

    public decimal? AmountReceived { get; set; }

    public string? PaymentMethod { get; set; }

    public virtual Customer Customer { get; set; } = null!;
}

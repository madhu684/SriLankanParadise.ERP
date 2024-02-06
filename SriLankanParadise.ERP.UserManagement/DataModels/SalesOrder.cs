using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesOrder
{
    public int SalesOrderId { get; set; }

    public int? CustomerId { get; set; }

    public DateTime? OrderDate { get; set; }

    public DateTime? DeliveryDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public int? Status { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public string? ApprovedBy { get; set; }

    public int? ApprovedUserId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public int? CompanyId { get; set; }

    public string? ReferenceNo { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<SalesOrderDetail> SalesOrderDetails { get; set; } = new List<SalesOrderDetail>();
}

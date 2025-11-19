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

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastUpdatedDate { get; set; }
    public int SalesPersonId { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public int InventoryLocationId { get; set; }

    public string CustomerPoNumber { get; set; }

    public decimal? CustomerCreditLimitAtOrder { get; set; }

    public int? CustomerCreditDurationAtOrder { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual User SalesPerson { get; set; }

    public virtual ICollection<SalesInvoice> SalesInvoices { get; set; } = new List<SalesInvoice>();

    public virtual ICollection<SalesOrderDetail> SalesOrderDetails { get; set; } = new List<SalesOrderDetail>();
}

using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Customer
{
    public int CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? Phone { get; set; }
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public int? CompanyId { get; set; }
    public string? CustomerCode { get; set; }
    public int? Status { get; set; }
    public string? BillingAddressLine1 { get; set; }
    public string? BillingAddressLine2 { get; set; }
    public string? LisenNumber { get; set; }
    public DateTime? LisenStartDate { get; set; }
    public DateTime? LisenEndDate { get; set; }
    public decimal? CreditLimit { get; set; }
    public int? CreditDuration { get; set; }
    public decimal? OutstandingAmount { get; set; }
    public string? BusinessRegistrationNo { get; set; }
    public bool? IsVATRegistered { get; set; }
    public string? VATRegistrationNo { get; set; }

    public virtual ICollection<PackingSlip> PackingSlips { get; set; } = new List<PackingSlip>();

    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
}

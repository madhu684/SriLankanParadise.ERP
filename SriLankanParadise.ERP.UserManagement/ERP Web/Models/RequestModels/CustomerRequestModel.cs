namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CustomerRequestModel
    {
        public string? CustomerName { get; set; }
        public string? ContactPerson { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int CompanyId { get; set; }
        public string? CustomerCode { get; set; }
        public int Status { get; set; }
        public string? BillingAddressLine1 { get; set; }
        public string? BillingAddressLine2 { get; set; }
        public int? ReigonId { get; set; }
        public string LisenNumber { get; set; }
        public DateTime LisenStartDate { get; set; }
        public DateTime LisenEndDate { get; set; }
        public decimal CreditLimit { get; set; }
        public int CreditDuration { get; set; }
        public decimal OutstandingAmount { get; set; }
        public string? BusinessRegistrationNo { get; set; }
        public bool IsVATRegistered { get; set; }
        public string? VATRegistrationNo { get; set; }
        public int? SalesPersonId { get; set; }
        public int? RegionId { get; set; }
    }
}

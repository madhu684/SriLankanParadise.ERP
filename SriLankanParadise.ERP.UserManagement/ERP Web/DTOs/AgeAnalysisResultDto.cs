namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class AgeAnalysisResultDto
    {
        public IEnumerable<AgeAnalysisInvoiceItem> Items { get; set; } = Enumerable.Empty<AgeAnalysisInvoiceItem>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
        public Dictionary<string, decimal> SlabTotals { get; set; } = new Dictionary<string, decimal>();
        public decimal TotalAmountDue { get; set; }
    }

    // Temporary DTO for repository
    public class AgeAnalysisWithTotalsDto
    {
        public IEnumerable<AgeAnalysisInvoiceItem> Items { get; set; } = Enumerable.Empty<AgeAnalysisInvoiceItem>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public Dictionary<string, decimal> SlabTotals { get; set; } = new Dictionary<string, decimal>();
        public decimal TotalAmountDue { get; set; }
    }

    public class AgeAnalysisInvoiceItem
    {
        public int SalesInvoiceId { get; set; }
        public string ReferenceNo { get; set; }
        public string CustomerName { get; set; }
        public string SalesPersonName { get; set; }
        public string RegionName { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? AmountDue { get; set; }
        public int AgingDays { get; set; }
        public string SlabLabel { get; set; }
        public Dictionary<string, decimal> SlabAmounts { get; set; } = new Dictionary<string, decimal>();
    }
}

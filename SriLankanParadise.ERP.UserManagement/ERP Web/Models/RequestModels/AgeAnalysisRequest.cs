namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class AgeAnalysisRequest
    {
        public DateTime AsOfDate { get; set; }
        public List<SlabDefinition> Slabs { get; set; }
        //public int? CustomerId { get; set; }
        //public int? RegionId { get; set; }
        //public int? SalesPersonId { get; set; }
        public List<int>? CustomerIds { get; set; }
        public List<int>? RegionIds { get; set; }
        public List<int>? SalesPersonIds { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    // Slab definition (e.g., 0-30, 31-60, etc.)
    public class SlabDefinition
    {
        public int FromDays { get; set; }
        public int? ToDays { get; set; } // Null means "over" (e.g., over 120)
        public string Label { get; set; }
    }
}

using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class GrnMasterDto
    {
        public int GrnMasterId { get; set; }

        public DateTime? GrnDate { get; set; }

        public string? ReceivedBy { get; set; }

        public DateTime? ReceivedDate { get; set; }

        public bool? Status { get; set; }

        public virtual IEnumerable<GrnDetailDto>? GrnDetails { get; set; }

    }
}

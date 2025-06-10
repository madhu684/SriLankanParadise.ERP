namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class UserUpdateRequestModel
    {
        public string Username { get; set; } = null!;

        //public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string ContactNo { get; set; } = null!;

        public string Firstname { get; set; } = null!;

        public string? Lastname { get; set; }

        public int CompanyId { get; set; }

        public int? LocationId { get; set; }

        public bool Status { get; set; }


        //public int? PermissionId { get; set; }
    }
}

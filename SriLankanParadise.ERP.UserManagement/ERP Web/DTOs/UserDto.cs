namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }

        public string Username { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string ContactNo { get; set; } = null!;

        public string Firstname { get; set; } = null!;

        public string? Lastname { get; set; }

        public int CompanyId { get; set; }

        public bool IsDeleted { get; set; }

        public virtual CompanyDto Company { get; set; } = null!;

        public bool Status { get; set; }

        public int? LocationId { get; set; }

    }
}

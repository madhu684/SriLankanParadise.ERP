namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class UserLocationDto
    {
        public int UserLocationId { get; set; }

        public int LocationId { get; set; }

        public virtual LocationDto? Location { get; set; }

        public int UserId { get; set; }
    }
}

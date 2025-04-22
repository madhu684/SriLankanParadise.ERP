namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class UserGeoLocationDto
    {
        public int GeoLocationId { get; set; }

        public int UserProfileId { get; set; }

        public DateTime GeoDate { get; set; }

        public DateTime CapturedTime { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}

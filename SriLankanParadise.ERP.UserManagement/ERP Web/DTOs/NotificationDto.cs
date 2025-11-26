namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public record NotificationDto(
    string Id = "",
    string Title = "",
    string Message = "",
    string Type = "",
    string Action = "",
    DateTime Timestamp = default,
    object? Data = null)
    {
        public NotificationDto() : this(Guid.NewGuid().ToString(), "", "", "", "", DateTime.UtcNow) { }
    }
}

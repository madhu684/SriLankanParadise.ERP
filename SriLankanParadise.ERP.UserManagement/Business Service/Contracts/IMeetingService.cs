using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IMeetingService
    {
        Task<IEnumerable<Meeting>> GetAllMeetingsAsync();
        Task<Meeting> GetMeetingByIdAsync(int meetingId);
        Task AddMeetingAsync(Meeting meeting);
        Task UpdateMeetingAsync(int meetingId, Meeting meeting);
        Task DeleteMeetingAsync(int meetingId);
    }
}
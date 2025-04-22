using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IMeetingRepository
    {
        Task<IEnumerable<Meeting>> GetAllMeetingsAsync();
        Task<Meeting> GetMeetingByIdAsync(int meetingId);
        Task AddMeetingAsync(Meeting meeting);
        Task UpdateMeetingAsync(int meetingId, Meeting meeting);
        Task DeleteMeetingAsync(int meetingId);
    }
}
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class MeetingService : IMeetingService
    {
        private readonly IMeetingRepository _meetingRepository;

        public MeetingService(IMeetingRepository meetingRepository)
        {
            _meetingRepository = meetingRepository;
        }
        public async Task AddMeetingAsync(Meeting meeting)
        {
            await _meetingRepository.AddMeetingAsync(meeting);
        }

        public async Task DeleteMeetingAsync(int meetingId)
        {
            await _meetingRepository.DeleteMeetingAsync(meetingId);
        }

        public async Task<IEnumerable<Meeting>> GetAllMeetingsAsync()
        {
            return await _meetingRepository.GetAllMeetingsAsync();
        }

        public async Task<Meeting> GetMeetingByIdAsync(int meetingId)
        {
            return await _meetingRepository.GetMeetingByIdAsync(meetingId);
        }

        public async Task UpdateMeetingAsync(int meetingId, Meeting meeting)
        {
            await _meetingRepository.UpdateMeetingAsync(meetingId, meeting);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class MeetingRepository : IMeetingRepository
    {
        private readonly ErpSystemContext _dbContext;

        public MeetingRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddMeetingAsync(Meeting meeting)
        {
            try
            {
                _dbContext.Meetings.Add(meeting);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteMeetingAsync(int meetingId)
        {
            try
            {
                var meeting = await _dbContext.Meetings.FindAsync(meetingId);

                if (meeting != null)
                {
                    _dbContext.Meetings.Remove(meeting);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Meeting>> GetAllMeetingsAsync()
        {
            try
            {
                return await _dbContext.Meetings.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Meeting> GetMeetingByIdAsync(int meetingId)
        {
            try
            {
                var meeting = await _dbContext.Meetings
                    .Where(m => m.MeetingId == meetingId)
                    .FirstOrDefaultAsync();

                return meeting;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateMeetingAsync(int meetingId, Meeting meeting)
        {
            try
            {
                var existMeeting = await _dbContext.Meetings.FindAsync(meetingId);

                if (existMeeting != null)
                {
                    _dbContext.Entry(existMeeting).CurrentValues.SetValues(meeting);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

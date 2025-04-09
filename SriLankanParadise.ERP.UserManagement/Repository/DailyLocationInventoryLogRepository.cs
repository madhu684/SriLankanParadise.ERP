using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class DailyLocationInventoryLogRepository : IDailyLocationInventoryLogRepository
    {
        private readonly ErpSystemContext _dbcontext;

        public DailyLocationInventoryLogRepository(ErpSystemContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task Add(DailyLocationInventoryLog dailyLocationInventoryLog)
        {
            _dbcontext.Add(dailyLocationInventoryLog);
            await _dbcontext.SaveChangesAsync();
        }
    }
}

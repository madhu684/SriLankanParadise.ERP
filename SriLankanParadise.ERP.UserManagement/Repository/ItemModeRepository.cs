using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemModeRepository : IItemModeRepository
    {
        private readonly ErpSystemContext _context;

        public ItemModeRepository(ErpSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ItemMode>> GetAllItemModesAsync()
        {
            try
            {
                var modes = await _context.ItemModes.ToListAsync();
                return modes.Any() ? modes : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

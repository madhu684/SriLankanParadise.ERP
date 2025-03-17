using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISubItemMasterRepository
    {
        Task AddSubItemMaster(SubItemMaster subItemMaster);

        Task<IEnumerable<SubItemMaster>> GetSubItemMastersByItemMasterId(int itemMasterId);

        Task DeleteSubItemMastersByMainItemMasterId(int mainItemMaster);
    }
}

using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISubItemMasterService
    {
        Task AddSubItemMaster(SubItemMaster subItemMaster);

        Task<IEnumerable<SubItemMaster>> GetSubItemMastersByItemMasterId(int itemMasterId);

        Task DeleteSubItemMaster(int mainItemMaster, int subItemMaster);
    }
}

using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SubItemMasterService : ISubItemMasterService
    {
        private readonly ISubItemMasterRepository _subItemMasterRepository;

        public SubItemMasterService(ISubItemMasterRepository subItemMasterRepository)
        {
            _subItemMasterRepository = subItemMasterRepository;
        }

        public async Task AddSubItemMaster(SubItemMaster subItemMaster)
        {
            await _subItemMasterRepository.AddSubItemMaster(subItemMaster);
        }

        public async Task<IEnumerable<SubItemMaster>> GetSubItemMastersByItemMasterId(int itemMasterId)
        {
            return await _subItemMasterRepository.GetSubItemMastersByItemMasterId(itemMasterId);
        }

        public async Task DeleteSubItemMastersByMainItemMasterId(int mainItemMaster)
        {
            await _subItemMasterRepository.DeleteSubItemMastersByMainItemMasterId(mainItemMaster);
        }
    }
}

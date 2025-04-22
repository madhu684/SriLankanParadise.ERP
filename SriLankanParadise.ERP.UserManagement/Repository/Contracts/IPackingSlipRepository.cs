using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPackingSlipRepository
    {
        Task AddPackingSlip(PackingSlip packingSlip);

        Task<IEnumerable<PackingSlip>> GetAll();

        Task<IEnumerable<PackingSlip>> GetPackingSlipsWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<PackingSlip>> GetPackingSlipsByUserId(int userId);

        Task ApprovePackingSlip(int packingSlipId, PackingSlip packingSlip);

        Task<PackingSlip> GetPackingSlipByPackingSlipId(int packingSlipId);

        Task UpdatePackingSlip(int packingSlipId, PackingSlip packingSlip);
    }
}

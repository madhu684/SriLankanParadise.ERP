using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPackingSlipDetailRepository
    {
        Task AddPackingSlipDetail(PackingSlipDetail packingSlipDetail);

        Task<PackingSlipDetail> GetPackingSlipDetailByPackingSlipDetailId(int packingSlipDetailId);

        Task UpdatePackingSlipDetail(int packingSlipDetailId, PackingSlipDetail packingSlipDetail);

        Task DeletePackingSlipDetail(int packingSlipDetailId);

        Task<IEnumerable<PackingSlipDetail>> GetPackingSlipDetailsByPackingSlipId(int packingSlipId);
    }
}

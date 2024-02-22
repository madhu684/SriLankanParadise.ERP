using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IGrnDetailRepository
    {
        Task AddGrnDetail(GrnDetail grnDetail);

        Task<GrnDetail> GetGrnDetailByGrnDetailId(int grnDetailId);

        Task UpdateGrnDetail(int grnDetailId, GrnDetail grnDetail);

        Task DeleteGrnDetail(int grnDetailId);
    }
}

using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IGrnDetailService
    {
        Task AddGrnDetail(GrnDetail grnDetail);

        Task<GrnDetail> GetGrnDetailByGrnDetailId(int grnDetailId);

        Task UpdateGrnDetail(int grnDetailId, GrnDetail grnDetail);

        Task DeleteGrnDetail(int grnDetailId);
    }
}

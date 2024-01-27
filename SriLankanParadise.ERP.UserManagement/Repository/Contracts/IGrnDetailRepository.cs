using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IGrnDetailRepository
    {
        Task AddGrnDetail(GrnDetail grnDetail);
    }
}

using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISubscriptionRepository
    {
        Task<Subscription> GetSubscriptionBySubscriptionId(int subscriptionId);
        Task<IEnumerable<Subscription>> GetAll();
        Task AddSubscription(Subscription subscription);
        Task DeleteSubscription(int subscriptionId);
        Task UpdateSubscription(int subscriptionId, Subscription subscription);
    }
}

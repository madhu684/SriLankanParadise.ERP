using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        public SubscriptionService(ISubscriptionRepository subscriptionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
        }

        public async Task AddSubscription(Subscription subscription)
        {
            await _subscriptionRepository.AddSubscription(subscription);
        }

        public async Task DeleteSubscription(int subscriptionId)
        {
            await _subscriptionRepository.DeleteSubscription(subscriptionId);
        }

        public async Task<IEnumerable<Subscription>> GetAll()
        {
            return await _subscriptionRepository.GetAll();
        }

        public async Task<Subscription> GetSubscriptionBySubscriptionId(int subscriptionId)
        {
            return await _subscriptionRepository.GetSubscriptionBySubscriptionId(subscriptionId);
        }

        public async Task UpdateSubscription(int subscriptionId, Subscription subscription)
        {
            await _subscriptionRepository.UpdateSubscription(subscriptionId, subscription);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SubscriptionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddSubscription(Subscription subscription)
        {
            try
            {
                _dbContext.Subscriptions.Add(subscription);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSubscription(int subscriptionId)
        {
            try
            {
                var subscription = await _dbContext.Subscriptions.FindAsync(subscriptionId);

                if (subscription != null)
                {
                    _dbContext.Subscriptions.Remove(subscription);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Subscription>> GetAll()
        {
            try
            {
                return await _dbContext.Subscriptions.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Subscription> GetSubscriptionBySubscriptionId(int subscriptionId)
        {
            try
            {
                var subscription = await _dbContext.Subscriptions
                .Where(c => c.SubscriptionId == subscriptionId)
                .FirstOrDefaultAsync();

                return subscription;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSubscription(int subscriptionId, Subscription subscription)
        {
            try
            {
                var existSubscription = await _dbContext.Subscriptions.FindAsync(subscriptionId);

                if (existSubscription != null)
                {
                    _dbContext.Entry(existSubscription).CurrentValues.SetValues(subscription);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

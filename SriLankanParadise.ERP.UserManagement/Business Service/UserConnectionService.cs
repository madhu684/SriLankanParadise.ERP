using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using System.Collections.Concurrent;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UserConnectionService : IUserConnectionService
    {
        private static readonly ConcurrentDictionary<string, HashSet<string>> _userConnections = new();
        private static readonly ConcurrentDictionary<string, string> _connectionUsers = new();

        public Task AddConnection(string userId, string connectionId)
        {
            _userConnections.AddOrUpdate(userId,
                new HashSet<string> { connectionId },
                (key, existingSet) =>
                {
                    existingSet.Add(connectionId);
                    return existingSet;
                });

            _connectionUsers[connectionId] = userId;
            return Task.CompletedTask;
        }

        public Task RemoveConnection(string connectionId)
        {
            if (_connectionUsers.TryRemove(connectionId, out var userId))
            {
                if (_userConnections.TryGetValue(userId, out var connections))
                {
                    connections.Remove(connectionId);
                    if (connections.Count == 0)
                    {
                        _userConnections.TryRemove(userId, out _);
                    }
                }
            }
            return Task.CompletedTask;
        }

        public List<string> GetUserConnections(string userId)
        {
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                return connections.ToList();
            }
            return new List<string>();
        }

        public async Task<List<string>> GetAllLoggedUserConnections()
        {
            // Get all active connections
            return _connectionUsers.Keys.ToList();
        }
    }
}

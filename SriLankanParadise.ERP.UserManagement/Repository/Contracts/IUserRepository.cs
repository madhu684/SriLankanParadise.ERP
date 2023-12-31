﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsername(string username);
        Task RegisterUser(User newUser);
    }
}

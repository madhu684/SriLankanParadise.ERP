﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemMasterService
    {
        Task AddItemMaster(ItemMaster itemMaster);

        Task<IEnumerable<ItemMaster>> GetAll();

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId);

        Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId);

        Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster);

        Task DeleteItemMaster(int itemMasterId);
    }
}
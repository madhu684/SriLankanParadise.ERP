﻿using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemMasterService : IItemMasterService
    {
        private readonly IItemMasterRepository _itemMasterRepository;
        public ItemMasterService(IItemMasterRepository itemMasterRepository)
        {
            _itemMasterRepository = itemMasterRepository;
        }

        public async Task AddItemMaster(ItemMaster itemMaster)
        {
            await _itemMasterRepository.AddItemMaster(itemMaster);
        }

        public async Task<IEnumerable<ItemMaster>> GetAll()
        {
            return await _itemMasterRepository.GetAll();
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId)
        {
            return await _itemMasterRepository.GetItemMastersByCompanyId(companyId);
        }

        public async Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId)
        {
            return await _itemMasterRepository.GetItemMasterByItemMasterId(itemMasterId);
        }

        public async Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster)
        {
            await _itemMasterRepository.UpdateItemMaster(itemMasterId, itemMaster);
        }

        public async Task DeleteItemMaster(int itemMasterId)
        {
            await _itemMasterRepository.DeleteItemMaster(itemMasterId);
        }
    }
}
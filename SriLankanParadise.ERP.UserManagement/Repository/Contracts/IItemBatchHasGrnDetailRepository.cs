﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemBatchHasGrnDetailRepository
    {
        Task AddItemBatchHasGrnDetail(ItemBatchHasGrnDetail itemBatchHasGrnDetail);
    }
}

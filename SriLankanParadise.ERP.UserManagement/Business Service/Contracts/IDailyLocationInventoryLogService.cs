﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IDailyLocationInventoryLogService
    {
        Task Add(DailyLocationInventoryLog dailyLocationInventoryLog);
    }
}

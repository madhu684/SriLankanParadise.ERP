﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPurchaseRequisitionDetailRepository
    {
        Task AddPurchaseRequisitionDetail(PurchaseRequisitionDetail purchaseRequisitionDetail);

        Task<PurchaseRequisitionDetail> GetPurchaseRequisitionDetailByPurchaseRequisitionDetailId(int purchaseRequisitionDetailId);

        Task UpdatePurchaseRequisitionDetail(int purchaseRequisitionDetailId, PurchaseRequisitionDetail purchaseRequisitionDetail);

        Task DeletePurchaseRequisitionDetail(int purchaseRequisitionDetailId);
    }
}

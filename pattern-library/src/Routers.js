import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "features/user-management/login/login";
import Main from "layout/main";
import Registration from "features/user-management/registration/registration";
import PurchaseRequisitionList from "features/purchase/purchaseRequisition/PurchaseRequisitionList/PurchaseRequisitionList";
import PurchaseOrderList from "features/purchase/purchaseOrder/PurchaseOrderList/PurchaseOrderList";
import GrnList from "features/purchase/grn/grnList/grnList";
import SalesOrderList from "features/sales/salesOrder/salesOrderList/salesOrderList";
import SalesInvoiceList from "features/sales/salesInvoice/salesInvoiceList/salesInvoiceList";
import ItemMasterList from "features/inventory/itemMaster/itemMasterList/itemMasterList";
import CategoryList from "features/inventory/category/categoryList/categoryList";
import UnitList from "features/inventory/unit/unitList/unitList";
import SalesReceiptList from "features/sales/salesReceipt/salesReceiptList/salesReceiptList";
import MaterialRequisitionList from "features/purchase/materialRequisition/materialRequisitionList/materialRequisitionList";
import TransferRequisitionList from "features/purchase/transferRequisition/transferRequisitionList/transferRequisitionList";
import MinList from "features/purchase/min/minList/minList";
import TinList from "features/purchase/tin/tinList/tinList";
import ItemBatchUpdate from "features/purchase/itemBatch/itemBatchUpdate/itemBatchUpdate";
import ExpenseOutRequisitionList from "features/sales/expenseOutRequisition/expenseOutRequisitionList/expenseOutRequisitionList";
import CashierExpenseOutList from "features/sales/cashierExpenseOut/cashierExpenseOutList/CashierExpenseOutList";
import SupplierList from "features/purchase/supplier/supplierMain/supplierList/supplierList";
import StockReport from "features/reports/stockReport/stockReport";
import SalesOrderReport from "features/reports/salesOrderReport/salesOrderReport";
import UserRoleList from "features/user-management/userRole/userRoleList/userRoleList";
import SystemPrivilegeList from "features/user-management/systemPrivilages/SystemPrivilageList/SystemPrivilageList";
import UserAccountList from "features/user-management/registration/userAccount/userAccountList";
import LocationList from "features/inventory/location/locationList/locationList";
import StockManagement from "features/inventory/stockManagement/stockManagement";
import StockLevel from "features/inventory/stockLevel/stockLevel";
import InventoryAnalysisReport from "features/reports/inventoryAnalysisReport/InventoryAnalysisReport";
import InventoryAnalysisAsAtDateReport from "features/reports/inventoryAnalysisReportAsAtDateReport/InventoryAnalysisAsAtDateReport";
import PackingSlipList from "features/sales/packingSlip/packingSlipList/packingSlipList";
import SupplierReturnList from "features/purchase/supplierReturn/supplierReturnList/supplierReturnList";
import EmptyReturnList from "features/inventory/emptyReturn/emptyReturnList/emptyReturnList.jsx";
import RolePermissionMapping from "features/user-management/rolePermissionMapping/RolePermissionMapping";
import CustomerList from "features/sales/customer/customerList/CustomerList";
import CollectionReport from "features/reports/collectionReport/CollectionReport";
import ManagerCollectionReport from "features/reports/ManagerCollectionReport/ManagerCollectionReport";
import CustomerInqueryReport from "features/reports/customerInqueryReport/CustomerInqueryReport";
import MinReport from "features/reports/MinReport/MinReport";
import NotFound from "common/components/NotFound/NotFound";
import SalesInvoiceReport from "features/reports/salesInvoiceReport/salesInvoiceReport.jsx";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Main layout with nested routes */}
        <Route path="/main" element={<Main />}>
          {/* Default redirect */}
          {/* <Route
            index
            element={
              <Navigate to="user-management/user-registration" replace />
            }
          /> */}
          <Route index element={<div></div>} />

          {/* User Management Module */}
          <Route path="user-management">
            <Route path="user-roles" element={<UserRoleList />} />
            <Route path="user-accounts" element={<UserAccountList />} />
            <Route path="user-registration" element={<Registration />} />
            <Route path="user-privileges" element={<SystemPrivilegeList />} />
            <Route
              path="role-permission-mapping"
              element={<RolePermissionMapping />}
            />
          </Route>

          {/* Purchase Module */}
          <Route path="purchase">
            <Route path="requisitions" element={<PurchaseRequisitionList />} />
            <Route path="orders" element={<PurchaseOrderList />} />
            <Route path="grn" element={<GrnList />} />
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="supplier-returns" element={<SupplierReturnList />} />
            <Route
              path="material-requisitions"
              element={<MaterialRequisitionList />}
            />
            <Route
              path="transfer-requisitions"
              element={<TransferRequisitionList />}
            />
            <Route path="min" element={<MinList />} />
            <Route path="tin" element={<TinList />} />
            <Route path="batch-update" element={<ItemBatchUpdate />} />
            <Route path="min-report" element={<MinReport />} />
          </Route>

          {/* Sales Management Module */}
          <Route path="sales">
            <Route path="orders" element={<SalesOrderList />} />
            <Route path="invoices" element={<SalesInvoiceList />} />
            <Route path="receipts" element={<SalesReceiptList />} />
            <Route path="packing-slips" element={<PackingSlipList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="reports/orders" element={<SalesOrderReport />} />
            <Route
              path="requisitions"
              element={<ExpenseOutRequisitionList />}
            />
            <Route path="cashier" element={<CashierExpenseOutList />} />
            <Route
              path="user-collection-report"
              element={<CollectionReport />}
            />
            <Route
              path="collection-report"
              element={<ManagerCollectionReport />}
            />
            <Route
              path="customer-inquiry-report"
              element={<CustomerInqueryReport />}
            />
            <Route
              path="invoice-report"
              element={<SalesInvoiceReport />}
            />
          </Route>

          {/* Inventory Management Module */}
          <Route path="inventory">
            <Route path="items" element={<ItemMasterList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="units" element={<UnitList />} />
            <Route path="locations" element={<LocationList />} />
            <Route path="stock-management" element={<StockManagement />} />
            <Route path="stock-level" element={<StockLevel />} />
            <Route path="empty-return" element={<EmptyReturnList />} />
            <Route path="reports/stock" element={<StockReport />} />
            <Route
              path="reports/inventory-analysis"
              element={<InventoryAnalysisReport />}
            />
            <Route
              path="reports/inventory-analysis-date"
              element={<InventoryAnalysisAsAtDateReport />}
            />
          </Route>
        </Route>

        {/* Catch all - Page Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router >
  );
};

export default Routers;

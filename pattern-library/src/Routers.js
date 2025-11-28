import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login/login";
import Main from "./components/main";
import Registration from "./components/registration/registration";
import PurchaseRequisitionList from "./components/purchaseRequisition/PurchaseRequisitionList/PurchaseRequisitionList";
import PurchaseOrderList from "./components/purchaseOrder/PurchaseOrderList/PurchaseOrderList";
import GrnList from "./components/grn/grnList/grnList";
import SalesOrderList from "./components/salesOrder/salesOrderList/salesOrderList";
import SalesInvoiceList from "./components/salesInvoice/salesInvoiceList/salesInvoiceList";
import ItemMasterList from "./components/itemMaster/itemMasterList/itemMasterList";
import CategoryList from "./components/category/categoryList/categoryList";
import UnitList from "./components/unit/unitList/unitList";
import SalesReceiptList from "./components/salesReceipt/salesReceiptList/salesReceiptList";
import MaterialRequisitionList from "./components/materialRequisition/materialRequisitionList/materialRequisitionList";
import TransferRequisitionList from "./components/transferRequisition/transferRequisitionList/transferRequisitionList";
import MinList from "./components/min/minList/minList";
import TinList from "./components/tin/tinList/tinList";
import ItemBatchUpdate from "./components/itemBatch/itemBatchUpdate/itemBatchUpdate";
import ExpenseOutRequisitionList from "./components/expenseOutRequisition/expenseOutRequisitionList/expenseOutRequisitionList";
import CashierExpenseOut from "./components/cashierExpenseOut/cashierExpenseOut";
import SupplierList from "./components/supplier/supplierMain/supplierList/supplierList";
import StockReport from "./components/stockReport/stockReport";
import SalesOrderReport from "./components/salesOrderReport/salesOrderReport";
import UserRoleList from "./components/userRole/userRoleList/userRoleList";
import SystemPrivilegeList from "./components/systemPrivilages/SystemPrivilageList/SystemPrivilageList";
import UserAccountList from "./components/registration/userAccount/userAccountList";
import LocationList from "./components/location/locationList/locationList";
import StockManagement from "./components/stockManagement/stockManagement";
import StockLevel from "./components/stockLevel/stockLevel";
import InventoryAnalysisReport from "./components/inventoryAnalysisReport/InventoryAnalysisReport";
import InventoryAnalysisAsAtDateReport from "./components/inventoryAnalysisReportAsAtDateReport/InventoryAnalysisAsAtDateReport";
import PackingSlipList from "./components/packingSlip/packingSlipList/packingSlipList";
import SupplierReturnList from "./components/supplierReturn/supplierReturnList/supplierReturnList";
import EmptyReturnList from "./components/emptyReturn/emptyReturnList/emptyReturnList";
import AddEmpties from "./components/emptyReturn/addEmpties/addEmpties";
import RolePermissionMapping from "./components/rolePermissionMapping/RolePermissionMapping";
import CustomerList from "./components/customer/customerList/customerList";
import ItemPriceListList from "./components/itemPriceList/ItemPriceListList/ItemPriceListList";
import ItemTypeList from "./components/itemType/itemTypeList/ItemTypeList";

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
          </Route>

          {/* Sales Management Module */}
          <Route path="sales">
            <Route path="orders" element={<SalesOrderList />} />
            <Route path="invoices" element={<SalesInvoiceList />} />
            <Route path="receipts" element={<SalesReceiptList />} />
            <Route path="packing-slips" element={<PackingSlipList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="price-lists" element={<ItemPriceListList />} />
            <Route path="reports/orders" element={<SalesOrderReport />} />
          </Route>

          {/* Inventory Management Module */}
          <Route path="inventory">
            <Route path="items" element={<ItemMasterList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="item-types" element={<ItemTypeList />} />
            <Route path="units" element={<UnitList />} />
            <Route path="locations" element={<LocationList />} />
            <Route path="stock-management" element={<StockManagement />} />
            <Route path="stock-level" element={<StockLevel />} />
            <Route path="empty-returns" element={<EmptyReturnList />} />
            <Route path="add-empties" element={<AddEmpties />} />
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

          {/* Expense Module */}
          <Route path="expense">
            <Route
              path="requisitions"
              element={<ExpenseOutRequisitionList />}
            />
            <Route path="cashier" element={<CashierExpenseOut />} />
          </Route>
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default Routers;

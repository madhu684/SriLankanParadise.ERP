import { useState, useRef, useEffect } from "react";
import Registration from "../registration/registration.js";
import PurchaseRequisitionList from "../purchaseRequisition/PurchaseRequisitionList/PurchaseRequisitionList.jsx";
import PurchaseOrderList from "../purchaseOrder/PurchaseOrderList/PurchaseOrderList.jsx";
import GrnList from "../grn/grnList/grnList.jsx";
import SalesOrderList from "../salesOrder/salesOrderList/salesOrderList.jsx";
import SalesInvoiceList from "../salesInvoice/salesInvoiceList/salesInvoiceList.jsx";
import ItemMasterList from "../itemMaster/itemMasterList/itemMasterList.jsx";
import CategoryList from "../category/categoryList/categoryList.jsx";
import UnitList from "../unit/unitList/unitList.jsx";
import SalesReceiptList from "../salesReceipt/salesReceiptList/salesReceiptList.jsx";
import MaterialRequisitionList from "../materialRequisition/materialRequisitionList/materialRequisitionList.jsx";
import TransferRequisitionList from "../transferRequisition/transferRequisitionList/transferRequisitionList.jsx";
import MinList from "../min/minList/minList.jsx";
import TinList from "../tin/tinList/tinList.jsx";
import ItemBatchUpdate from "../itemBatch/itemBatchUpdate/itemBatchUpdate.jsx";
import ExpenseOutRequisitionList from "../expenseOutRequisition/expenseOutRequisitionList/expenseOutRequisitionList.jsx";
import CashierExpenseOut from "../cashierExpenseOut/cashierExpenseOut.jsx";
import SupplierList from "../supplier/supplierMain/supplierList/supplierList.jsx";
import StockReport from "../stockReport/stockReport.jsx";
import SalesOrderReport from "../salesOrderReport/salesOrderReport.jsx";
import UserRoleList from "../userRole/userRoleList/userRoleList.jsx";
import SystemPrivilegeList from "../systemPrivilages/SystemPrivilageList/SystemPrivilageList.jsx";
import UserAccountList from "../registration/userAccount/userAccountList.jsx";
import LocationList from "../location/locationList/locationList.jsx";
import StockManagement from "../stockManagement/stockManagement.jsx";
import StockLevel from "../stockLevel/stockLevel.jsx";
import InventoryAnalysisReport from "../inventoryAnalysisReport/InventoryAnalysisReport.jsx";
import InventoryAnalysisAsAtDateReport from "../inventoryAnalysisReportAsAtDateReport/InventoryAnalysisAsAtDateReport.jsx";
import PackingSlipList from "../packingSlip/packingSlipList/packingSlipList.jsx";
import SupplierReturnList from "../supplierReturn/supplierReturnList/supplierReturnList.jsx";
import EmptyReturnList from "../emptyReturn/emptyReturnList/emptyReturnList.jsx";
import AddEmpties from "../emptyReturn/addEmpties/addEmpties.jsx";

const useMain = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const discardedSubmoduleRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isSmallScreen]);

  const handleSubmoduleClick = (submodule) => {
    if (submodule === selectedSubmodule) {
    } else {
      if (selectedSubmodule === "User Registration") {
        discardedSubmoduleRef.current = submodule;
        setShowDiscardConfirmation(true);
      } else {
        setSelectedSubmodule(submodule);
      }
    }
  };

  const handleDiscard = () => {
    const discardedSubmodule = discardedSubmoduleRef.current;
    if (discardedSubmodule) {
      setSelectedSubmodule(discardedSubmodule);
    }
    discardedSubmoduleRef.current = null;
    setShowDiscardConfirmation(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Add other content as needed.
  const renderDetail = (option) => {
    switch (option) {
      case "User Registration":
        return <Registration />;
      case "Purchase Requisitions":
        return <PurchaseRequisitionList />;
      case "Purchase Orders":
        return <PurchaseOrderList />;
      case "Goods Received Notes":
        return <GrnList />;
      case "Sales Orders":
        return <SalesOrderList />;
      case "Sales Invoices":
        return <SalesInvoiceList />;
      case "Item Masters":
        return <ItemMasterList />;
      case "Categories":
        return <CategoryList />;
      case "Units":
        return <UnitList />;
      case "Sales Receipts":
        return <SalesReceiptList />;
      case "Material Requisitions":
        return <MaterialRequisitionList />;
      case "Transfer Requisitions":
        return <TransferRequisitionList />;
      case "Material Issue Notes":
        return <MinList />;
      case "Transfer Issue Notes":
        return <TinList />;
      case "Update Item Batches":
        return <ItemBatchUpdate />;
      case "Expense Out Requisitions":
        return <ExpenseOutRequisitionList />;
      case "Cashier Expense Out":
        return <CashierExpenseOut />;
      case "Suppliers":
        return <SupplierList />;
      case "Stock Report":
        return <StockReport />;
      case "Sales Order Report":
        return <SalesOrderReport />;
      case "User Roles":
        return <UserRoleList />;
      case "User Privileges":
        return <SystemPrivilegeList />;
      case "User Accounts":
        return <UserAccountList />;
      case "Locations":
        return <LocationList />;
      case "Stock Management":
        return <StockManagement />;
      case "Inventory Analysis Report":
        return <InventoryAnalysisReport />;
      case "Inventory As At Date Report":
        return <InventoryAnalysisAsAtDateReport />;
      case "Packing Slip":
        return <PackingSlipList />;
      case "Supplier Return":
        return <SupplierReturnList />;
      case "Stock Level":
        return <StockLevel />;
      case "Empty Return":
        return <EmptyReturnList />;
      default:
        return null;
    }
  };

  return {
    toggleSidebar,
    isSidebarOpen,
    renderDetail,
    selectedSubmodule,
    handleSubmoduleClick,
    showDiscardConfirmation,
    setShowDiscardConfirmation,
    handleDiscard,
    isSmallScreen,
  };
};

export default useMain;

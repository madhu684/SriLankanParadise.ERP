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

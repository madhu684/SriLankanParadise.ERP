import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import Login from "./components/login";
import Main from "./components/main";
import Admin from "./components/admin";
import PurchaseRequisition from "./components/purchaseRequisition/purchaseRequisition";
import PurchaseOrder from "./components/purchaseOrder/purchaseOrder";
import Grn from "./components/grn/grn";
import PurchaseRequisitionList from "./components/purchaseRequisition/PurchaseRequisitionList/PurchaseRequisitionList";
import ItemMaster from "./components/itemMaster/itemMaster";
import Category from "./components/category/category";
import Unit from "./components/unit/unit";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/purchase" element={<PurchaseRequisition />} />
        <Route path="/purchaseorder" element={<PurchaseOrder />} />
        <Route path="/grn" element={<Grn />} />
        <Route path="/purchaselist" element={<PurchaseRequisitionList />} />
        <Route path="/itemmaster" element={<ItemMaster />} />
        <Route path="/category" element={<Category />} />
        <Route path="/unit" element={<Unit />} />
      </Routes>
    </Router>
  );
};

export default Routers;

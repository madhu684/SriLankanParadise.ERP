import React, { useState, useEffect } from "react";
import { Search, Package, MapPin, Calendar } from "lucide-react";
import CreateEmptyReturnManagement from "./createEmptyReturn.js";

const CreateEmptyReturn = ({ show, handleClose }) => {
  const {
    warehouses,
    warehousesLoading,
    // inventoryEmptyReturnItems,
    inventoryEmptyReturnItemsLoading,

    stockData,
    setStockData,
    searchBy,
    setSearchBy,
    showResults,
    setShowResults,
    handleSearch,
    formData,
    setFormData,
    // fromLocationId,
    // setFromLocationId,
    handleInputChange,
    handleCancel,
    handleQuantityChange,
    handleSubmit,
  } = CreateEmptyReturnManagement();

  return (
    <div
      className="container-fluid p-3"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Header */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-header bg-primary text-white py-2">
              <div className="d-flex align-items-center">
                <Package className="me-2" size={18} />
                <h5 className="mb-0">Empty Transfer</h5>
              </div>
            </div>

            <div className="card-body p-3">
              {/* Form Section */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium text-dark">
                    <MapPin size={14} className="me-1" />
                    From Location
                  </label>
                  <select
                    className="form-select"
                    name="fromLocation"
                    value={formData.fromLocation}
                    // onChange={handleInputChange}
                    onChange={(e) =>
                      handleInputChange("fromLocation", e.target.value)
                    }
                    disabled={warehousesLoading} // 🔒 Disable while loading
                  >
                    {warehousesLoading ? (
                      <option>Loading locations...</option> // ⏳ Show while loading
                    ) : (
                      <>
                        <option value="">Select From Location</option>
                        {warehouses
                          .filter((w) => w.locationType?.name === "Warehouse")
                          .map((w) => (
                            <option key={w.locationId} value={w.locationId}>
                              {w.locationName}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium text-dark">
                    <MapPin size={14} className="me-1" />
                    To Location
                  </label>
                  <select
                    className="form-select"
                    name="toLocation"
                    value={formData.toLocation}
                    // onChange={handleInputChange}
                    onChange={(e) =>
                      handleInputChange("toLocation", e.target.value)
                    }
                    disabled={warehousesLoading} // 🔁 Disable while loading
                  >
                    {warehousesLoading ? (
                      <option>Loading locations...</option> // ⏳ Loading state
                    ) : (
                      <>
                        <option value="">Select To Location</option>
                        {warehouses
                          .filter((w) => w.locationType?.name === "Warehouse")
                          .map((w) => (
                            <option key={w.locationId} value={w.locationId}>
                              {w.locationName}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium text-dark">
                    <Calendar size={14} className="me-1" />
                    Transfer Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="adjustedDate"
                    value={formData.adjustedDate}
                    // onChange={handleInputChange}
                    onChange={(e) =>
                      handleInputChange("adjustedDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="d-flex justify-content-center mb-3">
                <button
                  className="btn btn-success px-4 py-2 me-3"
                  onClick={handleSearch}
                  disabled={!formData.fromLocation}
                >
                  <Search size={16} className="me-2" />
                  Search Empties
                </button>
                <button
                  className="btn btn-danger px-4 py-2"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Stock Information Section */}
          {showResults && (
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header bg-info text-white py-2">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Empty Return Information</h6>
                  {/* <div className="input-group" style={{ maxWidth: "250px" }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by item name"
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-light btn-sm"
                      type="button"
                    >
                      <Search size={14} />
                    </button>
                  </div> */}
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="py-2 px-3 fw-medium">Item Code</th>
                        <th className="py-2 px-3 fw-medium">Item Name</th>
                        <th className="py-2 px-3 fw-medium text-center">
                          Unit Name
                        </th>
                        <th className="py-2 px-3 fw-medium text-center">
                          Stock in Hand
                        </th>
                        <th className="py-2 px-3 fw-medium text-center">
                          Batch ID
                        </th>
                        <th className="py-2 px-3 fw-medium text-center">
                          Transfer Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryEmptyReturnItemsLoading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            Loading...
                          </td>
                        </tr>
                      ) : showResults && stockData?.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-4 text-muted"
                          >
                            No empty return items available
                          </td>
                        </tr>
                      ) : (
                        stockData.map((item, index) => (
                          <tr key={index} className="align-middle">
                            <td className="px-3 py-2">
                              <span className="badge bg-primary">
                                {item.itemCode}
                              </span>
                            </td>
                            <td className="px-3 py-2">{item.itemName}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="badge bg-light text-dark">
                                {item.uom}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="badge bg-success">
                                {item.stockInHand}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {/* <span className="badge text-muted font-monospace"> */}
                              <span className="badge bg-light text-dark">
                                {item.batchNumber}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                placeholder="Enter quantity"
                                onChange={(e) =>
                                  handleQuantityChange(index, e.target.value)
                                }
                                min="0"
                                max={item.stockInHand}
                                style={{ minWidth: "120px" }}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center py-2 bg-light">
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className="page-item active">
                        <span className="page-link bg-primary border-primary">
                          1
                        </span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showResults && (
            <div className="card shadow-sm border-0">
              <div className="card-body p-3">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary px-4 py-2"
                    onClick={handleSubmit}
                  >
                    Submit Return
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEmptyReturn;

// import React, { useState } from "react";
// import { Search, Package, MapPin, Calendar } from "lucide-react";

// const CreateEmptyReturn = ({ handleClose }) => {
//   const [formData, setFormData] = useState({
//     fromLocation: "",
//     toLocation: "",
//     adjustedDate: "",
//   });

//   const [stockData, setStockData] = useState([
//     {
//       itemCode: "PL1000",
//       itemName: "Capacitor Contactor 3211 (HDC19s-32) HDC19S3211",
//       uom: "Units",
//       stockInHand: 50,
//       batchNumber: "B-20250516-6810",
//       adjustedQuantity: "",
//     },
//     {
//       itemCode: "PL1000",
//       itemName: "Capacitor Contactor 3211 (HDC19s-32) HDC19S3211",
//       uom: "Units",
//       stockInHand: 5,
//       batchNumber: "B-20250516-3495",
//       adjustedQuantity: "",
//     },
//     {
//       itemCode: "PL1001",
//       itemName: "MCB Switch",
//       uom: "Units",
//       stockInHand: 1,
//       batchNumber: "B-20250516-6810",
//       adjustedQuantity: "",
//     },
//   ]);

//   const [searchBy, setSearchBy] = useState("");
//   const [showResults, setShowResults] = useState(false);

//   const warehouses = [
//     { id: "1", name: "Main Warehouse" },
//     { id: "2", name: "Secondary Warehouse" },
//     { id: "3", name: "Distribution Center" },
//     { id: "4", name: "Regional Hub" },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSearch = () => {
//     setShowResults(true);
//   };

//   const handleQuantityChange = (index, value) => {
//     const updatedData = [...stockData];
//     updatedData[index].adjustedQuantity = value;
//     setStockData(updatedData);
//   };

//   const handleSubmit = () => {
//     console.log("Form submitted:", { formData, stockData });
//     // Handle form submission here
//   };

//   const handleCancel = () => {
//     setFormData({
//       fromLocation: "",
//       toLocation: "",
//       adjustedDate: "",
//     });
//     setStockData(stockData.map((item) => ({ ...item, adjustedQuantity: "" })));
//     setSearchBy("");
//     setShowResults(false);
//   };

//   return (
//     <div
//       className="container-fluid p-3"
//       style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
//     >
//       <div className="row justify-content-center">
//         <div className="col-12">
//           {/* Header */}
//           <div className="card shadow-sm border-0 mb-3">
//             <div className="card-header bg-primary text-white py-2">
//               <div className="d-flex align-items-center">
//                 <Package className="me-2" size={18} />
//                 <h5 className="mb-0">Create Empty Return</h5>
//               </div>
//             </div>

//             <div className="card-body p-3">
//               {/* Form Section */}
//               <div className="row g-3 mb-3">
//                 <div className="col-md-4">
//                   <label className="form-label fw-medium text-dark">
//                     <MapPin size={14} className="me-1" />
//                     From Location
//                   </label>
//                   <select
//                     className="form-select"
//                     name="fromLocation"
//                     value={formData.fromLocation}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select From Location</option>
//                     {warehouses.map((warehouse) => (
//                       <option key={warehouse.id} value={warehouse.id}>
//                         {warehouse.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-medium text-dark">
//                     <MapPin size={14} className="me-1" />
//                     To Location
//                   </label>
//                   <select
//                     className="form-select"
//                     name="toLocation"
//                     value={formData.toLocation}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select To Location</option>
//                     {warehouses.map((warehouse) => (
//                       <option key={warehouse.id} value={warehouse.id}>
//                         {warehouse.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-medium text-dark">
//                     <Calendar size={14} className="me-1" />
//                     Adjusted Date
//                   </label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     name="adjustedDate"
//                     value={formData.adjustedDate}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               {/* Search Button */}
//               <div className="d-flex justify-content-center mb-3">
//                 <button
//                   className="btn btn-success px-4 py-2 me-3"
//                   onClick={handleSearch}
//                   disabled={!formData.fromLocation}
//                 >
//                   <Search size={16} className="me-2" />
//                   Search Empties
//                 </button>
//                 <button
//                   className="btn btn-danger px-4 py-2"
//                   onClick={handleClose}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Stock Information Section */}
//           {showResults && (
//             <div className="card shadow-sm border-0 mb-3">
//               <div className="card-header bg-info text-white py-2">
//                 <div className="d-flex align-items-center justify-content-between">
//                   <h6 className="mb-0">Stock Information</h6>
//                   <div className="input-group" style={{ maxWidth: "250px" }}>
//                     <input
//                       type="text"
//                       className="form-control form-control-sm"
//                       placeholder="Search by item name"
//                       value={searchBy}
//                       onChange={(e) => setSearchBy(e.target.value)}
//                     />
//                     <button
//                       className="btn btn-outline-light btn-sm"
//                       type="button"
//                     >
//                       <Search size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

// <div className="card-body p-0">
//   <div className="table-responsive">
//     <table className="table table-hover mb-0">
//       <thead className="table-dark">
//         <tr>
//           <th className="py-2 px-3 fw-medium">Item Code</th>
//           <th className="py-2 px-3 fw-medium">Item Name</th>
//           <th className="py-2 px-3 fw-medium text-center">UOM</th>
//           <th className="py-2 px-3 fw-medium text-center">
//             Stock in Hand
//           </th>
//           <th className="py-2 px-3 fw-medium">Batch Number</th>
//           <th className="py-2 px-3 fw-medium text-center">
//             Adjusted Quantity
//           </th>
//         </tr>
//       </thead>
//       <tbody>
//         {stockData.map((item, index) => (
//           <tr key={index} className="align-middle">
//             <td className="px-3 py-2">
//               <span className="badge bg-primary">
//                 {item.itemCode}
//               </span>
//             </td>
//             <td className="px-3 py-2">
//               <div className="fw-normal text-dark">
//                 {item.itemName}
//               </div>
//             </td>
//             <td className="px-3 py-2 text-center">
//               <span className="badge bg-light text-dark">
//                 {item.uom}
//               </span>
//             </td>
//             <td className="px-3 py-2 text-center">
//               <span className="badge bg-success">
//                 {item.stockInHand}
//               </span>
//             </td>
//             <td className="px-3 py-2">
//               <small className="text-muted font-monospace">
//                 {item.batchNumber}
//               </small>
//             </td>
//             <td className="px-3 py-2">
//               <input
//                 type="number"
//                 className="form-control form-control-sm text-center"
//                 placeholder="Enter quantity"
//                 value={item.adjustedQuantity}
//                 onChange={(e) =>
//                   handleQuantityChange(index, e.target.value)
//                 }
//                 min="0"
//                 max={item.stockInHand}
//                 style={{ minWidth: "120px" }}
//               />
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>

//                 {/* Pagination */}
//                 <div className="d-flex justify-content-center py-2 bg-light">
//                   <nav>
//                     <ul className="pagination pagination-sm mb-0">
//                       <li className="page-item active">
//                         <span className="page-link bg-primary border-primary">
//                           1
//                         </span>
//                       </li>
//                     </ul>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           {showResults && (
//             <div className="card shadow-sm border-0">
//               <div className="card-body p-3">
//                 <div className="d-flex justify-content-end gap-2">
//                   <button
//                     className="btn btn-outline-secondary px-4 py-2"
//                     onClick={handleCancel}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="btn btn-primary px-4 py-2"
//                     onClick={handleSubmit}
//                   >
//                     Submit Return
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEmptyReturn;

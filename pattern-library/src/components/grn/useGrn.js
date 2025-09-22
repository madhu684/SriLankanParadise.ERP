import { useState, useEffect, useRef } from "react";
import {
  get_purchase_orders_with_out_drafts_api,
  get_purchase_requisitions_with_out_drafts_api,
  get_approved_supply_return_masters_by_companyId,
  get_company_suppliers_api,
  approve_supply_return_master_api,
} from "../../services/purchaseApi";
import {
  post_grn_master_api,
  post_grn_detail_api,
  get_grn_masters_by_purchase_order_id_api,
  get_company_locations_api,
} from "../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useGrn = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    grnDate: "",
    receivedBy: "",
    receivedDate: "",
    itemDetails: [],
    status: "",
    purchaseOrderId: null,
    supplierId: null,
    purchaseRequisitionId: null,
    supplyReturnMasterId: null,
    grnType: "goodsReceivedNote",
    warehouseLocation: null,
    selectedSupplier: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [selectedPurchaseRequisition, setSelectedPurchaseRequisition] =
    useState(null);
  const [selectedSupplyReturn, setSelectedSupplyReturn] = useState(null);
  const statusOptions = [
    { id: "4", label: "In Progress" },
    { id: "5", label: "Completed" },
  ];
  const alertRef = useRef(null);
  const [purchaseOrderSearchTerm, setPurchaseOrderSearchTerm] = useState("");
  const [purchaseRequisitionSearchTerm, setPurchaseRequisitionSearchTerm] =
    useState("");
  const [supplyReturnSearchTerm, setSupplyReturnSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const grnTypeOptions = [
    { id: "goodsReceivedNote", label: "Goods Received Note" },
    { id: "finishedGoodsIn", label: "Finished Goods In" },
    { id: "directPurchase", label: "Direct Purchase" },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [searchByPO, setSearchByPO] = useState(true);
  const [searchByPR, setSearchByPR] = useState(false);
  const [searchBySR, setSearchBySR] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");

  const fetchLocations = async () => {
    try {
      const response = await get_company_locations_api(
        sessionStorage.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const fetchItems = async (companyId, searchQuery) => {
    try {
      const response = await get_item_masters_by_company_id_with_query_api(
        companyId,
        searchQuery,
        false
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const {
    data: availableItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: () => fetchItems(sessionStorage.getItem("companyId"), searchTerm),
  });

  const fetchPurchaseOrders = async () => {
    try {
      const response = await get_purchase_orders_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );
      const filteredPurchaseOrders = response.data.result?.filter(
        (po) => po.status === 2
      );
      return filteredPurchaseOrders || [];
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  const {
    data: purchaseOrders,
    isLoading,
    isError,
    error,
    refetch: refetchPurchaseOrders,
  } = useQuery({
    queryKey: ["purchaseOrders"],
    queryFn: fetchPurchaseOrders,
  });

  const fetchPerchaseRequisitions = async () => {
    try {
      const response = await get_purchase_requisitions_with_out_drafts_api(
        sessionStorage?.getItem("companyId")
      );
      const filteredPurchaseRequisitions = response.data.result?.filter(
        (pr) => pr.status === 2
      );
      return filteredPurchaseRequisitions || [];
    } catch (error) {
      console.error("Error fetching purchase requisitions:", error);
    }
  };

  const {
    data: purchaseRequisitions,
    isLoadingPurchaseRequisition,
    isErrorPurchaseRequisition,
    errorPurchaseRequisition,
    refetch: refetchPerchaseRequisitions,
  } = useQuery({
    queryKey: ["purchaseRequisitions"],
    queryFn: fetchPerchaseRequisitions,
  });

  const fetchApprovedSupplyReturnMasters = async () => {
    try {
      const response = await get_approved_supply_return_masters_by_companyId(
        sessionStorage.getItem("companyId")
      );
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching approved supply return masters:", error);
    }
  };

  const { data: approvedSupplyReturnMasters } = useQuery({
    queryKey: [
      "approvedSupplyReturnMasters",
      sessionStorage.getItem("companyId"),
    ],
    queryFn: fetchApprovedSupplyReturnMasters,
  });

  const fetchGrnsBypurchaseOrderId = async (purchaseOrderId) => {
    try {
      const response = await get_grn_masters_by_purchase_order_id_api(
        purchaseOrderId
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching grns:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await get_company_suppliers_api(
        sessionStorage.getItem("companyId")
      );

      const filteredSuppliers = response.data.result?.filter(
        (supplier) => supplier.status === 1
      );
      return filteredSuppliers || [];
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const {
    data: suppliers,
    isLoadingSuppliers,
    isErrorSuppliers,
    errorSuppliers,
    refetch: refetchSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const {
    data: grns,
    isLoading: isGrnsLoading,
    isError: isGrnsError,
    error: grnError,
    refetch: refetchGrns,
  } = useQuery({
    queryKey: ["grns", selectedPurchaseOrder?.purchaseOrderId],
    queryFn: () =>
      fetchGrnsBypurchaseOrderId(selectedPurchaseOrder.purchaseOrderId),
  });

  useEffect(() => {
    if (grns && selectedPurchaseOrder) {
      const updatedItemDetails = selectedPurchaseOrder.purchaseOrderDetails
        .map((poItem) => {
          const receivedQuantity = grns.reduce((total, grn) => {
            const grnDetail = grn.grnDetails.find(
              (detail) => detail.itemId === poItem.itemMaster?.itemMasterId
            );
            return total + (grnDetail ? grnDetail.receivedQuantity : 0);
          }, 0);

          const remainingQuantity = poItem.quantity - receivedQuantity;

          return {
            id: poItem.itemMaster?.itemMasterId,
            name: poItem.itemMaster?.itemName,
            unit: poItem.itemMaster?.unit.unitName,
            quantity: poItem.quantity,
            remainingQuantity: Math.max(0, remainingQuantity),
            receivedQuantity: 0,
            rejectedQuantity: 0,
            freeQuantity: 0,
            //expiryDate: '',
            itemBarcode: "",
            unitPrice: poItem.unitPrice,
          };
        })
        .filter((item) => item.remainingQuantity > 0);

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else if (selectedPurchaseOrder) {
      // If there are no existing GRNs, show all items from the selected purchase order
      const allItemDetails = selectedPurchaseOrder.purchaseOrderDetails.map(
        (poItem) => ({
          id: poItem.itemMaster?.itemMasterId,
          name: poItem.itemMaster?.itemName,
          unit: poItem.itemMaster?.unit.unitName,
          quantity: poItem.quantity,
          remainingQuantity: poItem.quantity, // Set remaining quantity same as ordered quantity
          receivedQuantity: 0,
          rejectedQuantity: 0,
          freeQuantity: 0,
          //expiryDate: '',
          itemBarcode: "",
          unitPrice: poItem.unitPrice,
          // Other item properties...
        })
      );

      // Update form data with all items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: allItemDetails,
      }));
    }
  }, [grns, selectedPurchaseOrder]);

  /*Begin of purchase requisition use effect */
  useEffect(() => {
    if (grns && selectedPurchaseRequisition) {
      const updatedItemDetails =
        selectedPurchaseRequisition.purchaseRequisitionDetails
          .map((prItem) => {
            const receivedQuantity = grns.reduce((total, grn) => {
              const grnDetail = grn.grnDetails.find(
                (detail) => detail.itemId === prItem.itemMaster?.itemMasterId
              );
              return total + (grnDetail ? grnDetail.receivedQuantity : 0);
            }, 0);

            const remainingQuantity = prItem.quantity - receivedQuantity;

            return {
              id: prItem.itemMaster?.itemMasterId,
              name: prItem.itemMaster?.itemName,
              unit: prItem.itemMaster?.unit.unitName,
              quantity: prItem.quantity,
              remainingQuantity: Math.max(0, remainingQuantity),
              receivedQuantity: 0,
              rejectedQuantity: 0,
              freeQuantity: 0,
              //expiryDate: '',
              itemBarcode: "",
              unitPrice: prItem.unitPrice,
            };
          })
          .filter((item) => item.remainingQuantity > 0);

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else if (selectedPurchaseRequisition) {
      // If there are no existing GRNs, show all items from the selected purchase order
      const allItemDetails =
        selectedPurchaseRequisition.purchaseRequisitionDetails.map(
          (prItem) => ({
            id: prItem.itemMaster?.itemMasterId,
            name: prItem.itemMaster?.itemName,
            unit: prItem.itemMaster?.unit.unitName,
            quantity: prItem.quantity,
            remainingQuantity: prItem.quantity, // Set remaining quantity same as ordered quantity
            receivedQuantity: 0,
            rejectedQuantity: 0,
            freeQuantity: 0,
            //expiryDate: '',
            itemBarcode: "",
            unitPrice: prItem.unitPrice,
            // Other item properties...
          })
        );

      // Update form data with all items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: allItemDetails,
      }));
    }
  }, [grns, selectedPurchaseRequisition]);

  /*End of purchse requisition use effect */

  /*Begin of supply return use effect */
  useEffect(() => {
    if (grns && selectedSupplyReturn) {
      const updatedItemDetails = selectedSupplyReturn.supplyReturnDetails
        .map((srItem) => {
          const receivedQuantity = grns.reduce((total, grn) => {
            const grnDetail = grn.grnDetails.find(
              (detail) => detail.itemId === srItem.itemMaster?.itemMasterId
            );
            return total + (grnDetail ? grnDetail.receivedQuantity : 0);
          }, 0);

          const remainingQuantity = srItem.returnedQuantity - receivedQuantity;

          return {
            id: srItem.itemMaster?.itemMasterId,
            name: srItem.itemMaster?.itemName,
            unit: srItem.itemMaster?.unit.unitName,
            quantity: srItem.quantity,
            remainingQuantity: Math.max(0, remainingQuantity),
            receivedQuantity: 0,
            rejectedQuantity: 0,
            freeQuantity: 0,
            //expiryDate: '',
            itemBarcode: "",
            unitPrice: srItem.itemMaster.unitPrice,
          };
        })
        .filter((item) => item.remainingQuantity > 0);

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else if (selectedSupplyReturn) {
      // If there are no existing GRNs, show all items from the selected supply return
      const allItemDetails = selectedSupplyReturn.supplyReturnDetails.map(
        (srItem) => ({
          id: srItem.itemMaster?.itemMasterId,
          name: srItem.itemMaster?.itemName,
          unit: srItem.itemMaster?.unit.unitName,
          quantity: srItem.returnedQuantity,
          remainingQuantity: srItem.returnedQuantity, // Set remaining quantity same as ordered quantity
          receivedQuantity: 0,
          rejectedQuantity: 0,
          freeQuantity: 0,
          //expiryDate: '',
          itemBarcode: "",
          unitPrice: srItem.itemMaster.unitPrice,
          // Other item properties...
        })
      );

      // Update form data with all items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: allItemDetails,
      }));
    }
  }, [grns, selectedSupplyReturn]);

  /*End of supply return use effect */

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {}
  ) => {
    let isFieldValid = true;
    let errorMessage = "";

    // Required validation
    if (value === null || value === undefined || `${value}`.trim() === "") {
      isFieldValid = false;
      errorMessage = `${fieldDisplayName} is required`;
    }

    // Additional validation
    if (
      isFieldValid &&
      additionalRules.validationFunction &&
      !additionalRules.validationFunction(value)
    ) {
      isFieldValid = false;
      errorMessage = additionalRules.errorMessage;
    }

    setValidFields((prev) => ({ ...prev, [fieldName]: isFieldValid }));
    setValidationErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));

    return isFieldValid;
  };

  const validateForm = () => {
    setValidFields({});
    setValidationErrors({});

    const isGrnDateValid = validateField(
      "grnDate",
      "GRN date",
      formData.grnDate
    );

    const isReceivedByValid = validateField(
      "receivedBy",
      "Received By",
      formData.receivedBy
    );

    const isReceivedDateValid = validateField(
      "receivedDate",
      "Received date",
      formData.receivedDate
    );

    const isPurchaseRequisitionIdValid = validateField(
      "purchaseRequisitionId",
      "Purchase requisition Id",
      formData.purchaseRequisitionId
    );

    const isSupplyReturnIdValid = validateField(
      "supplyReturnMasterId",
      "Supply return master Id",
      formData.supplyReturnMasterId
    );

    const isSupplierValid = validateField(
      "supplierId",
      "Supplier",
      formData.supplierId
    );

    const isStatusValid = validateField("status", "Status", formData.status);

    let isPurchaseOrderIdValid = true;
    if (!["finishedGoodsIn", "directPurchase"].includes(formData?.grnType)) {
      isPurchaseOrderIdValid = validateField(
        "purchaseOrderId",
        "Purchase order reference number",
        formData.purchaseOrderId
      );
    }

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `receivedQuantity_${index}`;
      const fieldDisplayName = `Received Quantity for ${item.name}`;

      let additionalRules = {};

      if (["finishedGoodsIn", "directPurchase"].includes(formData?.grnType)) {
        // Rule for finishedGoodsIn or directPurchase
        additionalRules = {
          validationFunction: (value) => parseFloat(value) > 0,
          errorMessage: `${fieldDisplayName} must be greater than 0`,
        };
      } else {
        // Default rule
        additionalRules = {
          validationFunction: (value) =>
            parseFloat(value) > 0 &&
            parseFloat(value) <= item.remainingQuantity,
          errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to remaining quantity ${item.remainingQuantity}`,
        };
      }

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.receivedQuantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    let isRejectedQuantityValid = true;
    // Validate rejected quantity
    formData.itemDetails.forEach((item, index) => {
      const rejectedFieldName = `rejectedQuantity_${index}`;
      const rejectedFieldDisplayName = `Rejected Quantity for ${item.name}`;

      const additionalRejectedRules = {
        validationFunction: (value) =>
          parseFloat(value) <= item.receivedQuantity,
        errorMessage: `${rejectedFieldDisplayName} must be less than or equal to received quantity ${item.receivedQuantity}`,
      };

      const isValidRejectedQuantity = validateField(
        rejectedFieldName,
        rejectedFieldDisplayName,
        item.rejectedQuantity,
        additionalRejectedRules
      );

      isRejectedQuantityValid =
        isRejectedQuantityValid && isValidRejectedQuantity;
    });

    let isItemUnitPriceValid = true;

    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      // Validation for unit price
      const unitPriceFieldName = `unitPrice_${index}`;
      const unitPriceFieldDisplayName = `Unit Price for ${item.name}`;

      const unitPriceAdditionalRules = {
        validationFunction: (value) => parseFloat(value) > 0,
        errorMessage: `${unitPriceFieldDisplayName} is required`,
      };

      const isValidUnitPrice = validateField(
        unitPriceFieldName,
        unitPriceFieldDisplayName,
        item.unitPrice,
        unitPriceAdditionalRules
      );

      isItemUnitPriceValid = isItemUnitPriceValid && isValidUnitPrice;
    });

    //let isItemExpiryDateValid = true

    // Validate item details
    // formData.itemDetails.forEach((item, index) => {
    //   // Validation for expiry date
    //   const expiryDateFieldName = `expiryDate_${index}`
    //   const expiryDateFieldDisplayName = `Expiry Date for ${item.name}`

    //   const isValidExpiryDate = validateField(
    //     expiryDateFieldName,
    //     expiryDateFieldDisplayName,
    //     item.expiryDate
    //   )

    //   isItemExpiryDateValid = isItemExpiryDateValid && isValidExpiryDate
    // })

    const isItemBarcodeValid = validateField(
      "itemBarcode",
      "Item Barcode",
      formData.itemBarcode
    );

    const isGrnTypeValid = validateField(
      "grnType",
      "GRN type",
      formData.grnType
    );

    const isWarehouseLocationValid = validateField(
      "warehouseLocation",
      "Warehouse location",
      formData.warehouseLocation
    );

    console.log("isGrnDateValid", isGrnDateValid);
    console.log("isReceivedByValid", isReceivedByValid);
    console.log("isReceivedDateValid", isReceivedDateValid);
    console.log("isStatusValid", isStatusValid);
    console.log("isPurchaseOrderIdValid", isPurchaseOrderIdValid);
    console.log("isPurchaseRequisitionIdValid", isPurchaseRequisitionIdValid);
    console.log("isSupplierValid", isSupplierValid);
    console.log("isItemQuantityValid", isItemQuantityValid);
    console.log("isItemUnitPriceValid", isItemUnitPriceValid);
    console.log("isItemQuantityValid", isItemQuantityValid);
    console.log("isRejectedQuantityValid", isRejectedQuantityValid);
    console.log("isGrnTypeValid", isGrnTypeValid);
    console.log("isWarehouseLocationValid", isWarehouseLocationValid);

    return (
      isGrnDateValid &&
      isReceivedByValid &&
      isReceivedDateValid &&
      isStatusValid &&
      isItemQuantityValid &&
      isItemUnitPriceValid &&
      isRejectedQuantityValid &&
      isGrnTypeValid &&
      isWarehouseLocationValid &&
      (isPurchaseOrderIdValid ||
        (isPurchaseRequisitionIdValid && isSupplierValid) ||
        isSupplyReturnIdValid)
    );
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const status = isSaveAsDraft ? 0 : 1;

      const combinedStatus = parseInt(`${formData.status}${status}`, 10);

      const currentDate = new Date().toISOString();

      const purchaseOrderId = ["finishedGoodsIn", "directPurchase"].includes(
        formData?.grnType
      )
        ? null
        : formData?.purchaseOrderId;

      const isFormValid = validateForm();
      console.log("isFormValid", isFormValid);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const grnData = {
          purchaseOrderId: purchaseOrderId,
          purchaseRequisitionId: formData.purchaseRequisitionId,
          supplyReturnMasterId: formData.supplyReturnMasterId,
          supplierId: formData.supplierId,
          grnDate: formData.grnDate,
          receivedBy: formData.receivedBy,
          receivedDate: formData.receivedDate,
          status: combinedStatus,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          receivedUserId: sessionStorage?.getItem("userId") ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          createdDate: currentDate,
          lastUpdatedDate: currentDate,
          grnType: formData.grnType,
          warehouseLocationId: formData.warehouseLocation,
          permissionId: 20,
        };

        const response = await post_grn_master_api(grnData);
        console.log("GRN Response", response);

        const grnMasterId = response.data.result.grnMasterId;

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          const detailsData = {
            grnMasterId,
            receivedQuantity: item.receivedQuantity,
            acceptedQuantity: item.receivedQuantity - item.rejectedQuantity,
            rejectedQuantity: item.rejectedQuantity,
            unitPrice: item.unitPrice,
            itemId: item.id,
            freeQuantity: item.freeQuantity,
            //expiryDate: item.expiryDate,
            itemBarcode: item.itemBarcode,
            permissionId: 20,
          };

          // Call post_purchase_requisition_detail_api for each item
          const detailsApiResponse = await post_grn_detail_api(detailsData);
          console.log("GRN Details Response", detailsApiResponse);

          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201
        );

        let updateSupplyReturnSuccessfull = true;

        if (searchBySR && selectedSupplyReturn) {
          updateSupplyReturnSuccessfull = await updateSupplyReturnMaster(
            selectedSupplyReturn
          );
        }

        if (allDetailsSuccessful && updateSupplyReturnSuccessfull) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("GRN saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("GRN submitted successfully!", formData);
          }

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            onFormSubmit();
          }, 3000);
        } else {
          setSubmissionStatus("error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
        setLoadingDraft(false);
      }, 3000);
    }
  };

  const updateSupplyReturnMaster = async (master) => {
    try {
      let updateSuccessfull = false;

      let updateMasterData = {
        status: 4,
        approvedBy: master.approvedBy,
        approvedUserId: master.approvedUserId,
        approvedDate: master.approvedDate,
      };

      const response = await approve_supply_return_master_api(
        master.supplyReturnMasterId,
        updateMasterData
      );

      if (response.status === 200) {
        console.log("Supply Return Master Updated Successfully", response);
        updateSuccessfull = true;
      }

      return updateSuccessfull;
    } catch (error) {
      console.error("Error updating supply return master:", error);
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    if (field === "grnType") {
      handleResetPurchaseOrder();
    }
  };

  const handleItemDetailsChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails[index][field] = value;

      // Ensure positive values for Quantities
      updatedItemDetails[index].receivedQuantity = Math.max(
        0,
        updatedItemDetails[index].receivedQuantity
      );

      updatedItemDetails[index].rejectedQuantity = Math.max(
        0,
        updatedItemDetails[index].rejectedQuantity
      );

      updatedItemDetails[index].freeQuantity = Math.max(
        0,
        updatedItemDetails[index].freeQuantity
      );

      updatedItemDetails[index].unitPrice = !isNaN(
        parseFloat(updatedItemDetails[index].unitPrice)
      )
        ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
        : 0;

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  };

  const handleRemoveItem = (index) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    setValidFields({});
    setValidationErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePurchaseOrderChange = (referenceId) => {
    const selectedPurchaseOrder = purchaseOrders.find(
      (purchaseOrder) => purchaseOrder.referenceNo === referenceId
    );

    setSelectedPurchaseOrder(selectedPurchaseOrder);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseOrderId: selectedPurchaseOrder?.purchaseOrderId ?? "",
    }));
    // Refetch GRNs for the selected PO
    refetchGrns();
    setPurchaseOrderSearchTerm("");
  };

  const handlePurchaseRequisitionChange = (referenceId) => {
    const selectedPurchaseRequisition = purchaseRequisitions.find(
      (purchaseRequisition) => purchaseRequisition.referenceNo === referenceId
    );

    setSelectedPurchaseRequisition(selectedPurchaseRequisition);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseRequisitionId:
        selectedPurchaseRequisition?.purchaseRequisitionId ?? null,
      selectedSupplier: selectedPurchaseRequisition?.supplier ?? null,
      supplierId: selectedPurchaseRequisition?.supplier?.supplierId ?? null,
    }));
    // Refetch GRNs for the selected PO
    refetchGrns();
    setPurchaseRequisitionSearchTerm("");
  };

  const handleSupplyReturnChange = (referenceId) => {
    const selectedSupplyReturn = approvedSupplyReturnMasters.find(
      (supplyReturn) => supplyReturn.referenceNo === referenceId
    );

    setSelectedSupplyReturn(selectedSupplyReturn);

    setFormData((prevFormData) => ({
      ...prevFormData,
      supplyReturnMasterId: selectedSupplyReturn?.supplyReturnMasterId ?? "",
    }));
    setSupplyReturnSearchTerm("");
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: selectedOption?.id,
    }));
  };

  const handleResetPurchaseOrder = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseOrderId: null,
      itemDetails: [],
    }));

    setSelectedPurchaseOrder(null);

    setValidFields({});
    setValidationErrors({});
  };

  const handleResetPurchaseRequisition = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseRequisitionId: null,
      itemDetails: [],
    }));

    setSelectedPurchaseRequisition(null);

    setValidFields({});
    setValidationErrors({});
  };

  const handleResetSupplyReturn = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplyReturnMasterId: null,
      itemDetails: [],
    }));

    setSelectedSupplyReturn(null);

    setValidFields({});
    setValidationErrors({});
  };

  const handleSelectItem = (item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemDetails: [
        ...prevFormData.itemDetails,
        {
          id: item.itemMasterId,
          name: item.itemName,
          unit: item.unit.unitName,
          quantity: 0,
          remainingQuantity: 0,
          receivedQuantity: 0,
          rejectedQuantity: 0,
          freeQuantity: 0,
          //expiryDate: '',
          itemBarcode: "",
          unitPrice: 0.0,
        },
      ],
    }));
    setSearchTerm(""); // Clear the search term
  };

  const handleSelectSupplier = (selectedSupplier) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier.supplierId,
      selectedSupplier: selectedSupplier,
    }));
    setSupplierSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  };

  const handleResetSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSupplier: null,
      supplierId: null,
    }));
  };

  console.log("formData", formData);

  return {
    formData,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    selectedPurchaseRequisition,
    selectedSupplyReturn,
    purchaseOrders,
    purchaseRequisitions,
    approvedSupplyReturnMasters,
    statusOptions,
    submissionStatus,
    supplierSearchTerm,
    alertRef,
    isLoading,
    isError,
    suppliers,
    purchaseOrderSearchTerm,
    purchaseRequisitionSearchTerm,
    supplyReturnSearchTerm,
    loading,
    loadingDraft,
    grnTypeOptions,
    searchTerm,
    availableItems,
    isItemsLoading,
    isItemsError,
    itemsError,
    locations,
    isLocationsLoading,
    isLocationsError,
    locationsError,
    searchByPO,
    searchByPR,
    searchBySR,
    setSearchByPO,
    setSearchByPR,
    setSearchBySR,
    handleInputChange,
    handleItemDetailsChange,
    handleRemoveItem,
    handlePrint,
    handleSubmit,
    handlePurchaseOrderChange,
    handlePurchaseRequisitionChange,
    handleSupplyReturnChange,
    handleStatusChange,
    setSupplierSearchTerm,
    handleSelectSupplier,
    setPurchaseOrderSearchTerm,
    setPurchaseRequisitionSearchTerm,
    setSupplyReturnSearchTerm,
    setSelectedPurchaseOrder,
    setSelectedPurchaseRequisition,
    handleResetPurchaseOrder,
    handleResetSupplyReturn,
    handleResetSupplier,
    handleResetPurchaseRequisition,
    setSearchTerm,
    handleSelectItem,
  };
};

export default useGrn;

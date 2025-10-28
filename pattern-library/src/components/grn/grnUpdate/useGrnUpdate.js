import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  get_company_suppliers_api,
  get_purchase_orders_with_out_drafts_api,
  get_purchase_requisitions_with_out_drafts_api,
  get_supply_return_masters_by_supplyReturnMasterId,
} from "../../../services/purchaseApi";
import {
  put_grn_master_api,
  put_grn_detail_api,
  post_grn_detail_api,
  delete_grn_detail_api,
  get_company_locations_api,
  get_grn_masters_by_purchase_order_id_api,
} from "../../../services/purchaseApi";
import { get_item_masters_by_company_id_with_query_api } from "../../../services/inventoryApi";
import { useQuery } from "@tanstack/react-query";

const useGrnUpdate = ({ grn, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    grnDate: "",
    receivedBy: "",
    receivedDate: "",
    itemDetails: [],
    status: "",
    purchaseOrderId: "",
    supplierId: "",
    purchaseRequisitionId: "",
    supplyReturnMasterId: "",
    grnType: "directPurchase",
    warehouseLocation: null,
    referenceNo: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [selectedPurchaseRequisition, setSelectedPurchaseRequisition] =
    useState(null);
  const [selectedSupplyReturn, setSelectedSupplyReturn] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [hasManualEdits, setHasManualEdits] = useState(false);
  const [grnDetailIdsToDelete, setGrnDetailIdsToDelete] = useState([]);

  const statusOptions = useMemo(
    () => [
      { id: "4", label: "In Progress" },
      { id: "5", label: "Completed" },
    ],
    []
  );

  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const grnTypeOptions = useMemo(
    () => [
      { id: "goodsReceivedNote", label: "Goods Received Note" },
      { id: "finishedGoodsIn", label: "Finished Goods In" },
      { id: "directPurchase", label: "Direct Purchase" },
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchByPO, setSearchByPO] = useState(false);
  const [searchByPR, setSearchByPR] = useState(true);

  // FIXED: Use ref to track if we've logged to prevent infinite console logs
  const hasLoggedGrn = useRef(false);
  useEffect(() => {
    if (!hasLoggedGrn.current) {
      console.log("Grn: ", grn);
      hasLoggedGrn.current = true;
    }
  }, [grn]);

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

  const {
    data: grns = [],
    isFetched: isGrnsFetched,
    isLoading: isGrnsLoading,
    isError: isGrnsError,
    error: grnError,
    refetch: refetchGrns,
  } = useQuery({
    queryKey: ["grns", selectedPurchaseOrder?.purchaseOrderId],
    queryFn: () =>
      fetchGrnsBypurchaseOrderId(selectedPurchaseOrder.purchaseOrderId),
    enabled: !!selectedPurchaseOrder?.purchaseOrderId,
  });

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

  const fetchSupplyReturns = async () => {
    try {
      const response = await get_supply_return_masters_by_supplyReturnMasterId(
        parseInt(grn.supplyReturnMasterId)
      );
      if (response.data.result !== null) {
        setSelectedSupplyReturn(response.data.result);
      }
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching supply returns:", error);
    }
  };

  const {
    data: supplyReturns,
    isLoadingSupplyReturns,
    isErrorSupplyReturns,
    errorSupplyReturns,
    refetch: refetchSupplyReturns,
  } = useQuery({
    queryKey: ["supplyReturns"],
    queryFn: fetchSupplyReturns,
    enabled: !!grn.supplyReturnMasterId,
  });

  const handlePurchaseOrderChange = useCallback(
    (purchaseOrderId) => {
      if (!purchaseOrders) return;

      const selectedPurchaseOrder = purchaseOrders.find(
        (purchaseOrder) => purchaseOrder.purchaseOrderId === purchaseOrderId
      );

      setSelectedPurchaseOrder(selectedPurchaseOrder);

      setFormData((prevFormData) => ({
        ...prevFormData,
        purchaseOrderId: selectedPurchaseOrder?.purchaseOrderId ?? "",
      }));
    },
    [purchaseOrders]
  );

  const handlePurchaseRequisitionChange = useCallback(
    (purchaseRequisitionId) => {
      if (!purchaseRequisitions) return;

      const selectedPurchaseRequisition = purchaseRequisitions.find(
        (purchaseRequisition) =>
          purchaseRequisition.purchaseRequisitionId === purchaseRequisitionId
      );

      setSelectedPurchaseRequisition(selectedPurchaseRequisition);

      setFormData((prevFormData) => ({
        ...prevFormData,
        purchaseRequisitionId:
          selectedPurchaseRequisition?.purchaseRequisitionId ?? "",
      }));
    },
    [purchaseRequisitions]
  );

  const handleSupplierChange = useCallback(
    (supplierId) => {
      if (!suppliers) return;

      const selectedSupplier = suppliers.find(
        (supplier) => supplier.supplierId === supplierId
      );

      setSelectedSupplier(selectedSupplier);

      setFormData((prevFormData) => ({
        ...prevFormData,
        supplierId: selectedSupplier?.supplierId ?? "",
      }));
    },
    [suppliers]
  );

  // Added useRef to track if initial setup is complete
  const isInitialSetupComplete = useRef(false);

  // Initial data setup - only runs once when grn and data are loaded
  useEffect(() => {
    // Skip if already initialized or if data is still loading
    if (
      isInitialSetupComplete.current ||
      isLoading ||
      !purchaseOrders ||
      !purchaseRequisitions ||
      !suppliers
    ) {
      return;
    }

    const deepCopyGrn = JSON.parse(JSON.stringify(grn));
    setFormData({
      grnDate: deepCopyGrn?.grnDate?.split("T")[0] ?? "",
      receivedBy: deepCopyGrn?.receivedBy ?? "",
      receivedDate: deepCopyGrn?.receivedDate?.split("T")[0] ?? "",
      itemDetails: [],
      status: deepCopyGrn?.status?.toString().charAt(0) ?? "",
      purchaseOrderId: deepCopyGrn?.purchaseOrderId ?? "",
      purchaseRequisitionId: deepCopyGrn?.purchaseRequisitionId ?? "",
      supplyReturnMasterId: deepCopyGrn?.supplyReturnMasterId ?? "",
      supplierId: deepCopyGrn?.supplierId ?? "",
      attachments: deepCopyGrn?.attachments ?? [],
      grnType: deepCopyGrn?.grnType,
      warehouseLocation: deepCopyGrn?.warehouseLocationId,
      referenceNo: deepCopyGrn?.referenceNo,
    });

    handlePurchaseOrderChange(deepCopyGrn?.purchaseOrderId);
    handlePurchaseRequisitionChange(deepCopyGrn?.purchaseRequisitionId);
    handleSupplierChange(deepCopyGrn?.supplierId);

    // Mark initialization as complete
    isInitialSetupComplete.current = true;
  }, [
    grn,
    isLoading,
    purchaseOrders,
    purchaseRequisitions,
    suppliers,
    handlePurchaseOrderChange,
    handlePurchaseRequisitionChange,
    handleSupplierChange,
  ]);

  // Separate effect for updating item details when purchase order or grns change
  useEffect(() => {
    // Skip if initial setup is not complete
    if (!isInitialSetupComplete.current || !isGrnsFetched) {
      return;
    }

    if (hasManualEdits) {
      return;
    }

    if (grns && selectedPurchaseOrder) {
      const updatedItemDetails = selectedPurchaseOrder.purchaseOrderDetails
        .map((poItem) => {
          const receivedQuantity = grns.reduce((total, grnItem) => {
            const grnDetail = grnItem.grnDetails.find(
              (detail) => detail.itemId === poItem.itemMaster?.itemMasterId
            );
            return total + (grnDetail ? grnDetail.acceptedQuantity : 0);
          }, 0);

          const remainingQuantity = poItem.quantity - receivedQuantity;

          const matchingGrnDetail = grn.grnDetails.find(
            (detail) => detail.itemId === poItem.itemMaster.itemMasterId
          );

          return {
            id: poItem.itemMaster.itemMasterId,
            name: poItem.itemMaster.itemName,
            unit: poItem.itemMaster.unit.unitName,
            quantity: Math.max(0, remainingQuantity),
            remainingQuantity: Math.max(0, remainingQuantity),
            receivedQuantity: matchingGrnDetail
              ? matchingGrnDetail.receivedQuantity
              : 0,
            rejectedQuantity: matchingGrnDetail
              ? matchingGrnDetail.rejectedQuantity
              : 0,
            freeQuantity: matchingGrnDetail
              ? matchingGrnDetail.freeQuantity
              : 0,
            orderedQuantity: poItem.quantity,
            expiryDate: matchingGrnDetail
              ? matchingGrnDetail.expiryDate.split("T")[0]
              : "",
            itemBarcode: poItem.itemBarcode,
            unitPrice: poItem.unitPrice,
            grnDetailId: matchingGrnDetail
              ? matchingGrnDetail.grnDetailId
              : null,
            grnMasterId: matchingGrnDetail
              ? matchingGrnDetail.grnMasterId
              : null,
          };
        })
        .filter((item) => item.grnMasterId === grn.grnMasterId);

      // FIXED: Only update if itemDetails actually changed
      setFormData((prevFormData) => {
        const itemDetailsChanged =
          JSON.stringify(prevFormData.itemDetails) !==
          JSON.stringify(updatedItemDetails);
        if (!itemDetailsChanged) return prevFormData;

        return {
          ...prevFormData,
          itemDetails: updatedItemDetails,
        };
      });
    } else if (!selectedPurchaseOrder && isInitialSetupComplete.current) {
      // Only set default item details if no purchase order is selected
      const formattedItemDetails = grn.grnDetails.map((detail) => ({
        id: detail.item.itemMasterId,
        name: detail.item.itemName,
        unit: detail.item.unit.unitName,
        quantity: detail.receivedQuantity,
        remainingQuantity: detail.remainingQuantity,
        receivedQuantity: detail.receivedQuantity,
        rejectedQuantity: detail.rejectedQuantity,
        freeQuantity: detail.freeQuantity,
        orderedQuantity: detail.orderedQuantity,
        expiryDate: detail.expiryDate.split("T")[0],
        itemBarcode: detail.itemBarcode,
        unitPrice: detail.unitPrice,
        grnDetailId: detail.grnDetailId,
      }));

      // FIXED: Only update if itemDetails actually changed
      setFormData((prevFormData) => {
        const itemDetailsChanged =
          JSON.stringify(prevFormData.itemDetails) !==
          JSON.stringify(formattedItemDetails);
        if (!itemDetailsChanged) return prevFormData;

        return {
          ...prevFormData,
          itemDetails: formattedItemDetails,
        };
      });
    }
  }, [
    selectedPurchaseOrder,
    grns,
    isGrnsFetched,
    grn.grnMasterId,
    grn.grnDetails,
    hasManualEdits,
  ]);

  /* Purchase requisition selected */
  // Added dependency check and skip condition
  useEffect(() => {
    // Skip if initial setup is not complete
    if (!isInitialSetupComplete.current) {
      return;
    }

    if (hasManualEdits) {
      return;
    }

    if (grns && selectedPurchaseRequisition) {
      const updatedItemDetails =
        selectedPurchaseRequisition.purchaseRequisitionDetails
          .map((prItem) => {
            const receivedQuantity = grns.reduce((total, grnItem) => {
              const grnDetail = grnItem.grnDetails.find(
                (detail) => detail.itemId === prItem.itemMaster?.itemMasterId
              );
              return total + (grnDetail ? grnDetail.receivedQuantity : 0);
            }, 0);

            const remainingQuantity = prItem.quantity - receivedQuantity;

            const matchingGrnDetail = grn.grnDetails.find(
              (detail) => detail.itemId === prItem.itemMaster.itemMasterId
            );

            return {
              id: prItem.itemMaster.itemMasterId,
              name: prItem.itemMaster.itemName,
              unit: prItem.itemMaster.unit.unitName,
              quantity: prItem.quantity,
              remainingQuantity:
                Math.max(0, remainingQuantity) +
                (matchingGrnDetail ? matchingGrnDetail.receivedQuantity : 0),
              receivedQuantity: matchingGrnDetail
                ? matchingGrnDetail.receivedQuantity
                : 0,
              rejectedQuantity: matchingGrnDetail
                ? matchingGrnDetail.rejectedQuantity
                : 0,
              freeQuantity: matchingGrnDetail
                ? matchingGrnDetail.freeQuantity
                : 0,
              itemBarcode: prItem.itemBarcode,
              unitPrice: prItem.unitPrice,
              grnDetailId: matchingGrnDetail
                ? matchingGrnDetail.grnDetailId
                : null,
              grnMasterId: matchingGrnDetail
                ? matchingGrnDetail.grnMasterId
                : null,
            };
          })
          .filter((item) => item.grnMasterId === grn.grnMasterId);

      // FIXED: Only update if itemDetails actually changed
      setFormData((prevFormData) => {
        const itemDetailsChanged =
          JSON.stringify(prevFormData.itemDetails) !==
          JSON.stringify(updatedItemDetails);
        if (!itemDetailsChanged) return prevFormData;

        return {
          ...prevFormData,
          itemDetails: updatedItemDetails,
        };
      });
    } else if (
      !selectedPurchaseRequisition &&
      !selectedPurchaseOrder &&
      isInitialSetupComplete.current
    ) {
      // Only set default if no PR or PO is selected
      const formattedItemDetails = grn.grnDetails.map((detail) => ({
        id: detail.item.itemMasterId,
        name: detail.item.itemName,
        unit: detail.item.unit.unitName,
        quantity: detail.receivedQuantity,
        remainingQuantity: detail.remainingQuantity,
        receivedQuantity: detail.receivedQuantity,
        rejectedQuantity: detail.rejectedQuantity,
        freeQuantity: detail.freeQuantity,
        orderedQuantity: detail.orderedQuantity,
        expiryDate: detail.expiryDate.split("T")[0],
        itemBarcode: detail.itemBarcode,
        unitPrice: detail.unitPrice,
        grnDetailId: detail.grnDetailId,
      }));

      // FIXED: Only update if itemDetails actually changed
      setFormData((prevFormData) => {
        const itemDetailsChanged =
          JSON.stringify(prevFormData.itemDetails) !==
          JSON.stringify(formattedItemDetails);
        if (!itemDetailsChanged) return prevFormData;

        return {
          ...prevFormData,
          itemDetails: formattedItemDetails,
        };
      });
    }
  }, [
    selectedPurchaseRequisition,
    grns,
    selectedPurchaseOrder,
    grn.grnMasterId,
    grn.grnDetails,
    hasManualEdits,
  ]);

  /* Supply Return selection */
  // Added dependency check and skip condition
  useEffect(() => {
    // Skip if initial setup is not complete
    if (!isInitialSetupComplete.current) {
      return;
    }

    if (hasManualEdits) {
      return;
    }

    if (grns && selectedSupplyReturn) {
      const formattedItemDetails = selectedSupplyReturn.supplyReturnDetails
        .map((srItem) => {
          const receivedQuantity = grns.reduce((total, grnItem) => {
            const grnDetail = grnItem.grnDetails.find(
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
            itemBarcode: "",
            unitPrice: srItem.itemMaster.unitPrice,
          };
        })
        .filter((item) => item.remainingQuantity > 0);

      // FIXED: Only update if itemDetails actually changed
      setFormData((prevFormData) => {
        const itemDetailsChanged =
          JSON.stringify(prevFormData.itemDetails) !==
          JSON.stringify(formattedItemDetails);
        if (!itemDetailsChanged) return prevFormData;

        return {
          ...prevFormData,
          itemDetails: formattedItemDetails,
        };
      });
    } else if (selectedSupplyReturn && !grns) {
      const formattedItemDetails = selectedSupplyReturn.supplyReturnDetails.map(
        (srItem) => ({
          id: srItem.itemMaster?.itemMasterId,
          name: srItem.itemMaster?.itemName,
          unit: srItem.itemMaster?.unit.unitName,
          quantity: srItem.returnedQuantity,
          remainingQuantity: srItem.returnedQuantity,
          receivedQuantity: srItem.returnedQuantity,
          rejectedQuantity: 0,
          freeQuantity: 0,
          itemBarcode: "",
          unitPrice: srItem.itemMaster.unitPrice,
        })
      );

      // FIXED: Only update if itemDetails actually changed
      setFormData((prevFormData) => {
        const itemDetailsChanged =
          JSON.stringify(prevFormData.itemDetails) !==
          JSON.stringify(formattedItemDetails);
        if (!itemDetailsChanged) return prevFormData;

        return {
          ...prevFormData,
          itemDetails: formattedItemDetails,
        };
      });
    }
  }, [selectedSupplyReturn, grns, hasManualEdits]);

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
            parseFloat(value) > 0 && parseFloat(value) <= item.quantity,
          errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to remaining quantity ${item.quantity}`,
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
        (isPurchaseRequisitionIdValid && isSupplierValid))
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
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const grnData = {
          purchaseOrderId: purchaseOrderId,
          purchaseRequisitionId: formData.purchaseRequisitionId,
          supplierId: formData.supplierId,
          supplyReturnMasterId: formData.supplyReturnMasterId,
          grnDate: formData.grnDate,
          receivedBy: formData.receivedBy,
          receivedDate: formData.receivedDate,
          status: combinedStatus,
          companyId: sessionStorage?.getItem("companyId") ?? null,
          receivedUserId: grn?.receivedUserId,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          createdDate: grn.createdDate,
          lastUpdatedDate: currentDate,
          grnType: formData.grnType,
          warehouseLocationId: formData.warehouseLocation,
          referenceNo: grn.referenceNo,
          permissionId: 22,
        };

        const response = await put_grn_master_api(grn.grnMasterId, grnData);
        console.log("GRN Update Response", response);

        // Extract itemDetails from formData
        const itemDetailsData = formData.itemDetails.map(async (item) => {
          let detailsApiResponse;
          const detailsData = {
            grnMasterId: grn.grnMasterId,
            receivedQuantity: item.receivedQuantity,
            acceptedQuantity: item.receivedQuantity - item.rejectedQuantity,
            rejectedQuantity: item.rejectedQuantity,
            unitPrice: item.unitPrice,
            itemId: item.id,
            freeQuantity: item.freeQuantity,
            orderedQuantity: item.orderedQuantity,
            expiryDate: item.expiryDate,
            itemBarcode: item.itemBarcode,
            permissionId: 22,
          };

          if (item.grnDetailId != null) {
            // Call put_grn_detail_api for each item
            detailsApiResponse = await put_grn_detail_api(
              item.grnDetailId,
              detailsData
            );
          }
          return detailsApiResponse;
        });

        const detailsResponses = await Promise.all(itemDetailsData);

        const allDetailsSuccessful = detailsResponses.every(
          (detailsResponse) => detailsResponse.status === 201 || 200
        );

        if (allDetailsSuccessful) {
          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("GRN updated ad saved as draft!", formData);
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

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // const handleItemDetailsChange = (index, field, value) => {
  //   setFormData((prevFormData) => {
  //     const updatedItemDetails = [...prevFormData.itemDetails];
  //     updatedItemDetails[index][field] = value;

  //     // Ensure positive values for Quantities
  //     updatedItemDetails[index].receivedQuantity = Math.max(
  //       0,
  //       updatedItemDetails[index].receivedQuantity
  //     );

  //     updatedItemDetails[index].rejectedQuantity = Math.max(
  //       0,
  //       updatedItemDetails[index].rejectedQuantity
  //     );

  //     updatedItemDetails[index].freeQuantity = Math.max(
  //       0,
  //       updatedItemDetails[index].freeQuantity
  //     );

  //     updatedItemDetails[index].unitPrice = !isNaN(
  //       parseFloat(updatedItemDetails[index].unitPrice)
  //     )
  //       ? Math.max(0, parseFloat(updatedItemDetails[index].unitPrice))
  //       : 0;

  //     return {
  //       ...prevFormData,
  //       itemDetails: updatedItemDetails,
  //     };
  //   });
  // };

  const handleItemDetailsChange = (index, field, value) => {
    // FIXED: Set flag to prevent useEffect from overwriting manual changes
    setHasManualEdits(true);

    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];

      if (
        field === "receivedQuantity" ||
        field === "rejectedQuantity" ||
        field === "freeQuantity" ||
        field === "unitPrice"
      ) {
        // Keep as string if user is typing, convert on blur
        updatedItemDetails[index][field] = value === "" ? "" : value;
      } else {
        updatedItemDetails[index][field] = value;
      }

      // Apply constraints only to ensure non-negative values
      if (field === "receivedQuantity") {
        updatedItemDetails[index].receivedQuantity =
          value === "" ? "" : Math.max(0, parseFloat(value) || 0);
      }

      if (field === "rejectedQuantity") {
        updatedItemDetails[index].rejectedQuantity =
          value === "" ? "" : Math.max(0, parseFloat(value) || 0);
      }

      if (field === "freeQuantity") {
        updatedItemDetails[index].freeQuantity =
          value === "" ? "" : Math.max(0, parseFloat(value) || 0);
      }

      if (field === "unitPrice") {
        updatedItemDetails[index].unitPrice =
          value === "" ? "" : Math.max(0, parseFloat(value) || 0);
      }

      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: selectedOption?.id,
    }));
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
          itemBarcode: "",
          unitPrice: 0.0,
        },
      ],
    }));
    setSearchTerm(""); // Clear the search term
  };

  const handleRemoveItem = (index, item) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (item?.grnDetailId !== null && item?.grnDetailId !== undefined) {
      setGrnDetailIdsToDelete((prevIds) => [...prevIds, item]);
    }

    setValidFields({});
    setValidationErrors({});
  };

  // Use ref to track if we've logged formData to prevent infinite console logs
  const hasLoggedFormData = useRef(false);
  const lastLoggedFormData = useRef(null);

  useEffect(() => {
    const formDataString = JSON.stringify(formData);
    // Only log if formData actually changed
    if (lastLoggedFormData.current !== formDataString) {
      console.log("formData", formData);
      lastLoggedFormData.current = formDataString;
    }
  }, [formData]);

  return {
    formData,
    validFields,
    validationErrors,
    selectedPurchaseOrder,
    selectedPurchaseRequisition,
    selectedSupplyReturn,
    selectedSupplier,
    purchaseOrders,
    purchaseRequisitions,
    statusOptions,
    submissionStatus,
    alertRef,
    isLoading,
    isError,
    suppliers,
    supplyReturns,
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
    setSearchByPO,
    setSearchByPR,
    handleInputChange,
    handlePurchaseRequisitionChange,
    handleItemDetailsChange,
    handlePrint,
    handleSubmit,
    handleStatusChange,
    setSelectedPurchaseOrder,
    setSelectedPurchaseRequisition,
    setSearchTerm,
    handleSelectItem,
    handleRemoveItem,
  };
};

export default useGrnUpdate;

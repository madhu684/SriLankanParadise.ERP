import { useState, useEffect, useRef } from "react";
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
    grnType: "goodsReceivedNote",
    warehouseLocation: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [selectedPurchaseRequisition, setSelectedPurchaseRequisition] =
    useState(null);
  const [selectedSupplyReturn, setSelectedSupplyReturn] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const statusOptions = [
    { id: "4", label: "In Progress" },
    { id: "5", label: "Completed" },
  ];
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const grnTypeOptions = [
    { id: "goodsReceivedNote", label: "Goods Received Note" },
    { id: "finishedGoodsIn", label: "Finished Goods In" },
    { id: "directPurchase", label: "Direct Purchase" },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [searchByPO, setSearchByPO] = useState(false);
  const [searchByPR, setSearchByPR] = useState(true);

  console.log("Grn: ", grn);

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

  useEffect(() => {
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
    });

    if (!isLoading && purchaseOrders) {
      //handlePurchaseOrderChange(deepCopyGrn?.purchaseOrder?.referenceNo);
      handlePurchaseOrderChange(deepCopyGrn?.purchaseOrderId);
    }
    if (!isLoading && purchaseRequisitions) {
      //handlePurchaseRequisitionChange(deepCopyGrn?.purchaseRequisition?.referenceNo)
      handlePurchaseRequisitionChange(deepCopyGrn?.purchaseRequisitionId);
    }

    if (!isLoading && suppliers) {
      handleSupplierChange(deepCopyGrn?.supplierId);
    }
  }, [grn, isLoading]);

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

          const matchingGrnDetail = grn.grnDetails.find(
            (detail) => detail.itemId === poItem.itemMaster.itemMasterId
          );

          console.log(matchingGrnDetail);

          return {
            id: poItem.itemMaster.itemMasterId,
            name: poItem.itemMaster.itemName,
            unit: poItem.itemMaster.unit.unitName,
            quantity: poItem.quantity,
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
            // expiryDate: matchingGrnDetail
            //   ? matchingGrnDetail.expiryDate?.split("T")[0]
            //   : "",
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

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else {
      const formattedItemDetails = grn.grnDetails.map((detail) => ({
        id: detail.item.itemMasterId,
        name: detail.item.itemName,
        unit: detail.item.unit.unitName,
        quantity: detail.receivedQuantity,
        remainingQuantity: detail.remainingQuantity,
        receivedQuantity: detail.receivedQuantity,
        rejectedQuantity: detail.rejectedQuantity,
        freeQuantity: detail.freeQuantity,
        //expiryDate: detail.expiryDate ? detail.expiryDate.split("T")[0] : "",
        itemBarcode: detail.itemBarcode,
        unitPrice: detail.unitPrice,
        grnDetailId: detail.grnDetailId,
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: formattedItemDetails,
      }));
    }
  }, [selectedPurchaseOrder, grns]);

  /* Purchase requisition selected */

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

            const matchingGrnDetail = grn.grnDetails.find(
              (detail) => detail.itemId === prItem.itemMaster.itemMasterId
            );

            console.log(matchingGrnDetail);

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
              // expiryDate: matchingGrnDetail
              //   ? matchingGrnDetail.expiryDate?.split('T')[0]
              //   : '',
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

      // Update form data with filtered items
      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: updatedItemDetails,
      }));
    } else {
      const formattedItemDetails = grn.grnDetails.map((detail) => ({
        id: detail.item.itemMasterId,
        name: detail.item.itemName,
        unit: detail.item.unit.unitName,
        quantity: detail.receivedQuantity,
        remainingQuantity: detail.remainingQuantity,
        receivedQuantity: detail.receivedQuantity,
        rejectedQuantity: detail.rejectedQuantity,
        freeQuantity: detail.freeQuantity,
        //expiryDate: detail.expiryDate ? detail.expiryDate.split('T')[0] : '',
        itemBarcode: detail.itemBarcode,
        unitPrice: detail.unitPrice,
        grnDetailId: detail.grnDetailId,
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: formattedItemDetails,
      }));
    }
  }, [selectedPurchaseRequisition, grns]);

  /* Supply Return selection */

  useEffect(() => {
    if (grns && selectedSupplyReturn) {
      const formattedItemDetails = selectedSupplyReturn.supplyReturnDetails
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
        itemDetails: formattedItemDetails,
      }));
    } else if (selectedSupplyReturn) {
      const formattedItemDetails = selectedSupplyReturn.supplyReturnDetails.map(
        (srItem) => ({
          id: srItem.itemMaster?.itemMasterId,
          name: srItem.itemMaster?.itemName,
          unit: srItem.itemMaster?.unit.unitName,
          quantity: srItem.returnedQuantity,
          remainingQuantity: srItem.returnedQuantity, // Set remaining quantity same as ordered quantity
          receivedQuantity: srItem.returnedQuantity,
          rejectedQuantity: 0,
          freeQuantity: 0,
          //expiryDate: '',
          itemBarcode: "",
          unitPrice: srItem.itemMaster.unitPrice,
          // Other item properties...
        })
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        itemDetails: formattedItemDetails,
      }));
    }
  }, [selectedSupplyReturn, grns]);

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

    // let isItemExpiryDateValid = true;

    // // Validate item details
    // formData.itemDetails.forEach((item, index) => {
    //   // Validation for expiry date
    //   const expiryDateFieldName = `expiryDate_${index}`;
    //   const expiryDateFieldDisplayName = `Expiry Date for ${item.name}`;

    //   const isValidExpiryDate = validateField(
    //     expiryDateFieldName,
    //     expiryDateFieldDisplayName,
    //     item.expiryDate
    //   );

    //   isItemExpiryDateValid = isItemExpiryDateValid && isValidExpiryDate;
    // });

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
      //isItemExpiryDateValid &&
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
            //expiryDate: item.expiryDate,
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

  const handlePrint = () => {
    window.print();
  };

  const handlePurchaseOrderChange = (purchaseOrderId) => {
    const selectedPurchaseOrder = purchaseOrders?.find(
      (purchaseOrder) => purchaseOrder.purchaseOrderId === purchaseOrderId
    );

    setSelectedPurchaseOrder(selectedPurchaseOrder);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseOrderId: selectedPurchaseOrder?.purchaseOrderId ?? "",
    }));
  };

  const handlePurchaseRequisitionChange = (purchaseRequisitionId) => {
    const selectedPurchaseRequisition = purchaseRequisitions?.find(
      (purchaseRequisition) =>
        purchaseRequisition.purchaseRequisitionId === purchaseRequisitionId
    );

    setSelectedPurchaseRequisition(selectedPurchaseRequisition);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseRequisitionId:
        selectedPurchaseRequisition?.purchaseRequisitionId ?? "",
    }));
  };

  const handleSupplierChange = (supplierId) => {
    const selectedSupplier = suppliers?.find(
      (supplier) => supplier.supplierId === supplierId
    );

    setSelectedSupplier(selectedSupplier);

    setFormData((prevFormData) => ({
      ...prevFormData,
      supplierId: selectedSupplier?.supplierId ?? "",
    }));
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
          //expiryDate: "",
          itemBarcode: "",
          unitPrice: 0.0,
        },
      ],
    }));
    setSearchTerm(""); // Clear the search term
  };

  console.log("formData", formData);

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
  };
};

export default useGrnUpdate;

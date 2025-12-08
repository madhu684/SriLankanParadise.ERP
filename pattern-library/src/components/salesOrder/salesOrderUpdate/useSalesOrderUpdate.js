import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  get_customers_by_company_id_api,
  put_sales_order_api,
  put_sales_order_detail_api,
  post_sales_order_detail_api,
  delete_sales_order_detail_api,
  get_company_api,
  get_sales_persons_by_user_id_api,
  get_sales_persons_api,
} from "../../../services/salesApi";
import {
  put_item_batch_api,
  get_charges_and_deductions_by_company_id_api,
  post_charges_and_deductions_applied_api,
  get_transaction_types_api,
  get_charges_and_deductions_applied_api,
  put_charges_and_deductions_applied_api,
  delete_charges_and_deductions_applied_api,
  get_sum_location_inventories_by_locationId_itemMasterId_api,
  get_user_locations_by_user_id_api,
} from "../../../services/purchaseApi";
import {
  get_item_masters_by_company_id_with_query_api,
  get_item_price_list_by_locationId,
} from "../../../services/inventoryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSalesOrderUpdate = ({ salesOrder, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerPoNumber: "",
    customerId: "",
    orderDate: "",
    deliveryDate: "",
    itemDetails: [],
    status: 0,
    attachments: [],
    totalAmount: 0,
    subTotal: 0,
    selectedCustomer: "",
    salesPersonId: null,
    selectedSalesPerson: null,
    storeLocation: null,
    commonChargesAndDeductions: [],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [itemIdsToBeDeleted, setItemIdsToBeDeleted] = useState([]);
  const alertRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [salesPersonSearchTerm, setSalesPersonSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [
    chargesAndDeductionsAppliedIdsToBeDeleted,
    setChargesAndDeductionsAppliedIdsToBeDeleted,
  ] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [hasLineItemChargesChanged, setHasLineItemChargesChanged] =
    useState(false);

  const [originalLineItemCharges, setOriginalLineItemCharges] = useState(
    new Map()
  );

  const queryClient = useQueryClient();

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  const companyId = useMemo(() => sessionStorage.getItem("companyId"), []);
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);

  // ============================================================================
  // DATA FETCHING - REACT QUERY
  // ============================================================================

  const {
    data: userLocations = [],
    isLoading: isUserLocationsLoading,
    isError: isUserLocationsError,
    error: userLocationsError,
  } = useQuery({
    queryKey: ["userLocations", userId],
    queryFn: async () => {
      const response = await get_user_locations_by_user_id_api(userId);
      const filteredLocations = response?.data?.result.filter(
        (loc) => loc?.location?.locationTypeId === 2
      );
      return filteredLocations || [];
    },
    enabled: !!userId,
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
    queryFn: () => fetchItems(companyId, searchTerm),
  });

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  const {
    data: customers,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    error: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", companyId],
    queryFn: async () => {
      const response = await get_customers_by_company_id_api(companyId);
      return response.data.result || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const fetchSalesPersons = async () => {
    try {
      const response = await get_sales_persons_api();
      return response.data.result || [];
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    }
  };

  const {
    data: salesPersons,
    isLoading: isSalesPersonsLoading,
    isError: isSalesPersonsError,
    error: salesPersonsError,
  } = useQuery({
    queryKey: ["salesPersons"],
    queryFn: fetchSalesPersons,
  });

  const fetchchargesAndDeductions = async () => {
    try {
      const response = await get_charges_and_deductions_by_company_id_api(
        companyId
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching chargesAndDeductions:", error);
    }
  };

  const {
    data: chargesAndDeductions,
    isLoading: isLoadingchargesAndDeductions,
    isError: ischargesAndDeductionsError,
    error: chargesAndDeductionsError,
    refetch: refetchChargesAndDeductions,
  } = useQuery({
    queryKey: ["chargesAndDeductions"],
    queryFn: fetchchargesAndDeductions,
  });

  const fetchTransactionTypes = async () => {
    try {
      const response = await get_transaction_types_api(companyId);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching transaction types:", error);
    }
  };

  const {
    data: transactionTypes,
    isLoading: isLoadingTransactionTypes,
    isError: isTransactionTypesError,
    error: transactionTypesError,
  } = useQuery({
    queryKey: ["transactionTypes"],
    queryFn: fetchTransactionTypes,
  });

  const fetchChargesAndDeductionsApplied = async () => {
    try {
      const response = await get_charges_and_deductions_applied_api(
        1,
        salesOrder.salesOrderId,
        companyId
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching charges and deductions applied:", error);
    }
  };

  const {
    data: chargesAndDeductionsApplied,
    isLoading: isChargesAndDeductionsAppliedLoading,
    isError: isChargesAndDeductionsAppliedError,
    error: chargesAndDeductionsAppliedError,
  } = useQuery({
    queryKey: ["chargesAndDeductionsApplied", salesOrder.salesOrderId],
    queryFn: fetchChargesAndDeductionsApplied,
  });

  const fetchCompany = async () => {
    try {
      const response = await get_company_api(
        sessionStorage?.getItem("companyId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const {
    data: company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    error: companyError,
  } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const {
    data: itemPriceListByLocation,
    isLoading: isItemPriceListByLocationLoading,
    isError: isItemPriceListByLocationError,
    error: itemPriceListByLocationError,
  } = useQuery({
    queryKey: ["itemPriceList", companyId],
    queryFn: async () => {
      const response = await get_item_price_list_by_locationId(
        formData.storeLocation
      );
      const priceListMaster = response?.data?.result;
      if (priceListMaster && priceListMaster.status === 1) {
        return {
          ...priceListMaster,
          itemPriceDetails: priceListMaster.itemPriceDetails || [],
        };
      }
      return null;
    },
    enabled: !!formData.storeLocation,
  });

  // ============================================================================
  // MEMOIZED CALCULATIONS
  // ============================================================================

  // const priceListMap = useMemo(() => {
  //   if (!itemPriceListByLocation?.itemPriceDetails) {
  //     return new Map();
  //   }

  //   return new Map(
  //     itemPriceListByLocation.itemPriceDetails.map((detail) => [
  //       detail.itemMasterId,
  //       detail.price,
  //     ])
  //   );
  // }, [itemPriceListByLocation]);
  const priceListMap = useMemo(() => {
    if (!itemPriceListByLocation?.itemPriceDetails) {
      return new Map();
    }
    return new Map(
      itemPriceListByLocation.itemPriceDetails.map((detail) => [
        detail.itemMasterId,
        {
          price: detail.price,
          vatAddedPrice: detail.vatAddedPrice,
        },
      ])
    );
  }, [itemPriceListByLocation]);

  // const getPriceFromPriceList = useCallback(
  //   (itemMasterId) => {
  //     return priceListMap.get(itemMasterId) || 0;
  //   },
  //   [priceListMap]
  // );
  // Replace the existing getPriceFromPriceList with this:
  const getPriceFromPriceList = useCallback(
    (itemMasterId) => {
      const priceData = priceListMap.get(itemMasterId);
      if (!priceData) return 0;

      // If customer is not VAT registered, use vatAddedPrice, otherwise use regular price
      if (
        formData.selectedCustomer &&
        !formData.selectedCustomer.isVATRegistered
      ) {
        return priceData.vatAddedPrice || priceData.price || 0;
      }

      return priceData.price || 0;
    },
    [priceListMap, formData.selectedCustomer]
  );

  // Memoized charges initialization
  const getInitializedCharges = useMemo(() => {
    return (
      chargesAndDeductions
        ?.filter((charge) => charge.isApplicableForLineItem)
        ?.map((charge) => ({
          id: charge.chargesAndDeductionId,
          name: charge.displayName,
          value: charge.amount || charge.percentage,
          sign: charge.sign,
          isPercentage: charge.percentage !== null,
        })) || []
    );
  }, [chargesAndDeductions]);

  // Memoized subtotal calculation
  const subTotal = useMemo(() => {
    return formData.itemDetails.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
  }, [formData.itemDetails]);

  // Memoized total amount calculation
  const totalAmount = useMemo(() => {
    let total = subTotal;
    formData.commonChargesAndDeductions.forEach((charge) => {
      const amount = charge.isPercentage
        ? (subTotal * charge.value) / 100
        : charge.value;
      total += charge.sign === "+" ? amount : -amount;
    });
    return total;
  }, [subTotal, formData.commonChargesAndDeductions]);

  const compareCharges = useCallback((original, current) => {
    if (!original || !current) return false;
    if (original.length !== current.length) return true;

    return original.some((origCharge, index) => {
      const currCharge = current[index];
      return parseFloat(origCharge.value) !== parseFloat(currCharge.value);
    });
  }, []);

  useEffect(() => {
    if (
      !isChargesAndDeductionsAppliedLoading &&
      chargesAndDeductionsApplied &&
      !isLoadingchargesAndDeductions &&
      chargesAndDeductions &&
      !isCompanyLoading &&
      company
    ) {
      const fetchData = async () => {
        const deepCopySalesOrder = JSON.parse(JSON.stringify(salesOrder));
        let salesOrderDetails = salesOrder.salesOrderDetails;

        // Fetch inventory data for all items in parallel
        const inventoryPromises = salesOrderDetails.map((item) =>
          get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemBatchItemMasterId,
            salesOrder.inventoryLocationId
          )
        );
        const inventoryResults = await Promise.all(inventoryPromises);

        // Initialize line item charges and deductions
        const initializedLineItemCharges = salesOrderDetails.map(
          (item, index) => {
            const inventory = inventoryResults[index];
            const availableStock =
              inventory?.data?.result?.totalStockInHand || 0;

            const initializedCharges = chargesAndDeductionsApplied
              ?.filter(
                (charge) => charge.lineItemId === item.itemMaster.itemMasterId
              )
              .map((charge) => {
                let value;
                if (charge?.chargesAndDeduction?.displayName === "SSL") {
                  value =
                    (charge.appliedValue /
                      (item.unitPrice * item.quantity + charge.appliedValue)) *
                    100;
                } else if (charge.chargesAndDeduction.percentage !== null) {
                  value =
                    (Math.abs(charge.appliedValue) /
                      (item.unitPrice * item.quantity)) *
                    100;
                } else {
                  value = Math.abs(charge.appliedValue);
                }
                return {
                  id: charge.chargesAndDeduction.chargesAndDeductionId,
                  name: charge.chargesAndDeduction.displayName,
                  value: value.toFixed(2),
                  sign: charge.chargesAndDeduction.sign,
                  isPercentage: charge.chargesAndDeduction.percentage !== null,
                  chargesAndDeductionAppliedId:
                    charge.chargesAndDeductionAppliedId,
                };
              });

            const sortedLineItemCharges = chargesAndDeductions
              .filter((charge) => charge.isApplicableForLineItem === true)
              .map((charge) => {
                const displayName = charge.displayName;
                const matchedCharge = initializedCharges.find(
                  (c) => c.name === displayName
                );
                return matchedCharge || null;
              });

            return {
              salesOrderDetailId: item.salesOrderDetailId,
              itemMasterId: item.itemBatchItemMasterId,
              name: item.itemMaster.itemName,
              unit: item.itemMaster.unit.unitName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              batchId: item.itemBatchBatchId,
              tempQuantity: availableStock,
              packSize: item.itemMaster.conversionRate || 1,
              isInventoryItem: item.itemMaster.isInventoryItem,
              chargesAndDeductions: sortedLineItemCharges,
            };
          }
        );

        const subTotal = deepCopySalesOrder.salesOrderDetails.reduce(
          (total, item) => total + item.totalPrice,
          0
        );

        // Initialize common charges and deductions
        // const initializedCommonCharges = chargesAndDeductionsApplied
        //   ?.filter((charge) => !charge.lineItemId)
        //   .map((charge) => {
        //     let value;
        //     if (charge.chargesAndDeduction.percentage !== null) {
        //       value = (Math.abs(charge.appliedValue) / subTotal) * 100;
        //     } else {
        //       value = Math.abs(charge.appliedValue);
        //     }
        //     return {
        //       id: charge.chargesAndDeduction.chargesAndDeductionId,
        //       name: charge.chargesAndDeduction.displayName,
        //       value: value.toFixed(2),
        //       sign: charge.chargesAndDeduction.sign,
        //       isPercentage: charge.chargesAndDeduction.percentage !== null,
        //       chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
        //     };
        //   });
        const initializedCommonCharges = chargesAndDeductionsApplied
          ?.filter((charge) => {
            if (charge.lineItemId) return false;
            if (charge.chargesAndDeduction.displayName === "VAT") {
              return deepCopySalesOrder?.customer?.isVATRegistered === true;
            }

            return true;
          })
          .map((charge) => {
            let value;
            if (charge.chargesAndDeduction.percentage !== null) {
              value = (Math.abs(charge.appliedValue) / subTotal) * 100;
            } else {
              value = Math.abs(charge.appliedValue);
            }
            return {
              id: charge.chargesAndDeduction.chargesAndDeductionId,
              name: charge.chargesAndDeduction.displayName,
              value: value.toFixed(2),
              sign: charge.chargesAndDeduction.sign,
              isPercentage: charge.chargesAndDeduction.percentage !== null,
              chargesAndDeductionAppliedId: charge.chargesAndDeductionAppliedId,
            };
          });

        const originalChargesMap = new Map();

        initializedLineItemCharges.forEach((item) => {
          originalChargesMap.set(
            item.itemMasterId,
            JSON.parse(JSON.stringify(item.chargesAndDeductions))
          );
        });

        setOriginalLineItemCharges(originalChargesMap);

        setFormData({
          salesOrderId: deepCopySalesOrder?.salesOrderId ?? "",
          customerPoNumber: deepCopySalesOrder?.customerPoNumber ?? "",
          customerId: deepCopySalesOrder?.customerId ?? "",
          salesPersonId: deepCopySalesOrder?.salesPersonId ?? null,
          orderDate: deepCopySalesOrder?.orderDate?.split("T")[0] ?? "",
          deliveryDate: deepCopySalesOrder?.deliveryDate?.split("T")[0] ?? "",
          itemDetails: initializedLineItemCharges,
          attachments: deepCopySalesOrder?.attachments ?? [],
          totalAmount: deepCopySalesOrder?.totalAmount ?? "",
          selectedCustomer: deepCopySalesOrder?.customer ?? "",
          selectedSalesPerson: deepCopySalesOrder?.salesPerson ?? null,
          subTotal: deepCopySalesOrder?.totalAmount ?? "",
          storeLocation: deepCopySalesOrder?.inventoryLocationId ?? null,
          commonChargesAndDeductions: initializedCommonCharges,
          isLineChargesChanged:
            deepCopySalesOrder?.isLineChargesChanged ?? false,
        });
      };

      fetchData();
    }
  }, [
    salesOrder,
    isChargesAndDeductionsAppliedLoading,
    chargesAndDeductionsApplied,
    isLoadingchargesAndDeductions,
    chargesAndDeductions,
    isCompanyLoading,
    company,
  ]);

  const updateChargesAndDeductionsApplied = async (transactionId) => {
    try {
      const transactionTypeId = getTransactionTypeIdByName("SaleOrder");

      const chargesAndDeductionsAppliedData = await Promise.all(
        formData.itemDetails.map(async (item) => {
          const appliedCharges = await Promise.all(
            item.chargesAndDeductions.map(async (charge) => {
              let appliedValue = 0;

              if (charge.name === "SSL") {
                // Calculate the amount based on percentage and sign
                const amount =
                  item.isInventoryItem === true
                    ? ((item.quantity * item.unitPrice) /
                        (100 - charge.value)) *
                      charge.value
                    : (item.unitPrice / (100 - charge.value)) * charge.value;
                appliedValue = charge.sign === "+" ? amount : -amount;
              } else if (charge.isPercentage) {
                // Calculate the amount based on percentage and sign
                const amount =
                  item.isInventoryItem === true
                    ? (item.quantity * item.unitPrice * charge.value) / 100
                    : (item.unitPrice * charge.value) / 100;
                appliedValue = charge.sign === "+" ? amount : -amount;
              } else {
                // Use the value directly based on the sign
                appliedValue =
                  charge.sign === "+" ? charge.value : -charge.value;
              }

              const chargesAndDeductionAppliedData = {
                chargesAndDeductionId: charge.id,
                transactionId: transactionId,
                transactionTypeId,
                lineItemId: item.itemMasterId,
                appliedValue,
                dateApplied: new Date().toISOString(),
                createdBy: userId,
                createdDate: new Date().toISOString(),
                modifiedBy: userId,
                modifiedDate: new Date().toISOString(),
                status: true,
                companyId: companyId,
                permissionId: 1057,
              };

              if (charge.chargesAndDeductionAppliedId) {
                return await put_charges_and_deductions_applied_api(
                  charge.chargesAndDeductionAppliedId,
                  chargesAndDeductionAppliedData
                );
              } else {
                return await post_charges_and_deductions_applied_api(
                  chargesAndDeductionAppliedData
                );
              }
            })
          );
          return appliedCharges;
        })
      );

      const commonChargesAndDeductions = await Promise.all(
        formData.commonChargesAndDeductions
          .filter((charge) => {
            if (
              charge.name === "VAT" &&
              formData.selectedCustomer &&
              !formData.selectedCustomer.isVATRegistered
            ) {
              return false;
            }
            return true;
          })
          .map(async (charge) => {
            let appliedValue = 0;
            if (charge.isPercentage) {
              // If the charge is a percentage, calculate based on percentage of total amount
              appliedValue = (formData.subTotal * charge.value) / 100;
            } else {
              // If the charge is not a percentage, use the fixed value
              appliedValue = charge.value;
            }

            // Apply the sign (+ or -)
            appliedValue *= charge.sign === "+" ? 1 : -1;

            const chargesAndDeductionAppliedData = {
              chargesAndDeductionId: charge.id,
              transactionId: transactionId,
              transactionTypeId,
              lineItemId: null,
              appliedValue,
              dateApplied: new Date().toISOString(),
              createdBy: sessionStorage?.getItem("userId"),
              createdDate: new Date().toISOString(),
              modifiedBy: sessionStorage?.getItem("userId"),
              modifiedDate: new Date().toISOString(),
              status: true,
              companyId: sessionStorage?.getItem("companyId"),
              permissionId: 1057,
            };

            return await put_charges_and_deductions_applied_api(
              charge.chargesAndDeductionAppliedId,
              chargesAndDeductionAppliedData
            );
          })
      );

      // Concatenate chargesAndDeductionsAppliedData and commonChargesAndDeductions
      const allAppliedData = [
        ...(Array.isArray(chargesAndDeductionsAppliedData)
          ? chargesAndDeductionsAppliedData.flat()
          : [chargesAndDeductionsAppliedData]),
        ...(Array.isArray(commonChargesAndDeductions)
          ? commonChargesAndDeductions.flat()
          : [commonChargesAndDeductions]),
      ];

      return allAppliedData;
    } catch (error) {
      console.error("Error while posting data:", error);
      throw error;
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subTotal,
      totalAmount,
    }));
  }, [subTotal, totalAmount]);

  // NEW: Effect to detect if line item charges have changed
  useEffect(() => {
    if (originalLineItemCharges.size === 0) {
      setHasLineItemChargesChanged(false);
      return;
    }

    let hasChanged = false;

    for (const item of formData.itemDetails) {
      const originalCharges = originalLineItemCharges.get(item.itemMasterId);
      if (!originalCharges) continue;

      if (compareCharges(originalCharges, item.chargesAndDeductions)) {
        hasChanged = true;
        break;
      }
    }

    setHasLineItemChargesChanged(hasChanged);
  }, [formData.itemDetails, originalLineItemCharges, compareCharges]);

  // Add this new useEffect after the existing useEffects:
  useEffect(() => {
    // Update item prices when customer VAT status changes
    if (formData.itemDetails.length > 0 && formData.selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        itemDetails: prev.itemDetails.map((item) => {
          const priceData = priceListMap.get(item.itemMasterId);
          if (!priceData) return item;

          // Determine unit price based on customer VAT status
          const newUnitPrice = !formData.selectedCustomer.isVATRegistered
            ? priceData.vatAddedPrice || priceData.price || 0
            : priceData.price || 0;

          // Recalculate total price with new unit price
          const grandTotalPrice = item.quantity * newUnitPrice;
          let totalPrice = grandTotalPrice;

          item.chargesAndDeductions.forEach((charge) => {
            if (charge.name === "SSL") {
              const amount =
                (grandTotalPrice / (100 - charge.value)) * charge.value;
              totalPrice += charge.sign === "+" ? amount : -amount;
            } else if (charge.isPercentage) {
              const amount = (grandTotalPrice * charge.value) / 100;
              totalPrice += charge.sign === "+" ? amount : -amount;
            } else {
              totalPrice += charge.sign === "+" ? charge.value : -charge.value;
            }
          });

          return {
            ...item,
            unitPrice: newUnitPrice,
            totalPrice: Math.max(0, totalPrice),
          };
        }),
      }));
    }
  }, [formData.selectedCustomer?.isVATRegistered, priceListMap]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

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

  const validateAttachments = (files) => {
    let isAttachmentsValid = true;
    let errorMessage = "";
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!files || files.length === 0) {
      isAttachmentsValid = true; // Attachments are optional, so it's considered valid if there are none.
      errorMessage = "";
    }

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        isAttachmentsValid = false;
        errorMessage = "Attachment size exceeds the limit (10MB)";
      }

      if (!allowedTypes.includes(file.type)) {
        isAttachmentsValid = false;
        errorMessage =
          "Invalid file type. Allowed types: JPEG, PNG, PDF, Word documents";
      }
    }

    setValidFields((prev) => ({ ...prev, attachments: isAttachmentsValid }));
    setValidationErrors((prev) => ({ ...prev, attachments: errorMessage }));

    return isAttachmentsValid;
  };

  const validateForm = () => {
    let isCustomerValid = true;

    isCustomerValid = validateField(
      "customerId",
      "Customer",
      formData.customerId
    );

    const isSalesPersonValid = validateField(
      "salesPersonId",
      "Sales Person",
      formData.salesPersonId
    );

    const isOrderDateValid = validateField(
      "orderDate",
      "Order date",
      formData.orderDate
    );

    const isDeliveryDateValid = validateField(
      "deliveryDate",
      "Delivery date",
      formData.deliveryDate
    );

    const isCustomerPoNovalid = validateField(
      "customerPoNumber",
      "Customer PO Number",
      formData.customerPoNumber
    );

    const isStoreLocationValid = validateField(
      "storeLocation",
      "Store Location",
      formData.storeLocation
    );

    const isAttachmentsValid = validateAttachments(formData.attachments);

    let isItemQuantityValid = true;
    // Validate item details
    formData.itemDetails.forEach((item, index) => {
      const fieldName = `quantity_${index}`;
      const fieldDisplayName = `Quantity for ${item.name}`;

      const additionalRules = {
        validationFunction: (value) =>
          parseFloat(value) > 0 && parseFloat(value) <= item.tempQuantity,
        errorMessage: `${fieldDisplayName} must be greater than 0 and less than or equal to temporary quantity ${item.tempQuantity}`,
      };

      const isValidQuantity = validateField(
        fieldName,
        fieldDisplayName,
        item.quantity,
        additionalRules
      );

      isItemQuantityValid = isItemQuantityValid && isValidQuantity;
    });

    return (
      isCustomerValid &&
      isSalesPersonValid &&
      isOrderDateValid &&
      isDeliveryDateValid &&
      isCustomerPoNovalid &&
      isAttachmentsValid &&
      isItemQuantityValid
    );
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getTransactionTypeIdByName = useCallback(
    (name) => {
      const transactionType = transactionTypes.find(
        (type) => type.name === name
      );
      return transactionType ? transactionType.transactionTypeId : null;
    },
    [transactionTypes]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      customerPoNumber: "",
      customerId: "",
      orderDate: "",
      deliveryDate: "",
      itemDetails: [],
      status: 0,
      attachments: [],
      totalAmount: 0,
      subTotal: 0,
      selectedCustomer: "",
      salesPersonId: null,
      selectedSalesPerson: null,
      storeLocation: null,
      commonChargesAndDeductions: [],
    }));
  };

  const handleSubmit = async (isSaveAsDraft) => {
    try {
      const customerId = formData.customerId;
      const status = isSaveAsDraft ? 0 : 1;
      const currentDate = new Date().toISOString();
      let putSalesOrderSuccessful;

      const isFormValid = validateForm(isSaveAsDraft);
      if (isFormValid) {
        if (isSaveAsDraft) {
          setLoadingDraft(true);
        } else {
          setLoading(true);
        }

        const salesOrderData = {
          customerId: customerId,
          orderDate: formData.orderDate,
          deliveryDate: formData.deliveryDate,
          totalAmount: formData.totalAmount,
          status: status,
          createdBy: salesOrder.createdBy ?? null,
          createdUserId: salesOrder.createdUserId ?? null,
          approvedBy: null,
          approvedUserId: null,
          approvedDate: null,
          companyId: salesOrder.companyId ?? null,
          createdDate: salesOrder.createdDate,
          lastUpdatedDate: currentDate,
          permissionId: 27,
          salesPersonId: formData.salesPersonId,
          inventoryLocationId: formData.storeLocation,
          customerPoNumber: formData.customerPoNumber,
          customerCreditLimitAtOrder: formData?.selectedCustomer?.creditLimit,
          customerCreditDurationAtOrder:
            formData?.selectedCustomer?.creditDuration,
          isLineChargesChanged: hasLineItemChargesChanged
            ? true
            : formData.isLineChargesChanged,
        };

        const response = await put_sales_order_api(
          salesOrder.salesOrderId,
          salesOrderData
        );

        putSalesOrderSuccessful =
          response.status === 201 || response.status === 200;

        // Update or create sales order details
        for (const itemDetail of formData.itemDetails) {
          if (itemDetail.salesOrderDetailId === null) {
            const itemDetailData = {
              itemBatchItemMasterId: itemDetail.itemMasterId,
              itemBatchBatchId: itemDetail.batchId,
              salesOrderId: salesOrder.salesOrderId,
              quantity: itemDetail.quantity,
              unitPrice: itemDetail.unitPrice,
              totalPrice: itemDetail.totalPrice,
              permissionId: 32,
            };
            await post_sales_order_detail_api(itemDetailData);
          } else {
            const itemDetailData = {
              itemBatchItemMasterId: itemDetail.itemMasterId,
              itemBatchBatchId: itemDetail.batchId,
              salesOrderId: salesOrder.salesOrderId,
              quantity: itemDetail.quantity,
              unitPrice: itemDetail.unitPrice,
              totalPrice: itemDetail.totalPrice,
              permissionId: 32,
            };
            await put_sales_order_detail_api(
              itemDetail.salesOrderDetailId,
              itemDetailData
            );
          }
        }

        // Charges
        const updateChargesAndDeductionsAppliedResponse =
          await updateChargesAndDeductionsApplied(salesOrder.salesOrderId);

        const allAppliedSuccessful =
          updateChargesAndDeductionsAppliedResponse.every(
            (detailsResponse) => detailsResponse.status === 201 || 200
          );

        for (const chargesAndDeductionsAppliedIdToBeDeleted of chargesAndDeductionsAppliedIdsToBeDeleted) {
          const response = await delete_charges_and_deductions_applied_api(
            chargesAndDeductionsAppliedIdToBeDeleted
          );
          console.log(
            `Successfully deleted item with ID: ${chargesAndDeductionsAppliedIdToBeDeleted}`
          );
        }
        // Clear the itmeIdsToBeDeleted array after deletion
        setChargesAndDeductionsAppliedIdsToBeDeleted([]);

        if (itemIdsToBeDeleted.length > 0) {
          for (const itemIdToBeDeleted of itemIdsToBeDeleted) {
            await delete_sales_order_detail_api(
              itemIdToBeDeleted?.salesOrderDetailId
            );
            console.log(
              `Successfully deleted item with ID: ${itemIdToBeDeleted?.salesOrderDetailId}`
            );
          }
          setItemIdsToBeDeleted([]);
        }

        if (putSalesOrderSuccessful && allAppliedSuccessful) {
          const updatedSalesOrder = {
            ...salesOrder,
            salesPersonId: formData.salesPersonId,
            salesPerson: formData.selectedSalesPerson,
            customerPoNumber: formData.customerPoNumber,
            orderDate: formData.orderDate,
            deliveryDate: formData.deliveryDate,
            totalAmount: formData.totalAmount,
            customerId: formData.customerId,
            customer: formData.selectedCustomer,
            inventoryLocationId: formData.storeLocation,
            isLineChargesChanged: hasLineItemChargesChanged
              ? true
              : formData.isLineChargesChanged,
          };

          // Update the salesOrder reference
          Object.assign(salesOrder, updatedSalesOrder);

          if (isSaveAsDraft) {
            setSubmissionStatus("successSavedAsDraft");
            console.log("Sales order updated and saved as draft!", formData);
          } else {
            setSubmissionStatus("successSubmitted");
            console.log("Sales order submitted successfully!", formData);
          }

          queryClient.invalidateQueries(["salesOrders", companyId]);

          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            setLoadingDraft(false);
            clearForm();
            onFormSubmit();
          }, 3000);

          toast.success(
            `Sales Order Updated successfully ${
              hasLineItemChargesChanged ? "with modified line item charges" : ""
            }`
          );
        } else {
          setSubmissionStatus("error");
          toast.error("Error updating sales order!");
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
      toast.error("Error updating sales order!");
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      if (field.startsWith("commonChargesAndDeductions")) {
        const chargeIndex = parseInt(field.split("_")[1]);
        const updatedCharges = [...prev.commonChargesAndDeductions];
        updatedCharges[chargeIndex].value = value;
        return { ...prev, commonChargesAndDeductions: updatedCharges };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleCustomerChange = useCallback(
    (customerId) => {
      const selectedCustomer = customers?.find(
        (customer) => customer.customerId === parseInt(customerId, 10)
      );
      setFormData((prev) => ({ ...prev, customerId, selectedCustomer }));
    },
    [customers]
  );

  const handleItemDetailsChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedItemDetails = prev.itemDetails.map((item, idx) => {
        if (idx !== index) return item;

        const updatedItem = {
          ...item,
          chargesAndDeductions: item.chargesAndDeductions.map((charge) => ({
            ...charge,
          })),
        };

        if (field.startsWith("chargesAndDeductions")) {
          const chargeIndex = parseInt(field.split("_")[1]);
          updatedItem.chargesAndDeductions[chargeIndex].value = value;
        } else {
          updatedItem[field] = value;
        }

        updatedItem.quantity = Math.max(0, updatedItem.quantity);
        updatedItem.unitPrice = Math.max(
          0,
          parseFloat(updatedItem.unitPrice) || 0
        );

        // Calculate total price
        const grandTotalPrice = updatedItem.quantity * updatedItem.unitPrice;
        let totalPrice = grandTotalPrice;

        updatedItem.chargesAndDeductions.forEach((charge) => {
          if (charge.name === "SSL") {
            const amount =
              (grandTotalPrice / (100 - charge.value)) * charge.value;
            totalPrice += charge.sign === "+" ? amount : -amount;
          } else if (charge.isPercentage) {
            const amount = (grandTotalPrice * charge.value) / 100;
            totalPrice += charge.sign === "+" ? amount : -amount;
          } else {
            totalPrice += charge.sign === "+" ? charge.value : -charge.value;
          }
        });

        updatedItem.totalPrice = Math.max(0, totalPrice);
        return updatedItem;
      });

      return { ...prev, itemDetails: updatedItemDetails };
    });
  }, []);

  const handleAddItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      itemDetails: [
        ...prev.itemDetails,
        {
          itemMasterId: "",
          itemBatchId: "",
          name: "",
          quantity: 0,
          unitPrice: 0.0,
          totalPrice: 0.0,
        },
      ],
    }));
  }, []);

  const handleRemoveItem = useCallback((index, item) => {
    setFormData((prevFormData) => {
      const updatedItemDetails = [...prevFormData.itemDetails];
      updatedItemDetails.splice(index, 1);
      return {
        ...prevFormData,
        itemDetails: updatedItemDetails,
      };
    });

    if (
      item.salesOrderDetailId !== null &&
      item.salesOrderDetailId !== undefined
    ) {
      setItemIdsToBeDeleted((prevIds) => [...prevIds, item]);
    }

    item?.chargesAndDeductions.map((charge) => {
      if (
        charge.chargesAndDeductionAppliedId !== null &&
        charge.chargesAndDeductionAppliedId !== undefined
      ) {
        setChargesAndDeductionsAppliedIdsToBeDeleted((prevIds) => [
          ...prevIds,
          charge.chargesAndDeductionAppliedId,
        ]);
      }
    });
    setValidFields({});
    setValidationErrors({});
    setFormData((prevFormData) => ({
      ...prevFormData,
      itemMasterId: 0,
      itemMaster: "",
    }));
  }, []);

  const handleAttachmentChange = useCallback((files) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: files,
    }));
  }, []);

  // const handleSelectCustomer = useCallback((selectedCustomer) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     customerId: selectedCustomer.customerId,
  //     selectedCustomer,
  //     selectedSalesPerson:
  //       selectedCustomer.salesPerson !== null
  //         ? selectedCustomer.salesPerson
  //         : null,
  //     salesPersonId:
  //       selectedCustomer.salesPerson !== null
  //         ? selectedCustomer.salesPerson.salesPersonId
  //         : null,
  //   }));
  //   setCustomerSearchTerm("");
  //   setValidFields({});
  //   setValidationErrors({});
  // }, []);
  const handleSelectCustomer = useCallback(
    (selectedCustomer) => {
      setFormData((prev) => {
        // Get the VAT charge from master data
        const vatCharge = chargesAndDeductions?.find(
          (charge) =>
            charge.displayName === "VAT" &&
            charge.isDisableFromSubTotal === false
        );

        let updatedCommonCharges = [...prev.commonChargesAndDeductions];

        if (vatCharge) {
          const hasVATInCommon = updatedCommonCharges.some(
            (charge) => charge.name === "VAT"
          );

          // If customer IS VAT registered and VAT is NOT in common charges, add it
          if (selectedCustomer.isVATRegistered && !hasVATInCommon) {
            updatedCommonCharges.push({
              id: vatCharge.chargesAndDeductionId,
              name: vatCharge.displayName,
              value: vatCharge.amount || vatCharge.percentage,
              sign: vatCharge.sign,
              isPercentage: vatCharge.percentage !== null,
              chargesAndDeductionAppliedId: null,
            });
          }

          // If customer is NOT VAT registered and VAT IS in common charges, remove it
          if (!selectedCustomer.isVATRegistered && hasVATInCommon) {
            const removedVATCharge = updatedCommonCharges.find(
              (charge) => charge.name === "VAT"
            );

            // If the VAT charge has an applied ID, mark it for deletion
            if (removedVATCharge?.chargesAndDeductionAppliedId) {
              setChargesAndDeductionsAppliedIdsToBeDeleted((prev) => [
                ...prev,
                removedVATCharge.chargesAndDeductionAppliedId,
              ]);
            }

            updatedCommonCharges = updatedCommonCharges.filter(
              (charge) => charge.name !== "VAT"
            );
          }
        }

        return {
          ...prev,
          customerId: selectedCustomer.customerId,
          selectedCustomer,
          selectedSalesPerson:
            selectedCustomer.salesPerson !== null
              ? selectedCustomer.salesPerson
              : null,
          salesPersonId:
            selectedCustomer.salesPerson !== null
              ? selectedCustomer.salesPerson.salesPersonId
              : null,
          commonChargesAndDeductions: updatedCommonCharges,
        };
      });

      setCustomerSearchTerm("");
      setValidFields({});
      setValidationErrors({});
    },
    [chargesAndDeductions]
  );

  const handleAddCustomer = useCallback(
    (responseData) => {
      handleSelectCustomer(responseData);
      refetchCustomers();
    },
    [handleSelectCustomer, refetchCustomers]
  );

  // const handleResetCustomer = useCallback(() => {
  //   setFormData((prev) => ({ ...prev, selectedCustomer: "", customerId: "" }));
  // }, []);
  const handleResetCustomer = useCallback(() => {
    setFormData((prev) => {
      // When resetting customer, remove VAT if it exists
      const hasVATInCommon = prev.commonChargesAndDeductions.some(
        (charge) => charge.name === "VAT"
      );

      let updatedCommonCharges = [...prev.commonChargesAndDeductions];

      if (hasVATInCommon) {
        const removedVATCharge = updatedCommonCharges.find(
          (charge) => charge.name === "VAT"
        );

        // If the VAT charge has an applied ID, mark it for deletion
        if (removedVATCharge?.chargesAndDeductionAppliedId) {
          setChargesAndDeductionsAppliedIdsToBeDeleted((prevIds) => [
            ...prevIds,
            removedVATCharge.chargesAndDeductionAppliedId,
          ]);
        }

        updatedCommonCharges = updatedCommonCharges.filter(
          (charge) => charge.name !== "VAT"
        );
      }

      return {
        ...prev,
        selectedCustomer: "",
        customerId: "",
        commonChargesAndDeductions: updatedCommonCharges,
      };
    });
  }, []);

  const handleResetSalesPerson = useCallback(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSalesPerson: null,
      salesPersonId: null,
    }));
  }, []);

  const handleSelectSalesPerson = useCallback((selectedSalesPerson) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      salesPersonId: selectedSalesPerson.salesPersonId,
      selectedSalesPerson: selectedSalesPerson,
    }));

    setSalesPersonSearchTerm("");
    setValidFields({});
    setValidationErrors({});
  }, []);

  // Handler to add the selected item to itemDetails
  // const handleSelectItem = useCallback(
  //   async (item) => {
  //     let availableStock = 0;
  //     let unitPrice = item.unitPrice || 0;

  //     try {
  //       const inventory =
  //         await get_sum_location_inventories_by_locationId_itemMasterId_api(
  //           item.itemMasterId,
  //           formData.storeLocation
  //         );
  //       availableStock = inventory?.data?.result?.totalStockInHand || 0;

  //       if (availableStock <= 0) {
  //         toast.error(
  //           `No stock available for "${item.itemName}" in user location`
  //         );
  //         setSearchTerm("");
  //         return;
  //       }

  //       unitPrice = getPriceFromPriceList(item.itemMasterId);

  //       const initialCharges = getInitializedCharges;

  //       // NEW: Store original charges for this new item
  //       setOriginalLineItemCharges((prev) => {
  //         const newMap = new Map(prev);
  //         newMap.set(
  //           item.itemMasterId,
  //           JSON.parse(JSON.stringify(initialCharges))
  //         );
  //         return newMap;
  //       });

  //       setFormData((prev) => ({
  //         ...prev,
  //         itemDetails: [
  //           ...prev.itemDetails,
  //           {
  //             salesOrderDetailId: null,
  //             itemMasterId: item.itemMasterId,
  //             name: item.itemName || "",
  //             unit: item.unit?.unitName || "",
  //             quantity: 0,
  //             unitPrice: unitPrice,
  //             totalPrice: 0,
  //             batchId: null,
  //             tempQuantity: availableStock,
  //             packSize: item?.conversionRate || 1,
  //             isInventoryItem: item?.isInventoryItem,
  //             chargesAndDeductions: getInitializedCharges,
  //           },
  //         ],
  //       }));

  //       setSearchTerm("");
  //     } catch (error) {
  //       console.error("Error processing item:", error);
  //       toast.error("Failed to add item");
  //       setSearchTerm("");
  //     }
  //   },
  //   [getInitializedCharges, getPriceFromPriceList, formData.storeLocation]
  // );

  const handleSelectItem = useCallback(
    async (item) => {
      // Check if item price list exists for the selected location
      if (!itemPriceListByLocation || itemPriceListByLocation.length === 0) {
        toast.error(
          "Please check the price list. If there is no active price list, or if item prices have been modified, please obtain an active or approved price list before adding items."
        );
        setSearchTerm("");
        return;
      }

      let availableStock = 0;
      const priceData = priceListMap.get(item.itemMasterId);
      let unitPrice = 0;

      if (priceData) {
        // If customer is not VAT registered, use vatAddedPrice
        if (
          formData.selectedCustomer &&
          !formData.selectedCustomer.isVATRegistered
        ) {
          unitPrice = priceData.vatAddedPrice || priceData.price || 0;
        } else {
          unitPrice = priceData.price || 0;
        }
      }

      // Check if unit price is found in price list
      if (unitPrice === 0) {
        toast.error(
          `No price found for "${item.itemName}" in the selected location's price list. Please add a price for this item to the location's price list.`
        );
        setSearchTerm("");
        return;
      }

      try {
        const inventory =
          await get_sum_location_inventories_by_locationId_itemMasterId_api(
            item.itemMasterId,
            formData.storeLocation,
            null
          );
        availableStock = inventory?.data?.result?.totalStockInHand || 0;

        if (availableStock <= 0) {
          toast.error(
            `No stock available for "${item.itemName}" in selected location`
          );
          setSearchTerm("");
          return;
        }

        const initialCharges = getInitializedCharges;

        // Store original charges for this item
        setOriginalLineItemCharges((prev) => {
          const newMap = new Map(prev);
          newMap.set(
            item.itemMasterId,
            JSON.parse(JSON.stringify(initialCharges))
          );
          return newMap;
        });

        setFormData((prev) => ({
          ...prev,
          itemDetails: [
            ...prev.itemDetails,
            {
              itemMasterId: item.itemMasterId,
              name: item.itemName || "",
              unit: item.unit?.unitName || "",
              quantity: 0,
              unitPrice: unitPrice,
              totalPrice: 0,
              batchId: null,
              tempQuantity: availableStock,
              packSize: item?.conversionRate || 1,
              isInventoryItem: item?.isInventoryItem,
              chargesAndDeductions: getInitializedCharges,
            },
          ],
        }));

        setSearchTerm("");
      } catch (error) {
        console.error("Error processing item:", error);
        toast.error("Failed to add item");
        setSearchTerm("");
      }
    },
    [
      getPriceFromPriceList,
      getInitializedCharges,
      formData.storeLocation,
      itemPriceListByLocation,
    ]
  );

  const renderColumns = useCallback(() => {
    return chargesAndDeductions.map((charge) => {
      if (charge.isApplicableForLineItem) {
        // Render columns for charges/deductions applicable for line items
        return (
          <th key={charge.chargesAndDeductionId}>
            {charge.sign + " "}
            {charge.displayName}
            {charge.percentage !== null && " (%)"}
          </th>
        );
      }
      return null;
    });
  }, [chargesAndDeductions]);

  const renderSubColumns = useCallback(() => {
    if (formData.itemDetails.length === 0) return null;
    return formData.commonChargesAndDeductions.map((charge, chargeIndex) => {
      if (!charge.isApplicableForLineItem) {
        return (
          <tr key={chargeIndex}>
            <td
              colSpan={
                6 +
                formData.itemDetails[0].chargesAndDeductions.length -
                (company.batchStockType === "FIFO" ? 1 : 0)
              }
            ></td>
            <th className="text-end">
              {/* {charge.sign + " "} */}
              {charge.name}
              {charge.isPercentage === true && " (%)"}
            </th>
            <td>
              <input
                className="form-control"
                type="number"
                value={charge.value}
                onChange={(e) => {
                  let newValue = parseFloat(e.target.value);

                  // If the entered value is not a valid number, set it to 0
                  if (isNaN(newValue)) {
                    newValue = 0;
                  } else {
                    // If the charge is a percentage, ensure the value is between 0 and 100
                    if (charge.isPercentage) {
                      newValue = Math.min(100, Math.max(0, newValue)); // Clamp the value between 0 and 100
                    } else {
                      // For non-percentage charges, ensure the value is positive
                      newValue = Math.max(0, newValue);
                    }
                  }

                  handleInputChange(
                    `commonChargesAndDeductions_${chargeIndex}_value`,
                    newValue
                  );
                }}
              />
            </td>
          </tr>
        );
      }
      return null;
    });
  }, [formData, company, handleInputChange]);

  // Function to open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  console.log("formData", formData);
  console.log("sales order: ", salesOrder);

  return {
    // State
    formData,
    submissionStatus,
    validFields,
    searchTerm,
    customerSearchTerm,
    salesPersonSearchTerm,
    itemIdsToBeDeleted,
    showModal,

    //Refs
    alertRef,

    // Query Data
    customers,
    salesPersons,
    availableItems,
    company,
    userLocations,

    // Loading States
    isItemsLoading,
    isCustomersLoading,
    isSalesPersonsLoading,
    isLoadingchargesAndDeductions,
    isLoadingTransactionTypes,
    loading,
    isCompanyLoading,
    loadingDraft,
    hasLineItemChargesChanged,

    // Error States
    validationErrors,
    isItemsError,
    itemsError,
    isCustomersError,
    isSalesPersonsError,
    customersError,
    salesPersonsError,
    ischargesAndDeductionsError,
    isTransactionTypesError,
    transactionTypesError,
    isCompanyError,

    // Setters
    setCustomerSearchTerm,
    setSalesPersonSearchTerm,
    setSearchTerm,
    closeModal,

    // Handlers
    handleInputChange,
    handleItemDetailsChange,
    handleSubmit,
    handleAddItem,
    handleRemoveItem,
    handlePrint: () => window.print(),
    handleAttachmentChange,
    handleCustomerChange,
    handleAddCustomer,
    handleSelectCustomer,
    handleSelectSalesPerson,
    handleResetCustomer,
    handleResetSalesPerson,
    //handleBatchSelection,
    handleSelectItem,

    // Render Helpers
    renderColumns,
    renderSubColumns,

    // Calculations
    calculateSubTotal: () => subTotal,
    calculateTotalAmount: () => totalAmount,
  };
};

export default useSalesOrderUpdate;

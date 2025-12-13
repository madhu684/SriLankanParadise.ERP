import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  get_customers_by_company_id_api,
  get_regions_api,
  get_sales_persons_api,
} from "../../services/salesApi";

import { get_age_analysis_report } from "../../services/reportApi";
import toast from "react-hot-toast";

const useAgeAnalysisReport = () => {
  const companyId = sessionStorage.getItem("companyId");

  // Default slabs
  const DEFAULT_SLABS = [
    { fromDays: 0, toDays: 30, label: "0-30 Days" },
    { fromDays: 31, toDays: 60, label: "31-60 Days" },
    { fromDays: 61, toDays: 90, label: "61-90 Days" },
    { fromDays: 91, toDays: 120, label: "91-120 Days" },
    { fromDays: 121, toDays: null, label: "Over 120 Days" },
  ];

  // Filter states
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Customer filter
  const [customerFilterType, setCustomerFilterType] = useState("range");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customerCodeFrom, setCustomerCodeFrom] = useState("");
  const [customerCodeTo, setCustomerCodeTo] = useState("");

  // Region filter
  const [regionFilterType, setRegionFilterType] = useState("range");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionCodeFrom, setRegionCodeFrom] = useState("");
  const [regionCodeTo, setRegionCodeTo] = useState("");

  // Sales Person filter
  const [salesPersonFilterType, setSalesPersonFilterType] = useState("range");
  const [selectedSalesPersons, setSelectedSalesPersons] = useState([]);
  const [salesPersonCodeFrom, setSalesPersonCodeFrom] = useState("");
  const [salesPersonCodeTo, setSalesPersonCodeTo] = useState("");

  // Slab configuration states
  const [useCustomSlabs, setUseCustomSlabs] = useState(false);
  const [customSlabs, setCustomSlabs] = useState([...DEFAULT_SLABS]);
  const [savedCustomSlabs, setSavedCustomSlabs] = useState([...DEFAULT_SLABS]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Search trigger state
  const [searchParams, setSearchParams] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch master data - Customers
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
    enabled: !!companyId,
  });

  // Get sorted customer codes for dropdown
  const sortedCustomerCodes = useMemo(() => {
    if (!customers) return [];
    return customers
      .map((c) => c.customerCode)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [customers]);

  // Function to get customers by code range
  const getCustomersByRange = () => {
    if (!customers || !customerCodeFrom || !customerCodeTo) return [];

    const fromIndex = sortedCustomerCodes.indexOf(customerCodeFrom);
    const toIndex = sortedCustomerCodes.indexOf(customerCodeTo);

    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return [];

    const codesInRange = sortedCustomerCodes.slice(fromIndex, toIndex + 1);

    return customers
      .filter((c) => codesInRange.includes(c.customerCode))
      .map((c) => c.customerId);
  };

  // Fetch master data - Regions
  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const response = await get_regions_api();
      return response.data.result || [];
    },
  });

  // Get sorted region codes for dropdown
  const sortedRegionCodes = useMemo(() => {
    if (!regions) return [];
    return regions
      .map((r) => r.alias)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [regions]);

  // Function to get regions by code range
  const getRegionsByRange = () => {
    if (!regions || !regionCodeFrom || !regionCodeTo) return [];

    const fromIndex = sortedRegionCodes.indexOf(regionCodeFrom);
    const toIndex = sortedRegionCodes.indexOf(regionCodeTo);

    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return [];

    const codesInRange = sortedRegionCodes.slice(fromIndex, toIndex + 1);

    return regions
      .filter((r) => codesInRange.includes(r.alias))
      .map((r) => r.regionId);
  };

  // Fetch master data - Sales Persons
  const {
    data: salesPersons,
    isLoading: isSalesPersonsLoading,
    isError: isSalesPersonsError,
    error: salesPersonsError,
  } = useQuery({
    queryKey: ["salesPersons"],
    queryFn: async () => {
      const response = await get_sales_persons_api();
      return response.data.result || [];
    },
  });

  // Get sorted sales person codes for dropdown
  const sortedSalesPersonCodes = useMemo(() => {
    if (!salesPersons) return [];
    return salesPersons
      .map((sp) => sp.salesPersonCode)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [salesPersons]);

  // Function to get sales persons by code range
  const getSalesPersonsByRange = () => {
    if (!salesPersons || !salesPersonCodeFrom || !salesPersonCodeTo) return [];

    const fromIndex = sortedSalesPersonCodes.indexOf(salesPersonCodeFrom);
    const toIndex = sortedSalesPersonCodes.indexOf(salesPersonCodeTo);

    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) return [];

    const codesInRange = sortedSalesPersonCodes.slice(fromIndex, toIndex + 1);

    return salesPersons
      .filter((sp) => codesInRange.includes(sp.salesPersonCode))
      .map((sp) => sp.salesPersonId);
  };

  // Fetch report data
  const {
    data: reportResponse,
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
    refetch: refetchReport,
  } = useQuery({
    queryKey: ["ageAnalysisReport", searchParams],
    queryFn: async () => {
      const response = await get_age_analysis_report({
        asOfDate: new Date(searchParams.asOfDate).toISOString(),
        slabs: searchParams.slabs,
        customerIds:
          searchParams.customerIds.length > 0 ? searchParams.customerIds : [],
        regionIds:
          searchParams.regionIds.length > 0 ? searchParams.regionIds : [],
        salesPersonIds:
          searchParams.salesPersonIds.length > 0
            ? searchParams.salesPersonIds
            : [],
        pageNumber: searchParams.pageNumber,
        pageSize: searchParams.pageSize,
      });

      return response.data.result;
    },
    enabled: !!searchParams && hasSearched,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Handle search button click
  // const handleSearch = () => {
  //   const slabsToUse = useCustomSlabs ? customSlabs : DEFAULT_SLABS;

  //   // Validate custom slabs if enabled
  //   if (useCustomSlabs) {
  //     const invalidSlab = customSlabs.find(
  //       (slab) => !slab.label || slab.fromDays === undefined
  //     );
  //     if (invalidSlab) {
  //       toast.error("Please fill in all slab fields correctly");
  //       return;
  //     }

  //     // Validate that slabs are in order
  //     for (let i = 0; i < customSlabs.length - 1; i++) {
  //       if (
  //         customSlabs[i].toDays &&
  //         customSlabs[i].toDays >= customSlabs[i + 1].fromDays
  //       ) {
  //         toast.error("Slab ranges must be sequential and non-overlapping");
  //         return;
  //       }
  //     }
  //   }

  //   // Determine customer IDs based on filter type
  //   let customerIds = [];
  //   if (customerFilterType === "select") {
  //     customerIds = selectedCustomers;
  //   } else if (customerFilterType === "range") {
  //     if (!customerCodeFrom || !customerCodeTo) {
  //       toast.error("Please select both from and to customer codes");
  //       return;
  //     }
  //     customerIds = getCustomersByRange();
  //     if (customerIds.length === 0) {
  //       toast.error("Invalid customer code range selected");
  //       return;
  //     }
  //   }

  //   // Determine region IDs based on filter type
  //   let regionIds = [];
  //   if (regionFilterType === "select") {
  //     regionIds = selectedRegions;
  //   } else if (regionFilterType === "range") {
  //     if (!regionCodeFrom || !regionCodeTo) {
  //       toast.error("Please select both from and to region codes");
  //       return;
  //     }
  //     regionIds = getRegionsByRange();
  //     if (regionIds.length === 0) {
  //       toast.error("Invalid region code range selected");
  //       return;
  //     }
  //   }

  //   // Determine sales person IDs based on filter type
  //   let salesPersonIds = [];
  //   if (salesPersonFilterType === "select") {
  //     salesPersonIds = selectedSalesPersons;
  //   } else if (salesPersonFilterType === "range") {
  //     if (!salesPersonCodeFrom || !salesPersonCodeTo) {
  //       toast.error("Please select both from and to sales person codes");
  //       return;
  //     }
  //     salesPersonIds = getSalesPersonsByRange();
  //     if (salesPersonIds.length === 0) {
  //       toast.error("Invalid sales person code range selected");
  //       return;
  //     }
  //   }

  //   setCurrentPage(1);
  //   setHasSearched(true);
  //   setSearchParams({
  //     asOfDate,
  //     slabs: slabsToUse,
  //     customerIds: customerIds,
  //     regionIds: regionIds,
  //     salesPersonIds: salesPersonIds,
  //     pageNumber: 1,
  //     pageSize,
  //   });
  // };

  const handleSearch = () => {
    const slabsToUse = useCustomSlabs ? customSlabs : DEFAULT_SLABS;

    // Validate custom slabs if enabled
    if (useCustomSlabs) {
      const invalidSlab = customSlabs.find(
        (slab) => !slab.label || slab.fromDays === undefined
      );
      if (invalidSlab) {
        toast.error("Please fill in all slab fields correctly");
        return;
      }

      // Validate that slabs are in order
      for (let i = 0; i < customSlabs.length - 1; i++) {
        if (
          customSlabs[i].toDays &&
          customSlabs[i].toDays >= customSlabs[i + 1].fromDays
        ) {
          toast.error("Slab ranges must be sequential and non-overlapping");
          return;
        }
      }
    }

    // Validate paired filters - Sales Person
    if (
      (salesPersonCodeFrom && !salesPersonCodeTo) ||
      (!salesPersonCodeFrom && salesPersonCodeTo)
    ) {
      toast.error("Please select both Sales Person From and To codes");
      return;
    }

    // Validate paired filters - Region
    if (
      (regionCodeFrom && !regionCodeTo) ||
      (!regionCodeFrom && regionCodeTo)
    ) {
      toast.error("Please select both Region From and To codes");
      return;
    }

    // Validate paired filters - Customer
    if (
      (customerCodeFrom && !customerCodeTo) ||
      (!customerCodeFrom && customerCodeTo)
    ) {
      toast.error("Please select both Customer From and To codes");
      return;
    }

    // Determine customer IDs based on filter type
    let customerIds = [];
    if (customerFilterType === "select") {
      customerIds = selectedCustomers;
    } else if (customerFilterType === "range") {
      if (customerCodeFrom && customerCodeTo) {
        customerIds = getCustomersByRange();
        if (customerIds.length === 0) {
          toast.error("Invalid customer code range selected");
          return;
        }
      }
      // If both are empty, customerIds remains empty array (no filter)
    }

    // Determine region IDs based on filter type
    let regionIds = [];
    if (regionFilterType === "select") {
      regionIds = selectedRegions;
    } else if (regionFilterType === "range") {
      if (regionCodeFrom && regionCodeTo) {
        regionIds = getRegionsByRange();
        if (regionIds.length === 0) {
          toast.error("Invalid region code range selected");
          return;
        }
      }
      // If both are empty, regionIds remains empty array (no filter)
    }

    // Determine sales person IDs based on filter type
    let salesPersonIds = [];
    if (salesPersonFilterType === "select") {
      salesPersonIds = selectedSalesPersons;
    } else if (salesPersonFilterType === "range") {
      if (salesPersonCodeFrom && salesPersonCodeTo) {
        salesPersonIds = getSalesPersonsByRange();
        if (salesPersonIds.length === 0) {
          toast.error("Invalid sales person code range selected");
          return;
        }
      }
      // If both are empty, salesPersonIds remains empty array (no filter)
    }

    setCurrentPage(1);
    setHasSearched(true);
    setSearchParams({
      asOfDate,
      slabs: slabsToUse,
      customerIds: customerIds,
      regionIds: regionIds,
      salesPersonIds: salesPersonIds,
      pageNumber: 1,
      pageSize,
    });
  };

  // Handle pagination change
  useEffect(() => {
    if (
      searchParams &&
      hasSearched &&
      currentPage !== searchParams.pageNumber
    ) {
      setSearchParams({
        ...searchParams,
        pageNumber: currentPage,
      });
    }
  }, [currentPage]);

  // Clear customer range when switching to select mode
  useEffect(() => {
    if (customerFilterType === "select") {
      setCustomerCodeFrom("");
      setCustomerCodeTo("");
    } else {
      setSelectedCustomers([]);
    }
  }, [customerFilterType]);

  // Clear region range when switching to select mode
  useEffect(() => {
    if (regionFilterType === "select") {
      setRegionCodeFrom("");
      setRegionCodeTo("");
    } else {
      setSelectedRegions([]);
    }
  }, [regionFilterType]);

  // Clear sales person range when switching to select mode
  useEffect(() => {
    if (salesPersonFilterType === "select") {
      setSalesPersonCodeFrom("");
      setSalesPersonCodeTo("");
    } else {
      setSelectedSalesPersons([]);
    }
  }, [salesPersonFilterType]);

  // Custom slab management functions
  const addCustomSlab = () => {
    if (customSlabs.length >= 5) {
      toast.error("Maximum 5 slabs allowed");
      return;
    }

    const lastSlab = customSlabs[customSlabs.length - 1];
    const newFromDays = lastSlab.toDays ? lastSlab.toDays + 1 : 0;

    const updatedSlabs = [
      ...customSlabs,
      {
        fromDays: newFromDays,
        toDays: null,
        label: "",
      },
    ];

    setCustomSlabs(updatedSlabs);
    setSavedCustomSlabs(updatedSlabs);
  };

  const removeCustomSlab = (index) => {
    if (customSlabs.length === 1) {
      toast.error("At least one slab is required");
      return;
    }
    const updatedSlabs = customSlabs.filter((_, i) => i !== index);
    setCustomSlabs(updatedSlabs);
    setSavedCustomSlabs(updatedSlabs);
  };

  const updateCustomSlab = (index, field, value) => {
    const updatedSlabs = [...customSlabs];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      [field]: value,
    };

    // Auto-generate label when fromDays or toDays changes
    if (field === "fromDays" || field === "toDays") {
      const slab = updatedSlabs[index];
      if (slab.fromDays !== undefined) {
        if (
          slab.toDays === null ||
          slab.toDays === undefined ||
          slab.toDays === ""
        ) {
          updatedSlabs[index].label = `Over ${slab.fromDays} Days`;
        } else {
          updatedSlabs[index].label = `${slab.fromDays}-${slab.toDays} Days`;
        }
      }
    }

    setCustomSlabs(updatedSlabs);
    setSavedCustomSlabs(updatedSlabs);
  };

  // Toggle between custom and default slabs
  useEffect(() => {
    if (useCustomSlabs) {
      setCustomSlabs([...savedCustomSlabs]);
    } else {
      setCustomSlabs([...DEFAULT_SLABS]);
    }
  }, [useCustomSlabs]);

  return {
    // Filter states
    asOfDate,
    setAsOfDate,

    // Customer filter
    customerFilterType,
    setCustomerFilterType,
    selectedCustomers,
    setSelectedCustomers,
    customerCodeFrom,
    setCustomerCodeFrom,
    customerCodeTo,
    setCustomerCodeTo,

    // Region filter
    regionFilterType,
    setRegionFilterType,
    selectedRegions,
    setSelectedRegions,
    regionCodeFrom,
    setRegionCodeFrom,
    regionCodeTo,
    setRegionCodeTo,

    // Sales Person filter
    salesPersonFilterType,
    setSalesPersonFilterType,
    selectedSalesPersons,
    setSelectedSalesPersons,
    salesPersonCodeFrom,
    setSalesPersonCodeFrom,
    salesPersonCodeTo,
    setSalesPersonCodeTo,

    // Slab configuration
    useCustomSlabs,
    setUseCustomSlabs,
    customSlabs,
    setCustomSlabs,

    // Report data
    reportData: reportResponse,
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,

    // Master data
    customers,
    regions,
    salesPersons,
    isCustomersLoading,
    isRegionsLoading,
    isSalesPersonsLoading,
    sortedCustomerCodes,
    sortedRegionCodes,
    sortedSalesPersonCodes,

    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,

    // Actions
    handleSearch,
    addCustomSlab,
    removeCustomSlab,
    updateCustomSlab,
    refetchReport,
    getCustomersByRange,
    getRegionsByRange,
    getSalesPersonsByRange,
    hasSearched,
    setHasSearched,
    setSearchParams,
  };
};

export default useAgeAnalysisReport;

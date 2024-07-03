import { useQuery } from "@tanstack/react-query";
import { get_supplier_logo_api } from "../../../../services/purchaseApi";

const useSupplierDetail = (supplier) => {
  const fetchsupplierLogo = async () => {
    try {
      const response = await get_supplier_logo_api(supplier?.supplierId);
      return response;
    } catch (error) {
      console.error("Error fetching supplier logo:", error);
      return [];
    }
  };

  const {
    data: supplierLogo,
    isLoading: isLoadingSupplierLogo,
    isError: isSupplierLogoError,
    error: supplierLogoError,
  } = useQuery({
    queryKey: ["supplierLogo", supplier?.supplierId],
    queryFn: fetchsupplierLogo,
  });

  return {
    isLoadingSupplierLogo,
    isSupplierLogoError,
    supplierLogo,
  };
};

export default useSupplierDetail;

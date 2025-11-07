import { useState, useRef, useEffect } from "react";
import { put_cashier_session_api } from "../../../services/salesApi";
import {
  get_sales_receipts_by_user_id_api,
  get_cashier_expense_outs_by_user_id_api,
} from "../../../services/salesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import toast from "react-hot-toast";

const useCashierSessionUpdate = ({ onFormSubmit, cashierSession }) => {
  const [validFields, setValidFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const alertRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [salesReceipts, setSalesReceipts] = useState([]);
  const [expenseOuts, setExpenseOuts] = useState([]);
  const [collectionTotal, setCollectionTotal] = useState(0);
  const [expenseOutTotal, setExpenseOutTotal] = useState(0);
  const [isDifferenceCashInHand, setIsDifferenceCashInHand] = useState(false);
  const [isDifferenceChequesInHand, setIsDifferenceChequesInHand] =
    useState(false);
  const [reasonCashInHand, setReasonCashInHand] = useState("");
  const [reasonChequesInHand, setReasonChequesInHand] = useState("");
  const [actualCashInHand, setActualCashInHand] = useState("");
  const [actualChequesInHand, setActualChequesInHand] = useState("");
  const [selectedMode, setSelectedMode] = useState(null);
  const [showExpenseOutDetailModal, setShowExpenseOutDetailModal] =
    useState(false);

  const queryClient = useQueryClient();

  const fetchUserSalesReceipts = async () => {
    try {
      const response = await get_sales_receipts_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching user sales receipts:", error);
    }
  };

  const {
    data: userSalesReceipts,
    isLoading: isLoadingSalesReceipts,
    isError: isSalesReceiptsError,
    error: SalesReceiptError,
  } = useQuery({
    queryKey: ["userSalesReceipts"],
    queryFn: fetchUserSalesReceipts,
  });

  const fetchCashierExpenseOuts = async () => {
    try {
      const response = await get_cashier_expense_outs_by_user_id_api(
        sessionStorage.getItem("userId")
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching cashier expense outs:", error);
    }
  };

  const {
    data: cashierExpenseOuts,
    isLoading: isLoadingCashierExpenseOuts,
    isError: isCashierExpenseOutsError,
    error: CashierExpenseOutsError,
  } = useQuery({
    queryKey: ["CashierExpenseOuts"],
    queryFn: fetchCashierExpenseOuts,
  });

  useEffect(() => {
    if (!isLoadingSalesReceipts && userSalesReceipts) {
      // Filter sales receipts based on the session opening datetime and current datetime
      const filteredSalesReceipts = userSalesReceipts.filter((receipt) => {
        // return (
        //   receipt.createdDate >= cashierSession.sessionIn &&
        //   receipt.createdDate <= new Date().toISOString()
        // );
        const createdDate = moment.utc(receipt.createdDate);
        const sessionIn = moment.utc(cashierSession.sessionIn);
        const currentDate = moment.utc();

        return createdDate.isBetween(sessionIn, currentDate);
      });

      // Set the filtered sales receipts
      setSalesReceipts(filteredSalesReceipts);

      // Calculate the total amount received from the filtered sales receipts
      const total = filteredSalesReceipts.reduce(
        (acc, curr) => acc + curr.amountReceived,
        0
      );
      setCollectionTotal(total);
    }

    if (!isLoadingCashierExpenseOuts && cashierExpenseOuts) {
      // Filter cashier expense outs based on the session opening datetime and current datetime
      const filteredcashierExpenseOuts = cashierExpenseOuts.filter(
        (expenseOut) => {
          const createdDate = moment.utc(expenseOut.createdDate);
          const sessionIn = moment.utc(cashierSession.sessionIn);
          const currentDate = moment.utc();

          return createdDate.isBetween(sessionIn, currentDate);
        }
      );

      // Set the filtered sales expenseOuts
      setExpenseOuts(filteredcashierExpenseOuts);

      // Calculate the total amount expensed out from the filtered cashier expense outs
      const expenseOutTotal = filteredcashierExpenseOuts.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      setExpenseOutTotal(expenseOutTotal);
    }
  }, [
    isLoadingSalesReceipts,
    userSalesReceipts,
    isLoadingCashierExpenseOuts,
    cashierExpenseOuts,
  ]);

  useEffect(() => {
    if (submissionStatus != null) {
      // Scroll to the success alert when it becomes visible
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissionStatus]);

  useEffect(() => {
    setValidFields({});
    setValidationErrors({});
    if (
      actualCashInHand !==
      cashierSession?.openingBalance +
        (totalsByPaymentMode[1] ?? 0) -
        expenseOutTotal
    ) {
      setIsDifferenceCashInHand(true);
    } else {
      setIsDifferenceCashInHand(false);
    }
  }, [actualCashInHand]);

  useEffect(() => {
    setValidFields({});
    setValidationErrors({});
    if (actualChequesInHand !== (totalsByPaymentMode[2] ?? 0)) {
      setIsDifferenceChequesInHand(true);
    } else {
      setIsDifferenceChequesInHand(false);
    }
  }, [actualChequesInHand]);

  const validateField = (
    fieldName,
    fieldDisplayName,
    value,
    additionalRules = {}
  ) => {
    let isFieldValid = true;
    let errorMessage = "";

    if (value === null || value === undefined || `${value}`.trim() === "") {
      isFieldValid = false;
      errorMessage = `${fieldDisplayName} is required`;
    }

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

    let isReasonCashInHandValid = true;
    let isReasonChequesInHandValid = true;

    if (isDifferenceCashInHand) {
      isReasonCashInHandValid = validateField(
        "reasonCashInHand",
        "Reason",
        reasonCashInHand
      );
    }

    if (isDifferenceChequesInHand) {
      isReasonChequesInHandValid = validateField(
        "reasonChequesInHand",
        "Reason",
        reasonChequesInHand
      );
    }

    const isActualCashInHandValid = validateField(
      "actualCashInHand",
      "Actual cash in hand",
      actualCashInHand
    );

    const isActualChequesInHandValid = validateField(
      "actualChequesInHand",
      "Actual cheques in hand",
      actualChequesInHand
    );

    return (
      isReasonCashInHandValid &&
      isReasonChequesInHandValid &&
      isActualCashInHandValid &&
      isActualChequesInHandValid
    );
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = validateForm();
      const currentDate = new Date().toISOString();

      if (isFormValid) {
        setLoading(true);
        const cashierSessionData = {
          userId: sessionStorage.getItem("userId"),
          sessionIn: cashierSession.sessionIn,
          sessionOut: currentDate,
          openingBalance: cashierSession.openingBalance,
          companyId: sessionStorage.getItem("companyId"),
          actualCashInHand: actualCashInHand,
          actualChequesInHand: actualChequesInHand,
          reasonCashInHandDifference: reasonCashInHand,
          reasonChequesInHandDifference: reasonChequesInHand,
          isActiveSession: false,
          permissionId: 1068,
        };

        const response = await put_cashier_session_api(
          cashierSession.cashierSessionId,
          cashierSessionData
        );

        if (response.status === 200) {
          setSubmissionStatus("success");
          console.log("Cashier session close successfully", cashierSessionData);
          queryClient.invalidateQueries({
            queryKey: [
              "activeCashierSession",
              sessionStorage.getItem("userId"),
            ],
          });
          setTimeout(() => {
            setSubmissionStatus(null);
            setLoading(false);
            onFormSubmit(response);
          }, 3000);

          toast.success("Cashier session closed successfully!");
        } else {
          setSubmissionStatus("error");
          toast.error("Failed to close cashier session.");
        }
      }
    } catch (error) {
      console.error("Error closing cashier session", error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus(null);
        setLoading(false);
      }, 3000);
      toast.error("Failed to close cashier session.");
    }
  };

  // Calculate totals for each payment mode
  const totalsByPaymentMode = salesReceipts.reduce((totals, receipt) => {
    const modeId = receipt.paymentMode.paymentModeId;
    totals[modeId] = (totals[modeId] || 0) + receipt.amountReceived;
    return totals;
  }, {});

  const openCollectionDetailModal = (modeId) => {
    setSelectedMode(modeId);
  };

  const closeCollectionDetailModal = () => {
    setSelectedMode(null);
  };

  const handleExpenseOutDetailModal = () => {
    setShowExpenseOutDetailModal(!showExpenseOutDetailModal);
  };

  return {
    validFields,
    validationErrors,
    submissionStatus,
    loading,
    alertRef,
    totalsByPaymentMode,
    salesReceipts,
    expenseOutTotal,
    expenseOuts,
    isDifferenceCashInHand,
    isDifferenceChequesInHand,
    reasonCashInHand,
    reasonChequesInHand,
    actualCashInHand,
    actualChequesInHand,
    selectedMode,
    showExpenseOutDetailModal,
    isLoadingSalesReceipts,
    isSalesReceiptsError,
    isLoadingCashierExpenseOuts,
    isCashierExpenseOutsError,
    handleSubmit,
    setIsDifferenceCashInHand,
    setIsDifferenceChequesInHand,
    setReasonCashInHand,
    setReasonChequesInHand,
    setActualCashInHand,
    setActualChequesInHand,
    openCollectionDetailModal,
    closeCollectionDetailModal,
    handleExpenseOutDetailModal,
  };
};

export default useCashierSessionUpdate;

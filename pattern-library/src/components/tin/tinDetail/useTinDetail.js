import { useEffect, useState } from "react";
import {
  patch_issue_detail_api,
  get_issue_details_api,
} from "../../../services/purchaseApi";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

const useTinDetail = (tin, handleClose) => {
  const queryClient = useQueryClient();

  const isRequester =
    Number(sessionStorage?.getItem("userId")) ===
    tin.requisitionMaster.requestedUserId;

  const { data: issuedetails } = useQuery({
    queryKey: ["tinDetails", tin.issueMasterId],
    queryFn: () => get_issue_details_api(tin.issueMasterId),
    select: (r) => r?.data?.result || [],
  });

  const handleReceivedQuantityChange = (issueDetailId, newQuantity) => {
    setReceivedQuantities((prev) => ({
      ...prev,
      [issueDetailId]: newQuantity,
    }));
  };

  const handleReturnedQuantityChange = (issueDetailId, newQuantity) => {
    setReturnedQuantities((prev) => ({
      ...prev,
      [issueDetailId]: newQuantity,
    }));
  };

  const [receivedQuantities, setReceivedQuantities] = useState({});
  const [returnedQuantities, setReturnedQuantities] = useState({});

  // Update receivedQuantities when issuedetails are fetched
  useEffect(() => {
    if (issuedetails?.length > 0) {
      const updatedReceivedQuantities = issuedetails.reduce((acc, item) => {
        acc[item.issueDetailId] =
          item.receivedQuantity !== undefined ? item.receivedQuantity : "";
        return acc;
      }, {});
      setReceivedQuantities(updatedReceivedQuantities);
    }
  }, [issuedetails]);

  useEffect(() => {
    if (issuedetails?.length > 0) {
      const updatedReturnedQuantities = issuedetails.reduce((acc, item) => {
        acc[item.issueDetailId] =
          item.returnedQuantity !== undefined ? item.returnedQuantity : "";
        return acc;
      }, {});
      setReturnedQuantities(updatedReturnedQuantities);
    }
  }, [issuedetails]);

  const mutation = useMutation({
    mutationFn: ({ issuemasterid, updatedDetails }) =>
      patch_issue_detail_api(issuemasterid, updatedDetails),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tinDetails", tin.issueMasterId]);
      handleClose();
    },
    onError: (error) => {
      console.error("Failed to update received quantities:", error);
    },
  });

  const handleAccept = () => {
    const updatedDetails = issuedetails.map((item) => ({
      issueDetailId: item.issueDetailId,
      receivedQuantity: receivedQuantities[item.issueDetailId] || 0,
      returnedQuantity: returnedQuantities[item.issueDetailId] || 0,
    }));

    mutation.mutate({ issuemasterid: tin.issueMasterId, updatedDetails });
  };

  return {
    receivedQuantities,
    isRequester,
    handleAccept,
    returnedQuantities,
    handleReceivedQuantityChange,
    handleReturnedQuantityChange,
  };
};

export default useTinDetail;

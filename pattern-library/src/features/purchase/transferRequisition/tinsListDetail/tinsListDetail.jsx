import { useState } from "react";
import moment from "moment";
import "moment-timezone";
import useTinList from "features/purchase/tin/tinList/useTinList";
import { get_issue_masters_by_requisition_master_id_api } from "common/services/purchaseApi";
import CurrentDateTime from "common/components/currentDateTime/currentDateTime";
import TinDetails from "features/purchase/transferRequisition/tinAccept/tinAccept.jsx";
import { useQuery } from "@tanstack/react-query";

const TinsListDetail = ({ refetch, setRefetch, trnId, handleBack }) => {
  const { getStatusBadgeClass, getStatusLabel } = useTinList();

  const [tinDetail, setTinDetail] = useState("");
  const [showTinAcceptModal, setShowTinAcceptModal] = useState(false);

  const handleViewDetails = (tin) => {
    setTinDetail(tin);
    setShowTinAcceptModal(true);
  };

  const handleCloseDetailTinModal = () => {
    setShowTinAcceptModal(false);
    setTinDetail("");
  };

  const fetchData = async () => {
    try {
      const requisitionMasterResponse =
        await get_issue_masters_by_requisition_master_id_api(trnId);
      console.log("TINS for the selected TRN", requisitionMasterResponse);
      return requisitionMasterResponse.data.result || [];
    } catch (error) {
      console.log("Error fetching TINS for the given TRN id", error);
      return [];
    }
  };

  const { data: filteredTins } = useQuery({
    queryKey: ["tins", trnId],
    queryFn: fetchData,
    enabled: !!trnId,
  });

  return (
    <div className="container mt-4">
      {/*Header*/}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <i
            class="bi bi-arrow-left"
            onClick={handleBack}
            className="bi bi-arrow-left btn btn-dark d-flex align-items-center justify-content-center"
          ></i>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Transfer Issue Notes</h1>
        <hr />
      </div>

      <h5>Transfer Issue Notes List</h5>
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Issued By</th>
              <th>TIN Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredTins?.map((tin) => (
              <tr key={tin.issueMasterId}>
                <td>{tin.referenceNumber}</td>
                <td>{tin.createdBy}</td>
                <td>
                  {moment
                    .utc(tin?.issueDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      tin.status,
                    )}`}
                  >
                    {getStatusLabel(tin.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleViewDetails(tin)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>{" "}
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showTinAcceptModal && (
          <TinDetails
            refetch={refetch}
            setRefetch={setRefetch}
            show={showTinAcceptModal}
            handleClose={handleCloseDetailTinModal}
            tin={tinDetail}
            trnId={trnId}
          />
        )}
      </div>
    </div>
  );
};

export default TinsListDetail;

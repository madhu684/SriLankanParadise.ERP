import { React, useState, useEffect } from "react";
import moment from "moment";
import "moment-timezone";
import { get_issue_masters_by_requisition_master_id_api } from "../../../services/purchaseApi";
import useMinList from "../../min/minList/useMinList";
import CurrentDateTime from "../../currentDateTime/currentDateTime";
import MinDetails from "../../min/minDetail/minDetail";

const MinsListDetail = ({ mrnId, handleBack }) => {
  const {
    showDetailMinModal,
    showDetailMinModalInParent,
    MinDetail,
    handleCloseDetailMinModal,
    handleViewDetails,
    getStatusBadgeClass,
    getStatusLabel,
  } = useMinList();

  const [filterdMins, setFilteredMins] = useState([]);

  //Fetch filtered MINs for a given MRN id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requisitionMasterResponse =
          await get_issue_masters_by_requisition_master_id_api(mrnId);
        console.log("MINS for the selected MRN", requisitionMasterResponse);
        setFilteredMins(requisitionMasterResponse.data.result);
      } catch (error) {
        console.log("Error fetching MINS for the given MRN id", error);
      }
    };
    fetchData();
  }, [mrnId]);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <button
            onClick={handleBack}
            className="btn btn-dark d-flex align-items-center"
          >
            Back
          </button>
          <p>
            <CurrentDateTime />
          </p>
        </div>
        <h1 className="mt-2 text-center">Material Issue Notes</h1>
        <hr />
      </div>

      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Issued By</th>
              <th>MIN Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filterdMins?.map((min) => (
              <tr key={min.issueMasterId}>
                <td>{min.referenceNumber}</td>
                <td>{min.createdBy}</td>
                <td>
                  {moment
                    .utc(min?.issueDate)
                    .tz("Asia/Colombo")
                    .format("YYYY-MM-DD hh:mm:ss A")}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${getStatusBadgeClass(
                      min.status
                    )}`}
                  >
                    {getStatusLabel(min.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleViewDetails(min)}
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
        {showDetailMinModalInParent && (
          <MinDetails
            show={showDetailMinModal}
            handleClose={handleCloseDetailMinModal}
            min={MinDetail}
          />
        )}
      </div>
    </div>
  );
};

export default MinsListDetail;

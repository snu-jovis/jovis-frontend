import { useState, useEffect } from "react";
import { generateFormulas } from "../utils";

const RunCost = ({ nodeDetails }) => {
  const [totalForm, setTotalForm] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [totalDetail, setTotalDetail] = useState("");
  const [runForm, setRunForm] = useState("");
  const [runCost, setRunCost] = useState("");
  const [runDetail, setRunDetail] = useState("");

  const [showTotalDetails, setShowTotalDetails] = useState(false);
  const [showRunDetails, setShowRunDetails] = useState(false);

  useEffect(() => {
    const formulas = generateFormulas(nodeDetails);

    if (formulas) {
      setTotalForm(formulas.total);
      setTotalCost(formulas.total_cost);
      setTotalDetail(formulas.total_detail);

      setRunForm(formulas.run);
      setRunCost(formulas.run_cost);
      setRunDetail(formulas.run_detail);
    }
  });

  return (
    <table className="m-2 text-bsm">
      <tbody>
        <tr className="border-b border-gray-300">
          <td className="pr-4">Total Cost</td>
          <td className="py-2">
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: totalForm }}
            />
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: totalCost }}
            />

            <button
              className="mt-1 text-xs text-blue-500 underline"
              onClick={() => setShowTotalDetails(!showTotalDetails)}
            >
              {showTotalDetails ? "hide details" : "view details"}
            </button>
            {showTotalDetails && (
              <div className="border rounded bg-gray-50 text-xs p-2 break-words space-y-1">
                {totalDetail}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <td className="pr-4">Run Cost</td>
          <td className="py-2">
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: runForm }}
            />
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: runCost }}
            />

            <button
              className="mt-1 text-xs text-blue-500 underline"
              onClick={() => setShowRunDetails(!showRunDetails)}
            >
              {showRunDetails ? "hide details" : "view details"}
            </button>
            {showRunDetails && (
              <div className="border rounded bg-gray-50 text-xs p-2 break-words space-y-1">
                {runDetail}
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RunCost;

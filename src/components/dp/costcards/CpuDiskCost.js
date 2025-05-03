import { useState, useEffect } from "react";
import { generateFormulas } from "../utils";

const CpuDiskCost = ({ nodeDetails }) => {
  const [totalForm, setTotalForm] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [totalDetail, setTotalDetail] = useState("");
  const [cpuForm, setCpuForm] = useState("");
  const [cpuCost, setCpuCost] = useState("");
  const [cpuDetail, setCpuDetail] = useState("");
  const [diskForm, setDiskForm] = useState("");
  const [diskCost, setDiskCost] = useState("");
  const [diskDetail, setDiskDetail] = useState("");

  const [showTotalDetails, setShowTotalDetails] = useState(false);
  const [showCpuDetails, setShowCpuDetails] = useState(false);
  const [showDiskDetails, setShowDiskDetails] = useState(false);

  useEffect(() => {
    const formulas = generateFormulas(nodeDetails);

    if (formulas) {
      setTotalForm(formulas.total);
      setTotalCost(formulas.total_cost);
      setTotalDetail(formulas.total_detail);

      setCpuForm(formulas.cpu);
      setCpuCost(formulas.cpu_cost);
      setCpuDetail(formulas.cpu_detail);

      setDiskForm(formulas.disk);
      setDiskCost(formulas.disk_cost);
      setDiskDetail(formulas.disk_detail);
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
        <tr className="border-b border-gray-300">
          <td className="pr-4">CPU Run Cost</td>
          <td className="py-2">
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: cpuForm }}
            />
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: cpuCost }}
            />

            <button
              className="mt-1 text-xs text-blue-500 underline"
              onClick={() => setShowCpuDetails(!showCpuDetails)}
            >
              {showCpuDetails ? "hide details" : "view details"}
            </button>
            {showCpuDetails && (
              <div className="border rounded bg-gray-50 text-xs p-2 break-words space-y-1">
                {cpuDetail}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <td className="pr-4">Disk Run Cost</td>
          <td className="py-2">
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: diskForm }}
            />
            <div
              className="text-s"
              dangerouslySetInnerHTML={{ __html: diskCost }}
            />

            <button
              className="mt-1 text-xs text-blue-500 underline"
              onClick={() => setShowDiskDetails(!showDiskDetails)}
            >
              {showDiskDetails ? "hide details" : "view details"}
            </button>
            {showDiskDetails && (
              <div className="border rounded bg-gray-50 text-xs p-2 break-words space-y-1">
                {diskDetail}
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CpuDiskCost;

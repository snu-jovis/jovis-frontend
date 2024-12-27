import { useState, useEffect } from "react";
import { generateFormulas } from "../utils";

const IdxScanCost = ({ nodeDetails }) => {
  const [totalForm, setTotalForm] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [cpuForm, setCpuForm] = useState("");
  const [cpuCost, setCpuCost] = useState("");
  const [diskForm, setDiskForm] = useState("");
  const [diskCost, setDiskCost] = useState("");

  useEffect(() => {
    const formulas = generateFormulas(nodeDetails);

    if (formulas) {
      setTotalForm(formulas.total);
      setTotalCost(formulas.total_cost);

      setCpuForm(formulas.cpu);
      setCpuCost(formulas.cpu_cost);

      setDiskForm(formulas.disk);
      setDiskCost(formulas.disk_cost);
    }
  });

  return (
    <table className="m-2 text-bsm">
      <tbody>
        <tr className="border-b border-gray-300">
          <td className="pr-4">Total Cost</td>
          <td className="py-2">
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: totalForm }}
            />
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: totalCost }}
            />
          </td>
        </tr>
        <tr className="border-b border-gray-300">
          <td className="pr-4">CPU Run Cost</td>
          <td className="py-2">
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: cpuForm }}
            />
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: cpuCost }}
            />
          </td>
        </tr>
        <tr>
          <td className="pr-4">Disk Run Cost</td>
          <td className="py-2">
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: diskForm }}
            />
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: diskCost }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default IdxScanCost;

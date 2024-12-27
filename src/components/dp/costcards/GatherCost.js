import { useState, useEffect } from "react";
import { generateFormulas } from "../utils";

const GatherCost = ({ nodeDetails }) => {
  const [totalForm, setTotalForm] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [runForm, setRunForm] = useState("");
  const [runCost, setRunCost] = useState("");

  useEffect(() => {
    const formulas = generateFormulas(nodeDetails);

    if (formulas) {
      setTotalForm(formulas.total);
      setTotalCost(formulas.total_cost);

      setRunForm(formulas.run);
      setRunCost(formulas.run_cost);
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
          <td className="pr-4">Run Cost</td>
          <td className="py-2">
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: runForm }}
            />
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: runCost }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GatherCost;

import { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";

import SeqScanCost from "./costcards/SeqScanCost";
import IdxScanCost from "./costcards/IdxScanCost";
import BitmapHeapScanCost from "./costcards/BitmapHeapScanCost";

const opType = ["SeqScan", "IdxScan", "BitmapHeapScan"];

const CostCard = ({ node, nodeDetails }) => {
  const [nodeType, setNodeType] = useState("");

  useEffect(() => {
    if (node) setNodeType(node.split(" - ")[1]);
    else setNodeType("");
  }, [node]);

  return (
    <>
      {opType.includes(nodeType) && (
        <Card className="w-3/4 h-full">
          <div className="flex justify-between px-4 pt-2">
            <p className="vis-title pt-2">Cost Formula</p>
          </div>
          <div className="m-6">
            {nodeType === "SeqScan" && (
              <SeqScanCost nodeDetails={nodeDetails} />
            )}
            {nodeType === "IdxScan" && (
              <IdxScanCost nodeDetails={nodeDetails} />
            )}
            {nodeType === "BitmapHeapScan" && (
              <BitmapHeapScanCost nodeDetails={nodeDetails} />
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default CostCard;

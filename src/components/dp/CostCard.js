import { Card } from "@material-tailwind/react";

import SeqScanCost from "./costcards/SeqScanCost";
import GatherCost from "./costcards/GatherCost";
import GatherMergeCost from "./costcards/GatherMergeCost";
import IdxScanCost from "./costcards/IdxScanCost";
import BitmapHeapScanCost from "./costcards/BitmapHeapScanCost";
import NestLoopCost from "./costcards/NestLoopCost";

const opTypeComponents = {
  SeqScan: SeqScanCost,
  Gather: GatherCost,
  GatherMerge: GatherMergeCost,
  IdxScan: IdxScanCost,
  BitmapHeapScan: BitmapHeapScanCost,
  NestLoop: NestLoopCost,
};

const opType = Object.keys(opTypeComponents);

const CostCard = ({ nodes }) => {
  return (
    <div className="flex flex-wrap gap-4 my-4">
      {nodes.map((node, index) => {
        const nodeType = node.detail.node;
        if (!opType.includes(nodeType)) return null;
        const Component = opTypeComponents[nodeType];

        return (
          <Card key={index} className="h-full">
            <div className="mx-2">
              <div className="flex justify-center my-1 text-bm">{node.id}</div>
              <hr />
              <Component nodeDetails={node.detail} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CostCard;

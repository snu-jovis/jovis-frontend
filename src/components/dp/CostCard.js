import { Card } from "@material-tailwind/react";

import CpuDiskCost from "./costcards/CpuDiskCost";
import RunCost from "./costcards/RunCost";

const opTypeComponents = {
  SeqScan: CpuDiskCost,
  Gather: RunCost,
  GatherMerge: RunCost,
  IdxScan: CpuDiskCost,
  NestLoop: RunCost,
  MergeJoin: RunCost,
  HashJoin: RunCost,
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
              <div className="flex justify-center my-1 text-bm">
                [{node.index + 1}] {node.id}
              </div>
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

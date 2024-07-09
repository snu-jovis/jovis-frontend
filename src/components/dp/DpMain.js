import React, { useEffect, useState, useRef, useContext } from "react";
import { DpContext } from "../providers/DpProvider";
import { Card } from "@material-tailwind/react";
import QueryPlanTree from "../geqo/QueryPlanTree";
import GraphView from "./GraphView";
import CostCard from "./CostCard";
import DescriptionCard from "./DescriptionCard";

import "../../assets/stylesheets/Dp.css";

const DpMain = ({ data, plan }) => {
  const {
    showJoinCard,
    setShowJoinCard,
    node,
    setNode,
    setNodeDetails,
    nodeDetails,
    joinOrder,
    setJoinOrder,
    setSelectedMetric,
  } = useContext(DpContext);

  const viewRef = useRef(null);
  const [viewSize, setViewSize] = useState([0, 0]);

  useEffect(() => {
    setShowJoinCard(false);
    setNode(null);
    setNodeDetails({});
    setJoinOrder([]);
    setSelectedMetric("Default");

    const updateSize = () => {
      if (viewRef.current)
        setViewSize([
          viewRef.current.offsetWidth,
          viewRef.current.offsetHeight,
        ]);
    };

    // initial size
    updateSize();

    // update sizes on resize
    window.addEventListener("resize", updateSize);

    // cleanup
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={viewRef} className="w-full flex flex-wrap">
      <div className="w-3/4">
        <GraphView
          width={viewSize[0] ? (3 * viewSize[0]) / 4 : 500}
          height={viewSize[1] ? viewSize[1] : 500}
          base={data.base}
          dp={data.dp}
          cost={plan["Total Cost"]}
        />
      </div>
      <div className="w-1/4 flex flex-col">
        <Card className="h-1/3 mb-4">
          <QueryPlanTree
            width={viewSize[0] ? viewSize[0] / 4 : 500}
            height={viewSize[1] ? viewSize[1] / 3 - 16 : 500}
            plan={plan}
          />
        </Card>
        {showJoinCard && (
          <Card className="auto-height mb-4">
            <div className="flex justify-between px-4 pt-2">
              <p className="vis-title pt-2">Description</p>
            </div>
            <DescriptionCard node={node} />
          </Card>
        )}
      </div>
      {showJoinCard && (
        <CostCard node={node} nodeDetails={nodeDetails} joinOrder={joinOrder} />
      )}
    </div>
  );
};

export default DpMain;

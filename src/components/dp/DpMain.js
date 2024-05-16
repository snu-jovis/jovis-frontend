import React, { useEffect, useState, useRef, useContext } from "react";
import { DpContext } from "../providers/DpProvider";
import { Card } from "@material-tailwind/react";
import QueryPlanTree from "../geqo/QueryPlanTree";
import GraphView from "./GraphView";
import JoinOrderCard from "./JoinOrderCard";

import "../../assets/stylesheets/Dp.css";

const DpMain = ({ data, plan }) => {
  const {
    showJoinCard,
    setShowJoinCard,
    node,
    setNode,
    joinOrder,
    setJoinOrder,
    startupCost,
    setStartupCost,
    totalCost,
    setTotalCost,
    setSelectedMetric,
  } = useContext(DpContext);

  const viewRef = useRef(null);
  const [viewSize, setViewSize] = useState([0, 0]);

  useEffect(() => {
    setShowJoinCard(false);
    setNode(null);
    setJoinOrder([]);
    setStartupCost(0);
    setTotalCost(0);
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
    <div ref={viewRef} className="w-full flex">
      <GraphView
        width={viewSize[0] ? (3 * viewSize[0]) / 4 : 500}
        height={viewSize[1] ? viewSize[1] : 500}
        base={data.base}
        dp={data.dp}
        cost={plan["Total Cost"]}
      />
      <div className="w-1/4">
        <Card className="h-1/2 mb-4">
          <QueryPlanTree
            width={viewSize[0] ? viewSize[0] / 4 : 500}
            height={viewSize[1] ? viewSize[1] / 2 - 16 : 500}
            plan={plan}
          />
        </Card>
        <Card className="h-1/3">
          <div className="flex justify-between px-4 pt-2">
            <p className="vis-title pt-2">Cost Formula</p>
          </div>
          <JoinOrderCard
            showJoinCard={showJoinCard}
            node={node}
            joinOrder={joinOrder}
            startupCost={startupCost}
            totalCost={totalCost}
          />
        </Card>
      </div>
    </div>
  );
};

export default DpMain;

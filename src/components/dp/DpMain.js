import React, { useEffect, useState, useRef } from "react";
import { Card } from "@material-tailwind/react";
import QueryPlanTree from "../geqo/QueryPlanTree";
import GraphView from "./GraphView";

import "../../assets/stylesheets/Dp.css";

const DpMain = ({ data }) => {
  const viewRef = useRef(null);
  const [viewSize, setViewSize] = useState([0, 0]);

  useEffect(() => {
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
        base={data.optimizer.base}
        dp={data.optimizer.dp}
        cost={data.result[0][0][0].Plan["Total Cost"]}
      />
      <div className="w-1/4">
        <Card className="h-1/2 mb-4">
          <QueryPlanTree
            width={viewSize[0] ? viewSize[0] / 4 : 500}
            height={viewSize[1] ? viewSize[1] / 2 - 16 : 500}
            plan={data.result[0][0][0].Plan}
          />
        </Card>
        {/* <Card className="h-1/2">Cost Chart</Card> */}
      </div>
    </div>
  );
};

export default DpMain;

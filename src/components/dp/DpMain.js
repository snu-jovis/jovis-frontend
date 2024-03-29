import React, { useEffect, useState, useRef } from "react";
import GraphView from "./GraphView";
import data from "../../data/dp.json";

import "../../assets/stylesheets/Dp.css";

const DpMain = (props) => {
  const viewRef = useRef(null);
  const [viewSize, setViewSize] = useState([0, 0]);

  useEffect(() => {
    const updateSize = () => {
      setViewSize([viewRef.current.offsetWidth, viewRef.current.offsetHeight]);
    };

    // initial size
    updateSize();

    // update sizes on resize
    window.addEventListener("resize", updateSize);

    // cleanup
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const sliderRef = useRef(null);
  const sliderWidth = 300;
  const sliderHeight = 50;

  const targetEntry = data.optimizer.dp[data.optimizer.dp.length - 1];
  const totalCost = targetEntry.cheapest_total_paths.total_cost;

  return (
    <div ref={viewRef} className="w-full place-content-center">
      <p className="dp-text">Total Cost: {totalCost}</p>
      <div className="flex justify-center">
        <input className="dp-text" type="button" value="Play/Pause" />
        <svg
          className="slider"
          ref={sliderRef}
          width={sliderWidth}
          height={sliderHeight}
        />
      </div>
      <GraphView
        width={viewSize[0] ? viewSize[0] - 20 : 500}
        height={500}
        data={data}
      />
    </div>
  );
};

export default DpMain;

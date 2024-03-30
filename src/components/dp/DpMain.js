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

  return (
    <div ref={viewRef} className="w-full place-content-center">
      <GraphView
        width={viewSize[0] ? viewSize[0] : 500}
        height={viewSize[1] ? viewSize[1] : 500}
        data={data}
      />
    </div>
  );
};

export default DpMain;

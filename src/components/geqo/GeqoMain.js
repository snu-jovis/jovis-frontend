import { useEffect, useRef, useState } from "react";
import CostChart from "./CostChart";
import FullView from "./FullView";
import EdgeRecomb from "./EdgeRecomb";
import JoinOrderTree from "./JoinOrderTree";
import QueryPlanTree from "./QueryPlanTree";
import { Card } from "@material-tailwind/react";

import "../../assets/stylesheets/Geqo.css";

const GeqoMain = ({ data, plan }) => {
  const chartRef = useRef(null);
  const [chartSize, setChartSize] = useState(0);

  const fullRef = useRef(null);
  const [fullSize, setFullSize] = useState(0);

  const indivRef = useRef(null);
  const [indivSize, setIndivSize] = useState(0);

  useEffect(() => {
    const updateSizes = () => {
      if (chartRef.current) setChartSize(chartRef.current.offsetWidth);
      if (fullRef.current) setFullSize(fullRef.current.offsetWidth);
      if (indivRef.current) setIndivSize(indivRef.current.offsetWidth);
    };

    // initial size
    updateSizes();

    // update sizes on resize
    window.addEventListener("resize", updateSizes);

    // cleanup
    return () => window.removeEventListener("resize", updateSizes);
  }, [data]);

  return (
    <div className="flex gap-x-2">
      <div ref={chartRef} className="w-1/4 grid grid-cols-1 gap-2 ml-2 mr-6">
        <Card>
          <CostChart
            width={chartSize}
            height={chartSize}
            data={data.geqo.gen}
          />
        </Card>
        <Card>
          <JoinOrderTree
            width={chartSize}
            height={chartSize}
            data={data.geqo.reloptinfo}
          />
        </Card>
      </div>
      <div ref={fullRef} className="w-1/2 flex justify-center">
        <FullView
          width={fullSize}
          height={fullSize}
          data={data.geqo.gen}
          map={data.for}
        />
      </div>
      <div ref={indivRef} className="w-1/4 grid grid-cols-1 gap-2 ml-6 mr-4">
        <Card>
          <QueryPlanTree width={indivSize} height={indivSize} plan={plan} />
        </Card>
        <Card>
          <EdgeRecomb width={indivSize} height={indivSize} data={data} />
        </Card>
      </div>
    </div>
  );
};

export default GeqoMain;

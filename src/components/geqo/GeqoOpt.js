import { useEffect, useRef, useState } from "react";
import CostChart from "./CostChart";
import FullView from "./FullView";
import EdgeRecomb from "./EdgeRecomb";
import JoinOrderTree from "./JoinOrderTree";
import { Card } from "@material-tailwind/react";

import "../../assets/stylesheets/Geqo.css";

const GeqoOpt = ({ title, data }) => {
  const viewRef = useRef(null);

  const chartRef = useRef(null);
  const fullRef = useRef(null);
  const indivRef = useRef(null);

  return (
    <div ref={viewRef}>
      <p className="text-bm mt-4">{title}</p>
      <hr className="my-1 border-2" />
      <div className="flex mt-2 mb-6">
        <div ref={chartRef} className="grid grid-cols-1 gap-2">
          <Card>
            <CostChart width={300} height={200} data={data.geqo.gen} />
          </Card>
          <Card>
            <JoinOrderTree
              width={300}
              height={300}
              data={data.geqo.reloptinfo}
            />
          </Card>
        </div>
        <div ref={fullRef} className="flex">
          <FullView
            width={550}
            height={550}
            data={data.geqo.gen}
            map={data.for}
          />
        </div>
        <div ref={indivRef} className="grid grid-cols-1 gap-2">
          <Card>
            <EdgeRecomb width={300} height={500} data={data} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeqoOpt;

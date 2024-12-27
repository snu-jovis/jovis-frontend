import { useRef } from "react";
import QueryPlanTree from "../geqo/QueryPlanTree";

const DpExplain = ({ title, data }) => {
  const viewRef = useRef(null);

  return (
    <div ref={viewRef}>
      <p className="text-bm">{title}</p>
      <hr className="my-1 border-2" />
      <QueryPlanTree plan={data} />
    </div>
  );
};

export default DpExplain;

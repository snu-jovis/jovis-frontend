import { useRef } from "react";
import ExplainTree from "./ExplainTree";

const Explain = ({ title, data }) => {
  const viewRef = useRef(null);

  data = JSON.stringify(data).replace(/"Plans":/g, '"children":');
  data = JSON.parse(data);

  const extractInitPlan = (plan) => {
    let initPlans = [];

    if (plan.children) {
      plan.children = plan.children.filter((child) => {
        if (child["Parent Relationship"] === "InitPlan" && child.children) {
          initPlans.push(child);
          return false;
        }
        return true;
      });

      plan.children.forEach((child) => {
        initPlans.push(...extractInitPlan(child));
      });
    }

    return initPlans;
  };

  const initPlans = extractInitPlan(data);

  return (
    <div className="mb-4" ref={viewRef}>
      <p className="text-bm">{title}</p>
      <hr className="my-1 border-2" />
      <div className="grid grid-cols-3 gap-4">
        <ExplainTree plan={data} />
        {initPlans.map((initPlan, index) => (
          <ExplainTree key={index} plan={initPlan} />
        ))}
      </div>
    </div>
  );
};

export default Explain;

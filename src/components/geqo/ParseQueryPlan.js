import { useEffect, useState } from "react";
import data from "../../data/plan";
import QueryPlanTree from "./QueryPlanTree";

function parseExpPostgreSQL(content, isCmp, fileIndex) {
  const regex = /\[(.*?)\](?=\s*\()/gs;
  let match = null;
  const plans = [];

  let i = 1;
  while ((match = regex.exec(content)) !== null) {
    // parse plan and remove every "+"
    let plan = match[1].replace(/\+/g, "");

    // d3의 계층구조 따르기 위해 "Plans"를 "children"으로 대체
    plan = plan.replace(/"Plans":/g, '"children":');
    plan = JSON.parse(plan);

    if (isCmp)
      plans.push({
        queryNumber: i,
        plan,
        fileIndex,
      });
    else plans.push(plan);

    i++;
  }

  return plans;
}

const ParseQueryPlan = ({ width, height }) => {
  const [queryPlans, setQueryPlans] = useState([]);

  useEffect(() => {
    const loadFiles = async (url) => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fileContent = await response.text();

      const planContents = parseExpPostgreSQL(fileContent, false, null);
      setQueryPlans([planContents]);
    };

    loadFiles(data);
  }, []);

  return (
    <>
      {queryPlans.length > 0 ? (
        <QueryPlanTree
          plan={queryPlans[0][0].Plan}
          width={width}
          height={height}
        />
      ) : null}
    </>
  );
};

export default ParseQueryPlan;

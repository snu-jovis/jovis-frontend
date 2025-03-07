import CostChart from "./CostChart";
import FullView from "./FullView";
import EdgeRecomb from "./EdgeRecomb";
import JoinOrderTree from "./JoinOrderTree";
import Rerun from "./Rerun";
import { Card } from "@material-tailwind/react";

import "../../assets/stylesheets/Geqo.css";

// TODO: selectedGene should be an array

const GeqoOpt = ({ title, data, submitQuery, addHistory }) => {
  const { query, database, opt } = data;

  // can GEQO have multiple optimization results?
  // if not, it's fine to use query.opt[0]
  const geqoData = opt[0].geqo;

  return (
    <div>
      <p className="text-bm mt-4">{title}</p>
      <hr className="my-1 border-2" />
      <div className="flex mt-2 mb-6">
        <div className="grid grid-cols-1 gap-2">
          <Card>
            <CostChart width={300} height={200} data={geqoData.gen} />
          </Card>
          <Card>
            <JoinOrderTree
              width={300}
              height={300}
              data={geqoData.reloptinfo}
            />
          </Card>
        </div>
        <div className="flex">
          <FullView
            width={450}
            height={450}
            data={geqoData.gen}
            map={opt[0].for}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Card className="w-[310px]">
            <Rerun
              query={query}
              database={database}
              data={geqoData}
              submitQuery={submitQuery}
              addHistory={addHistory}
            />
          </Card>
          <Card>
            <EdgeRecomb width={300} height={300} data={opt[0]} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeqoOpt;

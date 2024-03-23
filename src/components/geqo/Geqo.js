import { useContext, useState } from "react";
import GenCostChart from "./GenCostChart";
import GeneticAlgo from "./GeneticAlgo";
import ParseQueryPlan from "./ParseQueryPlan";
import RecombProcess from "./RecombProcess";
import JoinOrderTree from "./JoinOrderTree";
import { GeqoContext } from "../../contexts/GeqoContext";
import "../../assets/stylesheets/Geqo.css";

const Geqo = () => {
  const [showJoinOrder, setShowJoinOrder] = useState(true);
  const { mom } = useContext(GeqoContext);

  return (
    <div className="geqo-container">
      <div className="chart-container">
        <GenCostChart />
      </div>
      <div className="full-container">
        <GeneticAlgo />
      </div>
      <div className="indiv-container">
        <ParseQueryPlan />
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Show Join Order</span>
            <input
              type="checkbox"
              defaultChecked
              className="checkbox checkbox-sm"
              onChange={() => setShowJoinOrder(!showJoinOrder)}
              disabled={!mom}
            />
          </label>
        </div>
        {showJoinOrder ? <JoinOrderTree /> : <RecombProcess />}
      </div>
    </div>
  );
};

export default Geqo;

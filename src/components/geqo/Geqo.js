import GenCostChart from "./GenCostChart";
import GeneticAlgo from "./GeneticAlgo";
import ParseQueryPlan from "./ParseQueryPlan";
import RecombProcess from "./RecombProcess";
import "../../assets/stylesheets/Geqo.css";
import GeqoContextProvider from "../../contexts/GeqoContext";

const Geqo = () => {
  return (
    <GeqoContextProvider>
      <div className="geqo-container">
        <div className="chart-container">
          <GenCostChart />
        </div>
        <div className="full-container">
          <GeneticAlgo />
        </div>
        <div className="indiv-container">
          <ParseQueryPlan />
          <RecombProcess />
        </div>
      </div>
    </GeqoContextProvider>
  );
};

export default Geqo;

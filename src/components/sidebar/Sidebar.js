import { useContext, useEffect, useState } from "react";
import { Card } from "@material-tailwind/react";
import {
  BeakerIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  ServerStackIcon,
  Bars3Icon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

import "../../assets/stylesheets/Sidebar.css";

import ListAccordion from "./ListAccordion";
import QueriesAccordion from "./QueriesAccordion";
import { HistoryContext } from "../providers/HistoryProvider";
import { SqlToEditorContext } from "../providers/SqlToEditorProvider";

import presetQueries from "../../assets/data/queries.json";

function Sidebar(props) {
  const { history } = useContext(HistoryContext);
  const { call } = useContext(SqlToEditorContext);

  const [localHistory, setLocalHistory] = useState([]);

  useEffect(() => {
    setLocalHistory(history.map((item) => item.title));
  }, [history]);

  const onClickHandler = (type, val) => {
    if (type === "history") {
      if (history[val].db === "tpch") {
        call("tpch", history[val].query);
      } else if (history[val].db === "tpcds") {
        call("tpcds", history[val].query);
      } else if (history[val].db === "imdb") {
        call("job", history[val].query);
      } else {
        call(type, history[val].query);
      }
    } else if (type === "tpch") {
      call(type, presetQueries.tpch[(val + 1).toString()]);
    } else if (type === "tpcds") {
      call(type, presetQueries.tpcds[(val + 1).toString()]);
    } else if (type === "job") {
      call(type, presetQueries.job[val]);
    }
  };

  return (
    <Card className="main-card m-4 p-1 overflow-y-auto">
      {/* MainMenu 1: Queries */}
      <QueriesAccordion
        title="Queries"
        icon={<Bars3Icon className="h-6 w-6" />}
        defaultOpen={true}
      />

      {/* MainMenu 2: History */}
      <ListAccordion
        title="History"
        icon={<NewspaperIcon className="h-6 w-6" />}
        defaultOpen={true}
        data={localHistory}
        onClick={(d) => onClickHandler("history", d)}
      />

      {/* MainMenu 3: Presets */}
      <ListAccordion
        title="Presets"
        icon={<ServerStackIcon className="h-6 w-6" />}
        defaultOpen={true}
        children={
          <div>
            {/* SubMenu 3-1: TPC-H */}
            <ListAccordion
              title="TPC-H"
              icon={<QuestionMarkCircleIcon className="h-6 w-6" />}
              data={[...Array(22).keys()].map((i) => `Query ${i + 1}`)}
              onClick={(d) => onClickHandler("tpch", d)}
            />
            {/* SubMenu 3-2: TPC-DS */}
            <ListAccordion
              title="TPC-DS"
              icon={<BeakerIcon className="h-6 w-6" />}
              data={[...Array(99).keys()].map((i) => `Query ${i + 1}`)}
              onClick={(d) => onClickHandler("tpcds", d)}
            />
            {/* SubMenu 3-3: JOB on IMDB */}
            <ListAccordion
              title="JOB"
              icon={<VideoCameraIcon className="h-6 w-6" />}
              data={Object.keys(presetQueries.job).map((key) => `Query ${key}`)}
              onClick={(d) =>
                onClickHandler("job", Object.keys(presetQueries.job)[d])
              }
            />
          </div>
        }
      />
    </Card>
  );
}

export default Sidebar;

import { useContext, useEffect, useState } from "react";
import "../../assets/stylesheets/Sidebar.css";
import { Card } from "@material-tailwind/react";
import {
  BeakerIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";
import ListAccordion from "./ListAccordion";
import { HistoryContext } from "../providers/HistoryProvider";
import { SqlToEditorContext } from "../providers/SqlToEditorProvider";
import queries from "../../assets/data/queries.json";

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
      } else {
        call(type, history[val].query);
      }
    } else if (type === "tpch") {
      call(type, queries.tpch[(val + 1).toString()]);
    } else if (type === "tpcds") {
      call(type, queries.tpcds[(val + 1).toString()]);
    }
  };

  return (
    <Card className="main-card m-4 p-1 overflow-y-auto">
      {/* 메인 메뉴 1: History */}
      <ListAccordion
        title="History"
        icon={<NewspaperIcon className="h-6 w-6" />}
        defaultOpen={true}
        data={localHistory}
        onClick={(d) => onClickHandler("history", d)}
      />

      {/* 메인 메뉴 2: Presets */}
      <ListAccordion
        title="Presets"
        icon={<ServerStackIcon className="h-6 w-6" />}
        defaultOpen={true}
        children={
          <div>
            {/* 서브 메뉴 2-1: TPC-H */}
            <ListAccordion
              title="TPC-H"
              icon={<QuestionMarkCircleIcon className="h-6 w-6" />}
              data={[...Array(22).keys()].map((i) => `Query ${i + 1}`)}
              onClick={(d) => onClickHandler("tpch", d)}
            />
            {/* 서브 메뉴 2-2: TPC-DS */}
            <ListAccordion
              title="TPC-DS"
              icon={<BeakerIcon className="h-6 w-6" />}
              data={[...Array(99).keys()].map((i) => `Query ${i + 1}`)}
              onClick={(d) => onClickHandler("tpcds", d)}
            />
          </div>
        }
      />
      {/* <hr /> */}
    </Card>
  );
}

export default Sidebar;

import { useState } from "react";
import "../../assets/stylesheets/Sidebar.css";
import { Card } from "@material-tailwind/react";
import { BeakerIcon, NewspaperIcon, QuestionMarkCircleIcon, ServerStackIcon } from "@heroicons/react/24/outline";
import ListAccordion from "./ListAccordion";

function Sidebar(props) {

  return (
    <Card className="main-card m-4 p-1 overflow-y-auto">
      {/* 메인 메뉴 1: History */}
      <ListAccordion 
        title="History" 
        icon={<NewspaperIcon className="h-6 w-6" />} 
        defaultOpen={true}
        data={["SELECT * FROM Reserves", "SELECT * FROM Sailers"]}
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
              />
            {/* 서브 메뉴 2-2: TPC-DS */}
            <ListAccordion 
              title="TPC-DS" 
              icon={<BeakerIcon className="h-6 w-6" />} 
              data={[...Array(99).keys()].map((i) => `Query ${i + 1}`)}
              />
          </div>
        } />
      {/* <hr /> */}
    </Card>
  );
}

export default Sidebar;

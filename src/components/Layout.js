import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import Dp from "./dp/Dp";
import Geqo from "./geqo/Geqo";
import SQLEditor from "./SQLEditor";
import React, { useState } from "react";
import "../App.css";

function Layout() {
  const [useGeqo, setUseGeqo] = useState(false);

  return (
    // <div>
    //   <Header />
    //   <div className="main-container">
    //     <Sidebar/>
    //     <SQLEditor/>
    //     useGeqo ? <Geqo/> : <Dp/>
    //   </div>
    // </div>

    <div className="flex flex-col h-full">
      <Header />
      <div className="main-container grow">
        <Sidebar />
        <div className="view-container"></div>
      </div>
    </div>
  );
}

export default Layout;

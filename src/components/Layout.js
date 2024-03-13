import Header from "./Header";
import Sidebar from "./Sidebar";
import Dp from "./dp/Dp";
import Geqo from "./geqo/Geqo";
import SQLEditor from "./SQLEditor";
import React, { useState } from "react";
import "../App.css";

function Layout() {
  const [useGeqo, setUseGeqo] = useState(false);

  return (
    <div>
      <Header />
      <div className="main-container">
        <Sidebar/>
        <SQLEditor/>
        useGeqo ? <Geqo/> : <Dp/>
      </div>
    </div>
  );
}

export default Layout;

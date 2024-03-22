import Header from "./Header";
import Sidebar from "./Sidebar";
import SQLEditor from "./SQLEditor";
import Dp from "./dp/Dp";
import Geqo from "./geqo/Geqo";
import { useState } from "react";
import "../App.css";

function Layout() {
  const [useGeqo, setUseGeqo] = useState(true);

  return (
    <div>
      <Header />
      <div className="main-container">
        {/* <Sidebar /> */}
        {/* <SQLEditor /> */}
        {useGeqo ? <Geqo /> : <Dp />}
      </div>
    </div>
  );
}

export default Layout;

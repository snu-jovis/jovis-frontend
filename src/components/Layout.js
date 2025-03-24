import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import MainView from "./MainView";

function Layout() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex justify-center">
        <Sidebar />
        <MainView />
      </div>
    </div>
  );
}

export default Layout;

import { Outlet } from "react-router-dom";
import { Header, SideNav } from "./components";
import { SideNavContextProvider } from "./contexts";
function App() {
  return (
    <>
      <SideNavContextProvider>
        <div className="dark:bg-black dark:text-white h-16 w-full">
          <Header />
        </div>
        <div className="dark:bg-black dark:text-white flex-grow flex">
          <div className="w-auto min-h-screen">
            <SideNav />
          </div>
          <div className="flex-grow">
            <Outlet />
          </div>
        </div>
      </SideNavContextProvider>
    </>
  );
}

export default App;

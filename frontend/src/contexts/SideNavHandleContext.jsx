import { useContext, createContext, useState } from "react";
const SideNavContext = createContext();

export const useSideNav = () => {
  return useContext(SideNavContext);
};

const SideNavContextProvider = ({ children }) => {
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNavActive = () => {
    setIsNavActive((prev) => !prev);
  };

  return (
    <SideNavContext.Provider value={{ isNavActive, toggleNavActive }}>
      {children}
    </SideNavContext.Provider>
  );
};

export default SideNavContextProvider;

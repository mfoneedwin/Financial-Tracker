import { useEffect } from "react";
import { hasAdd } from "../lib/constants";
import { Outlet, useLocation } from "react-router-dom";
import AddButton from "../components/AddButton";
import Navigation from "../components/Navigation";

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="app">
      <Navigation />
      <div className="app-container">
        {hasAdd.includes(pathname) && <AddButton />}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

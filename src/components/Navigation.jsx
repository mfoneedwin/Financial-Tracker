import React from "react";

import { Link, useLocation } from "react-router-dom";
import pages from "../lib/pages";

const Navigation = () => {
  const { pathname } = useLocation();

  const getActive = (path) => {
    if (pathname.includes(path)) {
      if (pathname === "/" && path === "/") return true;
      if (pathname !== "/" && path !== "/") return true;
    }
    return false;
  };

  return (
    <div className="navigation">
      <div className="navigation-container">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`${
              getActive(page.path) ? "active" : ""
            } navigation-container-item`}
          >
            <Link to={page.path}>
              {page.icon}
              <span>{page.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navigation;

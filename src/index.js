import React from "react";
import ReactDOM from "react-dom/client";

import { AuthContextProvider } from "./context/AuthContext";
import { DataContextProvider } from "./context/DataContext";
import App from "./App";

import "./styles/style.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <DataContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </DataContextProvider>
  </React.StrictMode>
);

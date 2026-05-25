import React from "react";
import ReactDOM from "react-dom/client";
import "./dashboard.css";
import Dashboard from "./Dashboard";

ReactDOM.createRoot(
  document.getElementById("dashboard-root")
).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
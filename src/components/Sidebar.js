import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <nav className={sidebar ? "sidebar active" : "sidebar"}>
      <button className="hamburger" type="button" onClick={showSidebar}>
        <div></div>
      </button>
      <ul onClick={showSidebar} style={{display: "block"}}>
        <li style={{backgroundColor: "orange"}}><Link to="/">Home</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/customers">Customers</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/suppliers">Suppliers</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/employees">Employees</Link></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
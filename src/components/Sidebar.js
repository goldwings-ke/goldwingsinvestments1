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
      <ul onClick={showSidebar} style={{columns: "2"}}>
        <li style={{backgroundColor: "orange"}}><Link to="/">Home</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/customers">Customers</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/invoices">Invoices</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/suppliers">Suppliers</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/employees">Employees</Link></li>
         <li style={{backgroundColor: "orange"}}><Link to="/inventory">Inventory</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/itemsnoninventory">Items</Link></li>
        <li style={{backgroundColor: "orange"}}><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
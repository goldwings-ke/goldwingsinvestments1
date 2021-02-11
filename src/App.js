import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./components/About";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import Suppliers from "./pages/Suppliers";
import Employees from "./pages/Employees";
import ItemsNonInventory from "./pages/ItemsNonInventory";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings"
import Sidebar from "./components/Sidebar";
import "./mystyle.css";

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/customers" component={Customers} />
          <Route path="/invoices" component={Invoices} />
          <Route path="/suppliers" component={Suppliers} />
          <Route path="/employees" component={Employees} />
          <Route path="/itemsnoninventory" component={ItemsNonInventory} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Router>
    </>
  );
}

export default App;

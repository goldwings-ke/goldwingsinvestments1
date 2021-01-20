import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Employees from "./pages/Employees";
import ItemsNonInventory from "./pages/ItemsNonInventory"
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/customers" component={Customers} />
          <Route path="/suppliers" component={Suppliers} />
          <Route path="/employees" component={Employees} />
          <Route path="/itemsnoninventory" component={ItemsNonInventory} />
        </Switch>
      </Router>
    </>
  );
}

export default App;

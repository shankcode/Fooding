//----- Requiring Modules ---------//
import React, { Component } from "react";

import "./App.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-grid.css";

//--- Requiring Routes ------//
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Navbar />
        <Home />
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import "./Navbar.css";

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-sm navbar-light bg-danger navigation-bar">
        <a className="navbar-brand text-center w-100" href="/">
          <h1>~ Fooding ~</h1>
        </a>
      </nav>
    );
  }
}

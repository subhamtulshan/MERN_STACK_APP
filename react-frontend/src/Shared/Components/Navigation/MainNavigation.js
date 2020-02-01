import React, { useState } from "react";
import MainHeader from "./MainHeader";
import { Link, withRouter } from "react-router-dom";
import "./MainNavigation.css";
import Navlinks from "../Navigation/NavLinks";
import Sidedrawer from "../Navigation/SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = () => {
  const [SidedrawerOpen, setSidedrawerOpen] = useState(false);
  const openDrawer = () => {
    setSidedrawerOpen(true);
  };
  const closeDrawer = () => {
    setSidedrawerOpen(false);
  };
  return (
    <React.Fragment>
      {SidedrawerOpen && <Backdrop onClick={closeDrawer}></Backdrop>}

      <Sidedrawer show={SidedrawerOpen} onClick={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <Navlinks></Navlinks>
        </nav>
      </Sidedrawer>

      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlace</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <Navlinks></Navlinks>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default withRouter(MainNavigation);

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../../Context/Auth_Context";

const Navlinks = () => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={"/" + auth.userId + "/places"}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Places</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && <button onClick={auth.logout}>Logout</button>}
    </ul>
  );
};

export default Navlinks;

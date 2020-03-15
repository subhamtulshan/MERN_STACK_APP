import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import Users from "./Users/Pages/Users";
import NewPlace from "./Places/Pages/NewPlaces";
import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import UserPlaces from "./Places/Pages/UserPlaces";
import UpdatePlace from "./Places/Pages/UpdatePlaces";
import AuthUser from "./Users/Pages/Auth";
import { AuthContext } from "./Context/Auth_Context";
import { AuthHooks } from "./Hooks/Auth-hooks";

const App = () => {
  const [login, logout, token, userId] = AuthHooks();
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces></UserPlaces>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace></UpdatePlace>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces></UserPlaces>
        </Route>
        <Route path="/auth" exact>
          <AuthUser></AuthUser>
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId
      }}
    >
      <Router>
        <MainNavigation></MainNavigation>
        <main className="main">{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

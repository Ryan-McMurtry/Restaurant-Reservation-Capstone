import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import CreateReservation from "../reservations/CreateReservation";
import NewTable from "../tables/NewTable";
import Search from "../search/Search";
import Seat from "../seats/Seat";
import Edit from "../edit/Edit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Edit />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

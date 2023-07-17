import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import findDate from "./findDate";
import Table from "../tables/Table";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [dateAugment, setDateAugment] = useState(0);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const loadDashboard = () => {
    const abortController = new AbortController();
    const date = findDate(dateAugment);
    console.log(date);
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  const loadTables = () => {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  };

  const loadBoth = () => {
    const abortController = new AbortController();
    loadDashboard();
    loadTables();
    return () => abortController.abort();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadBoth, [dateAugment]);

  const buttonSetDate = (event) => {
    event.preventDefault();
    const buttonText = event.target.innerHTML;
    switch (buttonText) {
      case "Previous":
        setDateAugment((state) => state - 1);
        break;
      case "Today":
        setDateAugment(0);
        break;
      case "Next":
        setDateAugment((state) => state + 1);
        break;
      default:
        break;
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {findDate(dateAugment)}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <div className="reservations">
        <Reservation reservations={reservations} />
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={buttonSetDate}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={buttonSetDate}
          >
            Today
          </button>
          <button
            type="button "
            className="btn btn-primary"
            onClick={buttonSetDate}
          >
            Next
          </button>
        </div>
      </div>
      <ErrorAlert error={tablesError} />
      <div className="tables mt-5">
        <Table tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;

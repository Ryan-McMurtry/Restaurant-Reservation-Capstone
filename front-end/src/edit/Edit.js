import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../reservations/ReservationForm";

function Edit() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [resError, setResError] = useState(null);

  const loadReservation = () => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setResError);
    return () => abortController.abort();
  };

  useEffect(loadReservation, [reservation_id]);

  return (
    <div>
      <ErrorAlert error={resError} />
      {reservation ? (
        <ReservationForm reservation={reservation} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Edit;

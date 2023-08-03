import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import NewReservation from "../reservations/NewReservation";

function Edit() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [resError, setResError] = useState(null);

  const loadReservation = async () => {
    const abortController = new AbortController();
    try {
      const response = await readReservation(
        reservation_id,
        abortController.signal
      );
      setReservation(response);
    } catch (error) {
      setResError(error);
    }
    return () => abortController.abort();
  };

  useEffect(loadReservation, [reservation_id]);

  return (
    <div>
      <ErrorAlert error={resError} />
      {reservation ? (
        <NewReservation reservation={reservation} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Edit;

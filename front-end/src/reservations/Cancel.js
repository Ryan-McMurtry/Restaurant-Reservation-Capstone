import { useHistory } from "react-router-dom";
import { updateStatus } from "../utils/api";

export default function Cancel({ reservation_id }) {
  const history = useHistory();

  async function handleClick() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      await updateStatus(
        reservation_id,
        "cancelled",
        abortController.signal
      );
      history.push("/");

      return () => abortController.abort();
    }
  };

  return (
    <button
      data-reservation-id-cancel={reservation_id}
      className="btn btn-danger m-1 p-4"
      onClick={() => handleClick(reservation_id)}
    >
      Cancel
    </button>
  );
}

import Cancel from "../reservations/Cancel";
import { Link } from "react-router-dom";

function Reservation({ reservations }) {
  return (
    <table className=" table text-center">
      <thead>
        <tr>
          <th scope="col" className="border p-4">
            First Name
          </th>
          <th scope="col" className="border p-4">
            Last Name
          </th>
          <th scope="col" className="border p-4">
            Mobile Number
          </th>
          <th scope="col" className="border p-4">
            Reservation Day
          </th>
          <th scope="col" className="border p-4">
            Reservation Time
          </th>
          <th scope="col" className="border p-4">
            Number of People
          </th>
          <th scope="col" className="border p-4">
            Status
          </th>
          <th scope="col" className="border p-4">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {reservations.map(
          ({
            reservation_id,
            first_name,
            last_name,
            mobile_number,
            reservation_date,
            reservation_time,
            people,
            status,
          }) => {
            if (status !== "finished") {
              return (
                <tr key={reservation_id}>
                  <td className="border p-4">{first_name}</td>
                  <td className="border p-4">{last_name}</td>
                  <td className="border p-4">{mobile_number}</td>
                  <td className="border p-4">{reservation_date}</td>
                  <td className="border p-4">{reservation_time}</td>
                  <td className="border p-4">{people}</td>
                  <td className="border p-4">{status}</td>
                  <td>
                    {status === "booked" ? (
                      <div className="col">
                        <Link
                          to={{
                            pathname: `/reservations/${reservation_id}/edit`,
                          }}
                        >
                          <button className="btn btn-primary m-1 p-4">
                            Edit
                          </button>
                        </Link>
                        <Link
                          to={{
                            pathname: `/reservations/${reservation_id}/seat`,
                          }}
                        >
                          <button className="btn btn-primary m-1 p-4">
                            Seat
                          </button>
                        </Link>
                        <Cancel reservation_id={reservation_id} />
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            }
            return null;
          }
        )}
      </tbody>
    </table>
  );
}

export default Reservation;

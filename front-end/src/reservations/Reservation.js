import { useHistory } from "react-router-dom";

function Reservation({ reservations }) {
  const history = useHistory();
  // const mockData = {
  //   first_name: "derm",
  //   last_name: "werm",
  //   mobile_number: "8080000000",
  //   reservation_date: "12/25/1990",
  //   reservation_time: "4:00",
  //   people: 2,
  //   status: "booked",
  // };

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
                      <div classname="col">
                        <a
                          className="btn btn-primary m-1 p-4"
                          href=""
                          role="button"
                        >
                          Edit
                        </a>
                        <a
                          className="btn btn-primary m-1 p-4"
                          href=""
                          role="button"
                        >
                          Seat
                        </a>
                        <button
                          type="button"
                          className="btn btn-danger m-1 p-4"
                          onClick={console.log("cancelled")}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
          }
        )}
      </tbody>
    </table>
  );
}

export default Reservation;

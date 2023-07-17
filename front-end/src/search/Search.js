import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation"


const phoneNumber = (mobile_phone) => {
    mobile_phone = mobile_phone.toString();
    const areaCode = mobile_phone.slice(0, 3);
    const firstPart = mobile_phone.slice(3, 6);
    const secondPart = mobile_phone.slice(6, 10);
    return areaCode + "-" + firstPart + "-" + secondPart;
}

function Search(){
    const [mobile_phone, setMobile_phone] = useState("");
    const [data, setData] = useState([]);
    const [searchError, setSearchError] = useState(null);
    

    const searchHandler = (event) => {
        event.preventDefault();
        if(mobile_phone !== ""){
            const abortController = new AbortController();
            const mobile_number = phoneNumber(mobile_phone);
            listReservations({ mobile_number }, abortController.signal)
            .then(setData)
            .catch(setSearchError)

            return () => abortController.abort()
        }
    }

    return(
        <div>
            <h1>Search</h1>
            <ErrorAlert error={searchError} />
            <form className="d-flex" onSubmit={searchHandler}>
                <div className="form-group mb-2 mr-1 col-6">
                    <input
                    type="number"
                    className="form-control"
                    name="mobile_number"
                    id="mobile_number"
                    placeholder="Enter a customer's phone number"
                    value={mobile_phone}
                    onChange={event => setMobile_phone(event.target.value)}
                    />
                </div>
                <button type="submit" classname="btn btn-info mb-2 ml-1">Search</button>
            </form>
            {data.length > 0 ? <Reservation reservations={data} /> : <h3>No reservations found</h3>}
        </div>
    )


}


export default Search;
const knex = require("../db/connection");

const list = (reservation_date) => {
    
    if(reservation_date) {
        const exp = knex("reservations")
        .where({ reservation_date, status: "booked" })
        .orderBy("reservation_time");
        
        return exp
    }
}

const create = (newReservation) => {
    return (
      knex("reservations")
        .insert(newReservation, "*")
        .then((createdReservations) => createdReservations[0])
    );

}


module.exports = {
    list,
    create
}
const knex = require("../db/connection");

const list = (reservation_date) => {
    if(reservation_date) {
        return knex("reservations")
        .where({ reservation_date, status: "booked" })
        .orderBy("reservation_time");
    }
}


module.exports = {
    list
}
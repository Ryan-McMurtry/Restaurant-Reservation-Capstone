const reservationService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function list(req, res) {
  const { date } = req.query
  const data = await reservationService.list(date);
  res.json({data});
}

const create = async(req, res) => {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  const reservationData = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status: "booked",
  };
  const newReservation = await reservationService.create(reservationData)
  res.status(201).json({ data: newReservation })
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)]
};

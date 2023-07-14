const reservationService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Validations

async function dataExists(req, res, next) {
  if (req.body.data) {
    return next();
  } else {
    return next({
      message: "Body of Data does not exist",
      status: 400,
    });
  }
}

async function reservationIdExists(req, res, next){
  const { reservation_id } = req.params;
  const reservationData = await reservationService.read(Number(reservation_id));
  if(reservation_id && reservation_id !== "" && reservationData){
    res.locals.reservation = reservationData;
    return next();
  } else{
    return next({
      message: `The reservation with reservation id: ${reservation_id} does not exist`,
      status: 404,
    })
  }
}

async function firstNameExists(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { first_name } = req.body.data;
  if (first_name && first_name !== "") {
    return next();
  } else {
    return next({
      message: "Body of Data must contain first_name",
      status: 400,
    });
  }
}

async function lastNameExists(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { last_name } = req.body.data;
  if (last_name && last_name !== "") {
    return next();
  } else {
    return next({
      message: "Body of Data must contain last_name",
      status: 400,
    });
  }
}

async function mobileNumberExists(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { mobile_number } = req.body.data;
  if (mobile_number && mobile_number !== "") {
    return next();
  } else {
    return next({
      message: "Body of Data must contain mobile_number",
      status: 400,
    });
  }
}

async function peopleExists(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { people } = req.body.data;
  if (people && typeof people === "number" && people > 0) {
    return next();
  } else {
    return next({
      message: "Body of Data must contain a number of people",
      status: 400,
    });
  }
}

async function reservationDateExists(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { reservation_date } = req.body.data;
  const dateExpression = new RegExp(
    /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
  );

  if (
    reservation_date &&
    reservation_date !== "" &&
    reservation_date.match(dateExpression)
  ) {
    return next();
  } else {
    return next({
      message: "Body of Date must contain reservation_date",
      status: 400,
    });
  }
}

async function reservationTimeExists(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { reservation_time } = req.body.data;
  const timeExpression = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  if (
    reservation_time &&
    reservation_time !== "" &&
    reservation_time.match(timeExpression)
  ) {
    return next();
  } else {
    return next({
      message: "Body of Data must contain reservation_time",
      status: 400,
    });
  }
}

async function pastReservation(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { reservation_date } = req.body.data;
  const today = new Date();
  const dateString = reservation_date.split("-");
  const reservationDate = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );

  if (reservationDate > today) {
    return next();
  } else {
    return next({
      message: "A reservation must be made for the future",
      status: 400,
    });
  }
}

async function reservationOnTuesday(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { reservation_date } = req.body.data;
  const dateString = reservation_date.split("-");
  const reservationDate = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (reservationDate.getDay() === 2) {
    return next({
      message: "Sorry, we are closed on Tuesdays",
      status: 400,
    });
  }
  return next();
}

async function reservationIsDuringBusinessHours(req, res, next) {
  if (req.params.reservation_option === "status") {
    return next();
  }
  const { reservation_time } = req.body.data;
  const timeArray = reservation_time.split(":");
  const hour = Number(timeArray[0]);
  const minute = Number(timeArray[1]);
  // console.log(hour);
  if (hour >= 10) {
    if (hour === 10) {
      if (minute >= 30) {
        return next();
      }
    }
    if (hour <= 21) {
      if (hour === 21) {
        if (minute <= 30) {
          return next();
        }
      }
      return next();
    }
  }
  if (hour <= 10 && minute < 30) {
    return next({
      message: "Sorry we are not open yet",
      status: 400,
    });
  }
  return next({
    message: "Seating ends at 9:30 PM.",
    status: 400,
  });
}

//CRUDL
async function list(req, res) {
  const { date } = req.query;
  const data = await reservationService.list(date);
  // console.log(data)
  res.json({ data });
}

const create = async (req, res) => {
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
  const newReservation = await reservationService.create(reservationData);
  // console.log(newReservation)
  res.status(201).json({ data: newReservation });
};

async function read(req, res){
  res.status(200).json({data: res.locals.reservation})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(firstNameExists),
    asyncErrorBoundary(lastNameExists),
    asyncErrorBoundary(mobileNumberExists),
    asyncErrorBoundary(peopleExists),
    asyncErrorBoundary(reservationDateExists),
    asyncErrorBoundary(reservationTimeExists),
    asyncErrorBoundary(pastReservation),
    asyncErrorBoundary(reservationOnTuesday),
    asyncErrorBoundary(reservationIsDuringBusinessHours),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationIdExists), asyncErrorBoundary(read)]
};

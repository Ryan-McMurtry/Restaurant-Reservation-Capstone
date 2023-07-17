const tableService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//VALIDATIONS

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const data = await tableService.read(table_id);

  if (data) {
    res.locals.table = data;
    return next();
  } else {
    return next({
      message: `Table ${table_id} does not exist`,
      status: 404,
    });
  }
}

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

async function tableNameExists(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name && table_name !== "" && table_name.length > 1) {
    return next();
  } else {
    return next({
      message: "table_name cannot be empty or one letter",
      status: 400,
    });
  }
}

async function reservationIdExists(req, res, next) {
  const { reservation_id } = req.body.data;

  if (
    reservation_id &&
    reservation_id !== "" &&
    reservation_id == Number(reservation_id) &&
    reservation_id > 0
  ) {
    const reservation = await tableService.readRes(reservation_id);
    if (reservation) {
      if ("status" in reservation) {
        if (reservation.status === "seated") {
          return next({
            message: "Reservation is already seated",
            status: 400,
          });
        }
      }
      res.locals.reservation = reservation;
      return next();
    } else {
      return next({
        message: `Reservation ${reservation_id} does not exist.`,
        status: 404,
      });
    }
  } else {
    return next({
      message: "Please enter an existing reservation_id",
      status: 400,
    });
  }
}

async function capacityExists(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity && typeof capacity == "number" && capacity > 0) {
    return next();
  } else {
    return next({
      message: "The table must have a capacity greater than zero",
      status: 400,
    });
  }
}

async function validateCapacity(req, res, next) {
  const { table_option } = req.params;
  const { people } = res.locals.reservation;
  const { status, capacity } = res.locals.table;
  if (table_option === "seat") {
    if (status === "free") {
      if (capacity >= people) {
        return next();
      } else {
        return next({
          message:
            "This table does not have the capacity to seat that many people",
          status: 400,
        });
      }
    } else {
      return next({
        message: "This table is occupied",
        status: 400,
      });
    }
  } else {
    return next({
      message: "Invalid Path",
      status: 404,
    });
  }
}


async function notOccupied(req, res, next){
  const { status } = res.locals.table;
  if(status === "occupied"){
    return next();
  } else{
    return next({
      message: "Table is not occupied",
      status: 400
    })
  }
}

//CRUDL
async function list(req, res) {
  const response = await tableService.list();
  res.status(200).json({ data: response });
}

async function create(req, res) {
  const { table_name, capacity } = req.body.data;
  const newTable = {
    table_name: table_name,
    capacity: capacity,
    status: "free",
  };
  const createdTable = await tableService.create(newTable);
  res.status(201).json({ data: createdTable });
}

async function read(req, res) {
  res.json({ data: res.locals.table });
}

async function update(req, res) {
  const { reservation_id } = req.body.data;
  const { table_name, capacity } = res.locals.table;
  const { table_id } = req.params;
  const tableUpdate = {
    table_id,
    table_name,
    capacity,
    status: "occupied",
    reservation_id,
  };

  const reservationUpdate = { ...res.locals.reservation, status: "seated" };
  const updatedTable = await tableService.update(
    tableUpdate,
    reservationUpdate
  );
  
  res.json({ data: updatedTable });
}

async function destroy(req, res){
  const { reservation_id } = res.locals.table;
  const newTable = {
    ...res.locals.table,
    status: "free",
  };
  const reservation = await tableService.readRes(reservation_id)
  const updatedReservation = {
    ...reservation,
    status: "finished",
  }
  const openedTable = await tableService.destroy(newTable, updatedReservation);
  res.status(200).json({ data: openedTable })
}

module.exports = {
  create: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(tableNameExists),
    asyncErrorBoundary(capacityExists),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(notOccupied),
    asyncErrorBoundary(destroy),
  ],
  list: [asyncErrorBoundary(list)],
};

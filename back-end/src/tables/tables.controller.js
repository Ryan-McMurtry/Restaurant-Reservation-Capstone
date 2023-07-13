const tableService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//VALIDATIONS

async function tableExists(req, res, next){
    const { table_id } = req.params;
    const data = await tableService.read(Number(table_id));
    if(data) {
        res.locals.table = data;
        return next();
    } else {
        return next({
            message: `Table ${table_id} does not exist`,
            status: 404
        });
    }
};

async function dataExists(req, res, next) {
  if (req.body.data) {
    return next();
  } else {
    return next({
      message: "Body of Data does not exist",
      status: 400,
    });
  }
};


async function tableNameExists(req, res, next){
    const { table_name } = req.body.data;
    if(table_name && table_name !== "" && table_name.length > 1){
        return next();
    } else{
        return next({
            message: "table_name cannot be empty or one letter",
            status: 400
        });
    };
};

async function validateCapacity(req, res, next){
    const { table_option } = req.params;
    const { people } = res.locals.reservation;
    const { status, capacity } = res.locals.table;
    if(table_option === "seated") {
        if(status === "open"){
            if(capacity >= people){
                return next();
            } else {
                return next({
                    message: "This table does not have the capacity to seat that many people",
                    status: 400
                });
            }
        } else {
            return next({
                message: "This table is occupied",
                status: 400
            });
        }
    } else {
        return next({
            message: "Invalid Path",
            status: 404
        });
    }
};


//CRUDL
async function list(req, res){
    const response = await tableService.list();
    res.status(200).json({ data: response })
}

async function create(req, res){
    const { table_name, capacity } = req.body.data;
    const newTable = {
        table_name: table_name,
        capacity: capacity,
        status: "open",
    };
    const createdTable = await tableService.create(newTable);
    res.status(201).json({ data: createdTable })
}

async function read(req, res) {
    res.json({ data: res.locals.table })
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
        reservation_id
    }

    const reservationUpdate = {...res.locals.reservation, status: "seated"};
    const updatedTable = await tableService.update(tableUpdate , reservationUpdate);
    res.json({ data: updatedTable });
}

module.exports = {
  create: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(tableNameExists),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(update),
  ],
  list: [asyncErrorBoundary(list)],
};

const tableService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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
    list: [asyncErrorBoundary(list)],
    create: [asyncErrorBoundary(create)],
    read: [asyncErrorBoundary(read)],
    update: [asyncErrorBoundary(update)]
}

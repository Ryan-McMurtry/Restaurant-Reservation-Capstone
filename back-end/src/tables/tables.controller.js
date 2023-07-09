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

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [asyncErrorBoundary(create)]
}

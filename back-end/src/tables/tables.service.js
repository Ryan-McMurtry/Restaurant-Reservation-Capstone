const knex = require("../db/connection");

const list = () => {
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

const create = (newTable) => {
    return knex("tables")
    .insert(newTable, "*")
    .then((createdTable) => createdTable[0])
}

module.exports ={
    list,
    create
}
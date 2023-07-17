const knex = require("../db/connection");


const readAll = (table_id) => {
    return knex("tables")
    .join("reservations", "tables.reservation_id", "reservations.reservation_id")
    .where({table_id})
}
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

const read = (table_id) => {
    return knex("tables")
    .select("*")
    .where({table_id})
    .first();
}

const readRes = (reservation_id) => {
    return knex("reservations")
    .where({reservation_id})
    .first();
}

const readCapacity = (capacity, table_id) => {
    return knex("tables")
    .where({capacity})
    .where({table_id})
}

const update = async(updatedTable, updatedReservation) => {
    
    const {table_id, reservation_id} = updatedTable;
    await knex("tables")
    .where({table_id})
    .update(updatedTable, "*")
    
    await knex("reservations")
    .where({reservation_id})
    .update(updatedReservation, "*")
    
    return read(table_id)
}

const destroy = async(openedTable, finishedReservation) => {
    const { table_id } = openedTable;
    const { reservation_id } = finishedReservation;
    await knex("tables")
    .where({table_id})
    .update(openedTable, "*")

    await knex("reservations")
    .where({reservation_id})
    .update(finishedReservation, "*")

    return readAll(table_id)
} 

module.exports ={
    list,
    create,
    read,
    update,
    readRes,
    readCapacity,
    destroy
}
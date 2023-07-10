const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


router
.route("/")
.get(controller.list)
.put(controller.create)
.all(methodNotAllowed)

module.exports = router;
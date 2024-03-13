const express = require("express");
const pool = require("../../config/database");
const pl = require("path-logger");

const route = express.Router();

//POST PAYMENT
route.post("/", async (req, res) => {
  paymentByInput = !req.body.payment_by ? "" : req.body.payment_by;
  paymentRefInput = !req.body.payment_ref ? "" : req.body.payment_ref;
  paymentIdInput = !req.body.payment_id ? "" : req.body.payment_id;

  if (paymentByInput == "" || paymentRefInput == "" || paymentIdInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `payment` WHERE `payment_id` = ? LIMIT 1;",
      [paymentIdInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Bookmark name already exists" });
    } else {
      await pool.execute(
        "INSERT INTO `payment` (`payment_by`, `payment_ref`, `payment_id`, `created_date`, `updated_date`) VALUE (?,?,?,NOW(),NOW());",
        [paymentByInput, paymentRefInput, paymentIdInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL PAYMENT
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query("SELECT * FROM `payment`;");
  res.send(rows);
  pl.log(req, res);
});

//GET PAYMENT BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT * FROM `payment` WHERE `id`= ? LIMIT 1;",
    [inpParamId]
  );
  if (rows.length < 1) {
    res.status(404).send({ status: "Fail", msg: "Not found" });
    pl.log(req, res, "ID Not found");
  } else {
    res.send(rows[0]);
    pl.log(req, res);
  }
});

//PUT PAYMENT BY ID
route.put("/:id", async (req, res) => {
  paymentByInput = !req.body.payment_by ? "" : req.body.payment_by;
  paymentRefInput = !req.body.payment_ref ? "" : req.body.payment_ref;
  inpParamId = req.params.id;
  if (paymentByInput == "" || paymentRefInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `payment` SET `payment_by` = ?, `payment_ref` = ? WHERE `id`= ?;",
      [paymentByInput, paymentRefInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE PAYMENT BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `payment` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;

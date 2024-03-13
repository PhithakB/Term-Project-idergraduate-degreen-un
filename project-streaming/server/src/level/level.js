const express = require("express");
const pool = require("../../config/database");
const pl = require("path-logger");

const route = express.Router();

//POST LEVEL
route.post("/", async (req, res) => {
  levelIdInput = !req.body.level_id ? "" : req.body.level_id;
  levelNameInput = !req.body.level_name ? "" : req.body.level_name;
  priceInput = !req.body.price ? "" : req.body.price;

  if (levelIdInput == "" || levelNameInput == "" || priceInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `level` WHERE `level_id` = ? LIMIT 1;",
      [levelIdInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Level ID already exists" });
    } else {
      await pool.execute(
        "INSERT INTO `level` (`level_id`, `level_name`, `price`) VALUE (?,?,?);",
        [levelIdInput, levelNameInput, priceInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL LEVEL
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query(
    "SELECT * FROM `level`;"
  );
  res.send(rows);
  pl.log(req, res);
});

//GET LEVEL BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT * FROM `level` WHERE `id`= ? LIMIT 1;",
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

//PUT LEVEL BY ID
route.put("/:id", async (req, res) => {
  inpParamId = req.params.id;
  levelIdInput = !req.body.level_id ? "" : req.body.level_id;
  levelNameInput = !req.body.level_name ? "" : req.body.level_name;
  priceInput = !req.body.price ? "" : req.body.price;
  if (levelIdInput == "" || levelNameInput == "" || priceInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `level` SET `level_id` = ? ,`level_name` = ?, `price` = ? WHERE `id`= ?;",
      [levelIdInput, levelNameInput, priceInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE LEVEL BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `level` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;
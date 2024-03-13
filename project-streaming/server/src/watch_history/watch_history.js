const express = require("express");
const pool = require("../../config/database");
const pl = require("path-logger");

const route = express.Router();

//POST WATCH HISTORY
route.post("/", async (req, res) => {
  watchHistoryByInput = !req.body.watch_history_by ? "" : req.body.watch_history_by;
  watchHistoryNameInput = !req.body.watch_history_name ? "" : req.body.watch_history_name;

  if (watchHistoryByInput == "" || watchHistoryNameInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `watch_history` WHERE `watch_history_name` = ? LIMIT 1;",
      [watchHistoryNameInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Watch history name already exists" });
    } else {
      await pool.execute(
        "INSERT INTO `watch_history` (`watch_history_by`, `watch_history_name`, `created_date`, `updated_date`) VALUE (?,?,NOW(),NOW());",
        [watchHistoryByInput, watchHistoryNameInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL WATCH HISTORY
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query("SELECT * FROM `watch_history`;");
  res.send(rows);
  pl.log(req, res);
});

//GET WATCH HISTORY BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT * FROM `watch_history` WHERE `id`= ? LIMIT 1;",
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

//PUT WATCH HISTORY BY ID
route.put("/:id", async (req, res) => {
  watchHistoryByInput = !req.body.watch_history_by ? "" : req.body.watch_history_by;
  watchHistoryNameInput = !req.body.watch_history_name ? "" : req.body.watch_history_name;
  inpParamId = req.params.id;
  if (watchHistoryByInput == "" || watchHistoryNameInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `watch_history` SET `watch_history_by` = ?, `watch_history_name` = ? WHERE `id`= ?;",
      [watchHistoryByInput, watchHistoryNameInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE WATCH HISTORY BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `watch_history` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;

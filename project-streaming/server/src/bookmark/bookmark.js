const express = require("express");
const pool = require("../../config/database");
const pl = require("path-logger");

const route = express.Router();

//POST BOOKMARK
route.post("/", async (req, res) => {
  bookmarkByInput = !req.body.bookmark_by ? "" : req.body.bookmark_by;
  bookmarkUseInput = !req.body.bookmark_use ? "" : req.body.bookmark_use;
  bookmarkIdInput = !req.body.bookmark_id ? "" : req.body.bookmark_id;
  bookmarkNameInput = !req.body.bookmark_name ? "" : req.body.bookmark_name;

  if (bookmarkByInput == "" || bookmarkUseInput == "" || bookmarkIdInput == "" || bookmarkNameInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `bookmark` WHERE `bookmark_name` = ? LIMIT 1;",
      [bookmarkNameInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Bookmark name already exists" });
    } else {
      await pool.execute(
        "INSERT INTO `bookmark` (`bookmark_by`, `bookmark_use`, `bookmark_id`, `bookmark_name`, `created_date`, `updated_date`) VALUE (?,?,?,?,NOW(),NOW());",
        [bookmarkByInput, bookmarkUseInput, bookmarkIdInput, bookmarkNameInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL BOOKMARK
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query("SELECT * FROM `bookmark`;");
  res.send(rows);
  pl.log(req, res);
});

//GET BOOKMARK BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT * FROM `bookmark` WHERE `id`= ? LIMIT 1;",
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

//PUT BOOKMARK BY ID
route.put("/:id", async (req, res) => {
  bookmarkByInput = !req.body.bookmark_by ? "" : req.body.bookmark_by;
  bookmarkUseInput = !req.body.bookmark_use ? "" : req.body.bookmark_use;
  bookmarkIdInput = !req.body.bookmark_id ? "" : req.body.bookmark_id;
  bookmarkNameInput = !req.body.bookmark_name ? "" : req.body.bookmark_name;
  inpParamId = req.params.id;
  if (bookmarkByInput == "" || bookmarkUseInput == "" || bookmarkIdInput == "" || bookmarkNameInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `bookmark` SET `bookmark_by` = ?, `bookmark_use` = ?, `bookmark_id` = ? , `bookmark_name` = ? WHERE `id`= ?;",
      [bookmarkByInput, bookmarkUseInput, bookmarkIdInput, bookmarkNameInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE BOOKMARK BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `bookmark` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;

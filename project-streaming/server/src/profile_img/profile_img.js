const express = require("express");
const pool = require("../../config/database");
const util = require("../util/util");
const pl = require("path-logger");

const route = express.Router();

//POST PROFILE IMG
route.post("/", async (req, res) => {
  profileIdInput = !req.body.profile_id ? "" : req.body.profile_id;
  profileNameInput = !req.body.profile_name ? "" : req.body.profile_name;
  imgInput = !req.body.img ? "" : req.body.img;

  if (profileIdInput == "" || profileNameInput == "" || imgInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `profile_img` WHERE `profile_id` = ? LIMIT 1;",
      [profileIdInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Profile ID already exists" });
    } else {
      await pool.execute(
        "INSERT INTO `profile_img` (`profile_id`, `profile_name`, `img`) VALUE (?,?,?);",
        [profileIdInput, profileNameInput, imgInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL PROFILE IMG
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query(
    "SELECT * FROM `profile_img`;"
  );
  const blobTemp =
      rows[0].profile == null ? null : rows[0].profile.toString();
  rows[0].profile = blobTemp;
  res.send(rows);
  pl.log(req, res);
});

//GET PROFILE IMG BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT * FROM `profile_img` WHERE `id`= ? LIMIT 1;",
    [inpParamId]
  );
  if (rows.length < 1) {
    res.status(404).send({ status: "Fail", msg: "Not found" });
    pl.log(req, res, "ID Not found");
  } else {
    const blobTemp =
      rows[0].img == null ? null : rows[0].img.toString();
    rows[0].img = blobTemp;
    res.send(rows);
    pl.log(req, res);
  }
});

//PUT PROFILE IMG BY ID
route.put("/:id", async (req, res) => {
  inpParamId = req.params.id;
  profileIdInput = !req.body.profile_id ? "" : req.body.profile_id;
  profileNameInput = !req.body.profile_name ? "" : req.body.profile_name;
  imgInput = !req.body.img ? "" : req.body.img;
  if (profileIdInput == "" || profileNameInput == "" || imgInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `profile_img` SET `profile_id` = ? ,`profile_name` = ?, `img` = ? WHERE `id`= ?;",
      [profileIdInput, profileNameInput, imgInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE PROFILE IMG BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `profile_img` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;

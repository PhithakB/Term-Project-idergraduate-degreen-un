const express = require("express");
const pool = require("../../config/database");
const util = require("../util/util");
const pl = require("path-logger");

const route = express.Router();

//POST PROFILE
route.post("/", async (req, res) => {
  profileNameInput = !req.body.profile_name ? "" : req.body.profile_name;
  accountIdInput = !req.body.account_id ? "" : req.body.account_id;
  profileImgInput = !req.body.profile_img ? "" : req.body.profile_img;

  if (
    profileNameInput == "" ||
    accountIdInput == "" ||
    profileImgInput == ""
  ) {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `profile` WHERE `profile_name` = ? LIMIT 1;",
      [profileNameInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Profile name already exists" });
    } else {
      await pool.execute(
        "INSERT INTO `profile` (`profile_name`, `account_id`, `profile_img`, `created_date`, `updated_date`) VALUE (?,?,?,NOW(),NOW());",
        [profileNameInput, accountIdInput, profileImgInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL PROFILE
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query(
    "SELECT `profile_name`, `account_id`, `profile_img` FROM `profile`;"
  );
  res.send(rows);
  pl.log(req, res);
});

//GET PROFILE BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT `profile_name`,`account_id`,`file_name`,`img` FROM `profile` INNER JOIN `account` ON profile.account_id = account.id\
    INNER JOIN `profile_img`ON profile.profile_img = profile_img.id WHERE profile.id = ? LIMIT 1;",
    [inpParamId]
  );
  if (rows.length < 1) {
    res.status(404).send({ status: "Fail", msg: "Not found" });
    pl.log(req, res, "ID Not found");
  } else {
    const blobTemp =
      rows[0].profile == null ? null : rows[0].profile.toString();
    rows[0].profile = blobTemp;
    res.send(rows[0]);
    pl.log(req, res);
  }
});

//PUT PROFILE BY ID
route.put("/:id/profile", async (req, res) => {
  inpParamId = req.params.id;
  inpProfile = req.body.profile_img;
  await pool.execute(
    "UPDATE `profile` SET `profile_img` = ? , `updated_date` = NOW() WHERE `id`= ?;",
    [inpProfile, inpParamId]
  );
  res.sendStatus(204);
  pl.log(req, res);
});

//PUT DETAIL PROFILE BY ID
route.put("/:id", async (req, res) => {
  profileNameInput = !req.body.profile_name ? "" : req.body.profile_name;
  accountIdInput = !req.body.account_id ? "" : req.body.account_id;
  inpParamId = req.params.id;

  if (profileNameInput == "" || accountIdInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `profile` SET `profile_name` = ?, `account_id` = ?, `updated_date` = NOW() WHERE `id` = ?;",
      [profileNameInput, accountIdInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE PROFILE BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `profile` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;

const express = require("express");
const pool = require("../../config/database");
const util = require("../util/util");
const pl = require("path-logger");

const route = express.Router();

//POST ACCOUNT
route.post("/", async (req, res) => {
  emailInput = !req.body.email ? "" : req.body.email;
  passwordInput = !req.body.password ? "" : req.body.password;
  nameInput = !req.body.name ? "" : req.body.name;

  if (
    emailInput == "" ||
    passwordInput == "" ||
    nameInput == ""
  ) {
    res.status(400).send({ message: "Json data is invalid" });
  } else {
    const [rows, fields] = await pool.query(
      "SELECT * FROM `account` WHERE `email` = ? LIMIT 1;",
      [emailInput]
    );

    if (rows.length >= 1) {
      res.status(400).send({ message: "Email already exists" });
    } else {
      verify_code = await util.generateHash(`${passwordInput}.${emailInput}`);
      await pool.execute(
        "INSERT INTO `account` (`email`, `verify_code`, `name`, `created_date`, `updated_date`) VALUE (?,?,?,NOW(),NOW());",
        [emailInput, verify_code[1], nameInput]
      );
      res.sendStatus(201);
    }
  }
  pl.log(req, res);
});

//GET ALL ACCOUNT
route.get("/", async (req, res) => {
  const [rows, fields] = await pool.query(
    "SELECT `id`,`email`,`name`,`level_id` FROM `account`;"
  );
  res.send(rows);
  pl.log(req, res);
});

//GET ACCOUNT BY ID
route.get("/:id", async (req, res) => {
  inpParamId = req.params.id
  const [rows, fields] = await pool.query(
      "SELECT * FROM `account` WHERE `id` = ? LIMIT 1;",[inpParamId]
  )
  if(rows < 1){
      res.status(404).send({status : "Fail" , message : "Not Found"})
      pl.log(req, res,"ID Not Found")
  }else{
      delete rows[0].verify_code
      const blobTemp = rows[0].profile == null ? null : rows[0].profile.toString()
      rows[0].profile = blobTemp
      res.send(rows[0])
      pl.log(req, res)
  }
})

//GET ACCOUNT BY ID JOIN
route.get("/:id/join", async (req, res) => {
  inpParamId = req.params.id;
  const [rows, fields] = await pool.query(
    "SELECT `email`,`name`,`level_name`,`price` FROM `account` INNER JOIN `level`\
    ON account.level_id = level.level_id WHERE account.id= ? LIMIT 1;",
    [inpParamId]
  );
  if (rows.length < 1) {
    res.status(404).send({ status: "Fail", msg: "Not found" });
    pl.log(req, res, "ID Not found");
  } else {
    delete rows[0].verify_code;
    res.send(rows);
    pl.log(req, res);
  }
});

//PUT ACCOUNT BY ID
route.put("/:id", async (req, res) => {
  nameInput = !req.body.name ? "" : req.body.name;
  levelIdInput = !req.body.level_id ? "" : req.body.level_id;
  inpParamId = req.params.id;

  if (nameInput == "" || levelIdInput == "") {
    res.status(400).send({ message: "Json data is invalid" });
    pl.log(req, res);
  } else {
    await pool.execute(
      "UPDATE `account` SET `name` = ?, `level_id` = ?, `updated_date` = NOW() WHERE `id` = ?;",
      [nameInput, levelIdInput, inpParamId]
    );
    res.sendStatus(204);
    pl.log(req, res);
  }
});

//DELETE ACCOUNT BY ID
route.delete("/:id", async (req, res) => {
  inpParamsId = req.params.id;
  await pool.execute("DELETE FROM `account` WHERE `id` = ?;", [inpParamsId]);
  res.sendStatus(204);
  pl.log(req, res);
});

module.exports = route;

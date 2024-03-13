const express = require('express')
const pool = require('../../config/database')
const util = require('../util/util')
const pl = require('path-logger')

const route = express.Router()

route.post('/', async (req, res) => {
    emailInput = (!req.body.email) ? "" : req.body.email
    passwordInput = (!req.body.password) ? "" : req.body.password

    if(emailInput == "" || passwordInput == ""){
        res.status(400).send({ message: "Json data is invalid" })
        pl.log(req, res, "Json data is invalid")
    }else{
        const [rows, fields] = await pool.query(
            "SELECT * FROM `account` WHERE `email` = ? LIMIT 1;",
            [emailInput]
        )
        if(rows.length < 1){
            res.status(404).send({ message: "Email Not Found" })
            pl.log(req, res)
        }else{
            result = await util.verifyHash(`${passwordInput}.${emailInput}`, rows[0].verify_code)
            if(result[0]){
                res.sendStatus(500)
                pl.log(req, res)
            }else if(result[1]){
                //password correct
                delete rows[0].verify_code
                const blobTemp = rows[0].profile == null ? null : rows[0].profile.toString()
                rows[0].profile = blobTemp
                res.send(rows[0])
                pl.log(req, res)
            }else{
                //password incorrect
                res.status(400).send({status:"Fail" , massage:"Password Incorect"})
                pl.log(req, res)
            }
        }
    }
})

module.exports = route
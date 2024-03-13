const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

exports.generateHash = function (PlaintextPassword) {
    const resHash = new Promise((resolve, reject) => {
        bcrypt.hash(
            PlaintextPassword,
            parseInt(process.env.SALT_ROUNDS),
            (err, hash) => {
                resolve([err, hash]);
            }
        );
    });
    return resHash;
};

exports.verifyHash = function (PlaintextPassword, hash) {
    const resHash = new Promise((resolve, reject) => {
        bcrypt.compare(PlaintextPassword, hash, (err, result) => {
            resolve([err, result]);
        });
    });
    return resHash;
};
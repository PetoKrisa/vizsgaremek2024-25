const mysql = require("mysql2/promise")
require("dotenv").config()

const db = mysql.createPool(
    {
        host: process.env.dbHost,
        user: process.env.dbUser,
        port: process.env.dbPort,
        password: process.env.dbPassword,
        database: process.env.dbDatabase
    }
)

module.exports = db
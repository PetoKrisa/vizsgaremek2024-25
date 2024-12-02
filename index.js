const express = require("express")
const app = express()
require("dotenv").config()
const db = require("./backend/db")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.listen(process.env.httpPort, process.env.httpHost, ()=>{
    console.log(`Fut a szerver http://${process.env.httpHost}:${process.env.httpPort}`)
})
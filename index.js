const express = require("express")
const app = express()
require("dotenv").config()
const db = require("./backend/db")
const bodyParser = require("body-parser")
const cors = require("cors")

const baseDirectory = __dirname

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json())
app.use(cors())

app.use('/public', express.static('public'))

//routers
const userRouter = require("./backend/user/router")
const frontendRouter = require("./backend/frontendRouter")
const cityRouter = require("./backend/city/router")

app.use("/", userRouter)
app.use("/", frontendRouter)
app.use("/", cityRouter)

app.get("/test", (req,res)=>{
    res.sendFile(__dirname+"/test.html") 
})

app.listen(parseInt(process.env.httpPort), process.env.httpHost, ()=>{
    console.log(`Fut a szerver http://${process.env.httpHost}:${process.env.httpPort}`)
})

module.exports = {baseDirectory}
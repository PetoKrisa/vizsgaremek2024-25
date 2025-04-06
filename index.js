const express = require("express")
const app = express()
require("dotenv").config()
const db = require("./backend/db")
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")
app.use(cookieParser());

const baseDirectory = __dirname

app.use(bodyParser.urlencoded({
    extended: false,
    limit: "2gb"
}));
app.use(bodyParser.json({ limit: "2gb" }));
app.use(cors("*"))

app.use('/public', express.static('public'))

//routers
const userRouter = require("./backend/user/router")
const frontendRouter = require("./backend/frontendRouter")
const cityRouter = require("./backend/city/router")
const authRouter = require("./backend/auth/router")
const eventRouter = require("./backend/event/router")
const searchRouter = require("./backend/search/router")
const adminRouter = require("./backend/admin/router")

app.use("/", userRouter)
app.use("/", frontendRouter)
app.use("/", cityRouter)
app.use("/", authRouter)
app.use("/", eventRouter)
app.use("/", searchRouter)
app.use("/", adminRouter)

app.get("/test", (req,res)=>{
    res.sendFile(__dirname+"/test.html") 
})

app.listen(parseInt(process.env.httpPort), process.env.httpHost, ()=>{
    console.log(`Fut a szerver http://${process.env.httpHost}:${process.env.httpPort}`)
})

module.exports = {baseDirectory}
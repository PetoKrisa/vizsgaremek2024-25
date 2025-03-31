const express = require("express")
const router = express.Router()
const user = require("../user/model")
const auth = require("./service")

const basePath =  __dirname.replace("backend\\auth", "")


router.get("/oauth", async (req,res)=>{
    let code = req.query.code
    res.sendFile(basePath+"frontend\\oauthCode.html")
})

router.get("/oauthLogin", async (req, res)=>{
    try{
        let code = req.query.code
        let token = await auth.googleGetTokenFromCode(code)
        let jwtToken = await auth.oauthLogin(token)
        res.cookie("token", token)
        res.status(200).json({status: 200, jwt: jwtToken[0], username: jwtToken[1]})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500, message: e.message})
    }
    
})
module.exports = router
const express = require("express")
const router = express.Router()
const user = require("../user/model")
const city = require("./model")

const basePath = __dirname.replace("\\backend\\city", "")

router.get("/api/cities", async (req,res)=>{
    try{
        let cities = await city.getCities(req.query['q'])
        res.json(cities)
    }catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500, message: e.message})
    }
})

module.exports = router
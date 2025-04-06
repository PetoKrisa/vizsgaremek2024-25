const {db, prisma} = require("../db")
const user = require("./model")
const router = require("express").Router()
const auth = require("../auth/service")
const city = require("../city/model")
const event = require("../event/model")
const multer  = require('multer')
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const search = require("../search/model")
const email = require("../email/service")
const admin = require("./model")
const { isStringObject } = require("util/types")

const basePath =  __dirname.replace("backend\\admin", "")

//frontend
router.get("/admin", auth.decodeJWT, auth.checkReadAdmin, async (req,res)=>{
    try{
        res.sendFile(basePath+"frontend\\admin\\index.html")
    } catch(e){
        res.status(500).json({status: 500, message: "Hiba az admin oldal betöltése közben"})
    }
})

router.get("/admin/users", auth.decodeJWT, auth.checkReadAdmin, async (req,res)=>{
    try{
        res.sendFile(basePath+"frontend\\admin\\users.html")
    } catch(e){
        res.status(500).json({status: 500, message: "Hiba az admin oldal betöltése közben"})
    }
})

//api

//users
router.get("/api/admin", auth.decodeJWT, auth.checkReadAdmin, async (req,res)=>{
    try{
        let analytics = await admin.getAdminAnalyticsJSON()
        res.json(analytics)
    } catch(e){
        res.status(500).json({status: 500, message: "Hiba az admin oldal betöltése közben"})
    }
})

router.get("/api/admin/users", auth.decodeJWT, auth.checkReadAdmin, async (req,res)=>{
    try{
        let users = await admin.users.getUsers(req.query)
        res.json(users)
    } catch(e){
        console.log(e)
        res.status(500).json({status: 500, message: "Hiba a felhasználók betöltése közben"})
    }
})

router.delete("/api/admin/users", auth.decodeJWT, auth.checkUpdateAdmin, async (req,res)=>{
    try{
        let userIdList = req.body.idList
        if(userIdList.includes(req.decodedToken.id)){
            res.json({status: 400, message: "Saját magadat nem törölheted ki!"})
            return
        }
        await admin.users.deleteUsers(userIdList)
        res.json({message: `Sikeresent törölt ${userIdList.length} sort`})
    } catch(e){
        console.log(e)
        res.status(500).json({status: 500, message: e.message})
    }
})

router.put("/api/admin/users",auth.decodeJWT, auth.checkUpdateAdmin, async(req,res)=>{
    try{
        if(req.body.id == null || req.body.id == undefined || req.body.id == ''){
            res.status(400).json({status: 400, message: "Az id hibás (nem lehet üres)"})
            return
        }
        let user = await prisma.user.findFirst({where: {id: parseInt(req.body.id)}})
        if(user == null){
            res.status(404).json({status: 404, message: "A szerkesztett felhasználó nemlétezik"})
            return
        }
        if(user.id == req.decodedToken.id && req.body.role && user.role != req.body.role){
            res.status(400).json({status: 400, message: "A saját rangodat nem változtathatod meg"})
            return
        }

        if(req.body.password){
            req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64');
        }
        if(req.body.cityId){
            let citytemp = await city.getCities(req.body.cityId)
            req.body.cityId = citytemp[0].id
        }

        if(req.body.pfp){
            delete req.body.pfp
        }

        if(req.body.joinDate){
            req.body.joinDate = new Date(req.body.joinDate)
        }

        await admin.users.updateUser(req.body)

        res.json({status: 200, message: "Sikeresen frissítette a felhasználót"})
    }catch(e){
        console.log(e)
        res.status(500).json({status: 500, message: e.message})
    }
})

module.exports = router
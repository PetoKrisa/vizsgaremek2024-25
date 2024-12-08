const db = require("../db")
const user = require("./model")
const router = require("express").Router()
const auth = require("../auth/service")
const multer  = require('multer')
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const basePath =  __dirname.replace("backend\\user", "")
const pfpStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,basePath+"\\public\\user");
    },
    filename: (req, file, cb) => {
      const userId = req.params.username; 
      const ext = path.extname(file.originalname); 
      cb(null, `${userId}${ext}`);
    },
  });

const savePfp = multer({storage: pfpStorage})
  

router.get("/api/user/@:username", async (req,res)=>{
    try{
        let userData = await user.getUserByUsername(req.params.username)
        userData.events = []
        userData.respondedEvents = []
        //todo fill events and responded events once they are implemented

        res.json(userData)
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.put("/api/user/@:username",auth.decodeJWT, async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["edit:user"], ["edit:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        await user.updateUserData(req.decodedToken.id, req.body.city, req.body.bio)

        res.json({status: 200, message: "ok"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.delete("/api/user/@:username", auth.decodeJWT, async(req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["edit:user"], ["edit:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        let userToDelete = await user.getUserByUsername(req.params.username)
        await user.deleteUser(parseInt(userToDelete.id))

        res.json({status: 200, message: "ok"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.post("/api/user/@:username/pfp", auth.decodeJWT, savePfp.single("pfp"), async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["edit:user"], ["edit:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        let userToUpdate = await user.getUserByUsername(req.params.username)
        await db.query("update user set pfp=? where id=?", [req.file.filename, parseInt(userToUpdate.id)])
        res.status(201).json({status: 201, message: "Létrehozva"})

    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.delete("/api/user/@:username/pfp", auth.decodeJWT, async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["edit:user"], ["edit:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        let userToUpdate = await user.getUserByUsername(req.params.username)
        await db.query("update user set pfp=? where id=?", [null, parseInt(userToUpdate.id)])
        res.status(201).json({status: 200, message: "Sikeres törlés"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.get("/api/user/@:username/pfp", async (req,res)=>{
    try{
        let [userRows, userFields] = await db.query("select * from user where lower(username) = lower(?)", [req.params.username])
        if(userRows.length==0){
            res.status(404).json({status: 404, message: "A felhasználó nem létezik"})
        }
        if(!fs.existsSync(basePath+"\\public\\user\\"+userRows[0].pfp)){
            res.sendFile(basePath+"\\public\\assets\\placeholder.png")
        } else{
            res.sendFile(basePath+"\\public\\user\\"+userRows[0].pfp)
        }
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.delete("/api/user/@:username", auth.decodeJWT, async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["delete:user"], ["delete:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        let userData = req.decodedToken
        let password = req.body.password || undefined
        if(password==undefined){
            res.status(400).json({status: 400, message: "A jelszó megadása kötelező"})
            return
        }
        let passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        let [rows,fields] = await db.query("select count(*) as count from user where password=? and lower(username)=lower(?)", [passwordHash, req.body.username])
        if(rows[0].count==0){
            res.status(403).json({status: 400, message: "A jelszó helytelen"})
            return
        }
        await user.deleteUser(userData.id)
        res.status(200).json({status:200, message: "Felhasználó törölve"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.post("/api/user/register", async (req,res)=>{
    try{
        if(req.body.username == undefined){
            res.status(400).json({status: 400, message: "A felhasználónév üres"})
            return
        }
        if(req.body.password == undefined){
            res.status(400).json({status: 400, message: "A jelszó üres"})
            return
        }
        if(req.body.city == undefined){
            res.status(400).json({status: 400, message: "A város üres"})
            return
        }
        if(parseInt(req.body.city)==NaN){
            res.status(400).json({status: 400, message: "A városnak szám tipusúnak kell lennie"})
            return
        }
        if(req.body.email == undefined){
            res.status(400).json({status: 400, message: "Az email üres"})
            return
        }
        let verification = await auth.register(req.body.username, req.body.password, req.body.email, req.body.city)
        console.log(verification)
        //todo email
        res.json({status: 200, message: "Sikeres regisztráció"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.get("/api/user/verify", async(req,res)=>{
    try{
        await auth.verifyEmail(req.query.username, req.query.id, req.query.pin)
        res.redirect("/login")
    }catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.post("/api/user/login", async (req,res)=>{
    try{
        let token = await auth.login(req.body.username, req.body.password)
        res.status(200).json({status: 200, jwt: token})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.post("/api/user/@:username/email", auth.decodeJWT, async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["delete:user"], ["delete:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        let userToUpdate = await user.getUserByUsername(req.params.username)
        await user.changeEmail(userToUpdate.id, req.body.email, req.body.password)
        res.status(200).json({status: 200, message: "Sikeresen megváltoztatta az email címét"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.post("/api/user/@:username/password", auth.decodeJWT, async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.params.username, ["delete:user"], ["delete:allUsers"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        let userToUpdate = await user.getUserByUsername(req.params.username)
        await user.changePassword(userToUpdate.id,req.body.newPassword, req.body.password)
        res.status(200).json({status: 200, message: "Sikeresen megváltoztatta a jelszavát"})
    } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

module.exports=router
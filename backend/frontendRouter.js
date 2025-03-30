const express = require("express")
const router = express.Router()
const user = require("./user/model")
const event = require("./event/model")
const auth = require("./auth/service")
const {prisma,db} = require("./db")

const basePath = __dirname.replace("\\backend", "")

router.get("/event/create", auth.decodeJWT, async(req,res)=>{
    try{
        res.sendFile(basePath+"\\frontend\\newEvent.html")
    } catch{
        res.status(500).send("Ismeretlen hiba történt")
    }
})

router.get("/user/@:username", async (req,res)=>{
    try{
        let userData = await user.getUserByUsername(req.params.username)
        res.sendFile(basePath+"\\frontend\\Profil.html")
    } catch{
        res.status(404).send("A felhasználó nem létezik")
    }
})

router.get("/user/@:username/edit", async (req,res)=>{
    try{
        let userData = await user.getUserByUsername(req.params.username)
        res.sendFile(basePath+"\\frontend\\ProfilEdit.html")
    } catch{
        res.status(404).send("A felhasználó nem létezik")
    }
})

router.get("/login", (req,res)=>{
    res.sendFile(basePath+"\\frontend\\Login.html")
})

router.get("/register", (req,res)=>{
    res.sendFile(basePath+"\\frontend\\Register.html")
})

router.get("/event/:id", async (req,res)=>{
    try{
        let eventData = await event.getEventById(req.params.id)
        res.sendFile(basePath+"\\frontend\\Event.html")
    } catch{
        res.status(404).send("Az esemény nem létezik")
    }
})

router.get("/event/:id/edit",auth.decodeJWT, async (req,res)=>{
    try{
        let eventData = await event.getEventById(req.params.id)
        let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
        let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
        let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        } 
        res.sendFile(basePath+"\\frontend\\editEvent.html")
    } catch(e){
        console.log(e)
        res.status(404).send("Az esemény nem létezik")
    }
})

router.get("/search", async(req,res)=>{
    try{
        res.sendFile(basePath+"\\frontend\\search.html")
    } catch{
        res.status(500).send("Hiba a keresés betöltésekor")
    }
})

router.get("/", async(req,res)=>{
    res.sendFile(basePath+"\\frontend\\Main.html")
})



module.exports = router
const express = require("express")
const router = express.Router()
const user = require("./user/model")
const event = require("./event/model")

const basePath = __dirname.replace("\\backend", "")

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

module.exports = router
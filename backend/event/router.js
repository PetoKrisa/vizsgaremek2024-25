const {db, prisma} = require("../db")
const router = require("express").Router()
const auth = require("../auth/service")
const multer  = require('multer')
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const event = require("./model")

const basePath =  __dirname.replace("backend\\event", "")
const eventStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.fieldname == "cover"){
        cb(null,basePath+"public\\event\\covers");
      } else if(file.fieldname == "gallery"){
        cb(null,basePath+"public\\event\\gallery");
      }
    },
    filename: (req, file, cb) => {
      const userId = req.decodedToken.username; 
      const ext = path.extname(file.originalname); 
      cb(null, `${userId}-${Date.now()}-${Math.floor(Math.random()*100)}${ext}`);
    },
  });

const saveFiles = multer({storage: eventStorage}).fields([
  {name: "cover", maxCount: 1},
  {name: "gallery", maxCount: 8}
])

router.post("/api/event", auth.decodeJWT, saveFiles, async (req,res)=>{
    try{
        let hasPerm = await auth.hasPermission(req.decodedToken, req.decodedToken.username, ["create:event"], ["create:event"])
        if(!hasPerm){
            res.status(403).json({status: 403, message: "Nincs jogosultsága"})
            return
        }
        if(req.files.cover != undefined){
          req.body.cover = req.files.cover[0].path.replace(basePath, "") || null
        }
        req.body.gallery = []
        req.body.userId = parseInt(req.decodedToken.id)
        if(req.files.gallery != undefined){
          for(let i = 0; i < req.files.gallery.length; i++){
            req.body.gallery.push(req.files.gallery[i].path.replace(basePath, ""))
          }
        }
        let eventCreated = await event.createEvent(req.body)
        res.status(201).json({status: 201, id: eventCreated})
    } catch(e){
      console.error(e)
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})


router.get("/api/event/:id", async (req,res)=>{
  try{
      let eventToSend = await event.getEventById(parseInt(req.params.id))
      res.status(200).json(eventToSend)
  } catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
    }
})

router.delete("/api/event/:id", auth.decodeJWT, async (req,res)=>{
  try{
    let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["delete:event"], ["delete:allEvents"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    } 
    await event.deleteEventById(parseInt(req.params.id))
    res.status(200).json({status: 200, message: "deleted"})
  } catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.put("/api/event/:id", auth.decodeJWT, saveFiles, async (req,res)=>{
  try{
    let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    } 
    if(req.files != undefined && req.files.cover != undefined){
      req.body.cover = req.files.cover[0].path.replace(basePath, "")
    }

    await event.updateEventById(parseInt(req.params.id), req.body)
    res.status(200).json({status: 200, message: "updated"})
  } catch(e){
    console.warn(e)
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.post("/api/event/:id/gallery", auth.decodeJWT, saveFiles, async (req,res)=>{
  try{
    let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    } 
    if(req.files != undefined && req.files.gallery != undefined){
      await event.saveGalleryImages(parseInt(req.params.id), req.files.gallery)
      res.status(200).json({status: 200, message: "updated"})
      return
    } else{
      res.status(400).json({status: 400, message: "No images were submitted with the request"})
      return
    }
  } catch(e){
    console.log(e)
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.delete("/api/event/:id/gallery/:imageId", auth.decodeJWT, saveFiles, async (req,res)=>{
  try{
    let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    } 
    await event.deleteGalleryImage(parseInt(req.params.imageId))
    res.status(200).json({status: 200, message: `A '${req.params.imageId}' idjű kép ki lett törölve`})

  } catch(e){
    console.log(e)
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

module.exports = router
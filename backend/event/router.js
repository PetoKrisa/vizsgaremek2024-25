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

const saveFiles = multer({
  storage: eventStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(!file.mimetype.includes("image")) {
        callback(null, false)
        return
    }
    callback(null, true)
},
}).fields([
  {name: "cover", maxCount: 1},
  {name: "gallery", maxCount: 8}
])

router.post("/api/event", auth.decodeJWT, saveFiles, async (req,res)=>{
    try{  
        if(req.xerror != undefined){
          throw req.xerror
        }

        let categories = req.body.categories

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

        

        var eventCreated = await event.createEvent(req.body)

        for(let i of categories.split(",")){
          console.log(i.trim())
          let cat = await event.getCategories(i.trim())
          await event.addCategoryToEvent(cat[0].id, eventCreated)
        }

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

router.get("/api/event/:id/deleteCover", auth.decodeJWT, async (req,res)=>{
 
    try{
      let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
      let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
      let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
      if(!hasPerm){
          res.status(403).json({status: 403, message: "Nincs jogosultsága"})
          return
      } 

      console.log("deleteing cover of "+req.params.id)
      await prisma.event.update({where: {id: parseInt(req.params.id)}, data: {cover: null}})
      res.send({status: 200, message: "Borítókép törölve"})

    } catch(e){
      console.log(e)
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

router.get("/api/event/:id/view", auth.decodeJWT, async (req,res)=>{
  try{
    
    await event.addView(req.params.id, req.decodedToken.id)
    res.status(200).json({status: 200, message: `megtekintve`})

  } catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.get("/api/category", async (req,res)=>{
  let cats = await event.getCategories()
  res.json(cats)
})

router.post("/api/event/:id/category", auth.decodeJWT, async(req,res)=>{
  try{
    let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    }
    console.log(req.body.category)
    let [category] = await event.getCategories(req.body.category)
    console.log(category)
    await event.addCategoryToEvent(category.id, parseInt(req.params.id));

    res.json({status: 200, message: "added category"})

  } catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.delete("/api/event/:id/category/:cid", auth.decodeJWT, async(req,res)=>{
  try{
    let [ownerResource] = await prisma.event.findMany({where: {id: parseInt(req.params.id)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["edit:event"], ["edit:allEvents"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    }

    await db.query("delete from eventcategory where eventId=? and categoryId=?", [parseInt(req.params.id),parseInt(req.params.cid)])

    res.json({status: 200, message: "category deleted"})

  } catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.post("/api/event/:id/respond", auth.decodeJWT, async(req,res)=>{
  try{
    console.log(req.decodedToken)
    await event.respond(req.decodedToken.id,req.params.id)
    res.status(200).json({status: 200, message: "response toggled"})
    
  }catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.get("/api/event/:id/response", auth.decodeJWT, async(req,res)=>{
  try{
    console.log("someone responded")
    let response = await prisma.eventuser.count({where: 
      {
        type: "response",
        userId: req.decodedToken.id,
        eventId: parseInt(req.params.id)
      }
    }) 
    if(response>0){
      res.json({status: 200, resp: true})
    } else{
      res.json({status: 200, resp: false})
    }
  }catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.post("/api/event/:id/comment", auth.decodeJWT, async(req,res)=>{
  try{
    console.log(req.body)
    await event.addComment(req.params.id, req.decodedToken.id, req.body.text, req.body.superCommentId, req.body.topLevelCommentId)
    res.json({status: 200, message: "komment hozzáadva"})
  }catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.get("/api/event/:id/comment", async(req,res)=>{
  try{
    let comments = await event.getComments(req.params.id, req.query.page)
    res.json({status: 200, comments: comments})
  }catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.get("/api/event/:id/comment/:cid", async(req,res)=>{
  try{
    let comment = await event.getComment(req.params.cid)
    res.json({status: 200, comment: comment})
  }catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

router.delete("/api/event/:id/comment/:commentId", auth.decodeJWT, async(req,res)=>{
  try{
    let [ownerResource] = await prisma.eventcomment.findMany({where: {id: parseInt(req.params.commentId)}})
    let [owner] = await prisma.user.findMany({where: {id: ownerResource.userId}})
    let hasPerm = await auth.hasPermission(req.decodedToken, owner.username, ["delete:comment"], ["delete:allComments"])
    if(!hasPerm){
        res.status(403).json({status: 403, message: "Nincs jogosultsága"})
        return
    }
    await event.deleteComment(req.params.id)
    res.json({status: 200, message: "törölve"})
  }catch(e){
    res.status(e.cause || 500).json({status: e.cause || 500,  message: e.message})
  }
})

module.exports = router
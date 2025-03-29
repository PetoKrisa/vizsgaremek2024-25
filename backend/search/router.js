const {db, prisma} = require("../db")
const router = require("express").Router()
const auth = require("../auth/service")
const multer  = require('multer')
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const event = require("../event/model")
const search = require("./model")

router.get("/api/search/popular", async (req,res)=>{
    try{
        let results = await search.getPopular(req.query.page || 0)
        res.send(results)
    }catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500, message: e.message})
    }
})

router.get("/api/search/recommended", auth.decodeJWT, async (req,res)=>{
    try{
        let results = await search.getEventsBasedOnInterests(req.decodedToken.id, req.query.page || 0)
        res.send(results)
    }catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500, message: e.message})
    }
})

router.get("/api/search/nearby", auth.decodeJWT, async (req,res)=>{
    try{
        let results = await search.getEventsBasedOnCounty(req.decodedToken.id, req.query.page || 0)
        res.send(results)
    }catch(e){
        res.status(e.cause || 500).json({status: e.cause || 500, message: e.message})
    }
})

module.exports = router
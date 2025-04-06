const {db, prisma} = require("../db")
const user = require("./model")
const auth = require("../auth/service")
const event = require("../event/model")
const multer  = require('multer')
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const search = require("../search/model")
const email = require("../email/service")

const basePath =  __dirname.replace("backend\\admin", "")

async function getAdminAnalyticsJSON(){
    let analytics = {
        events: {},
        users: {},
        comments: {},
        categories: {}
    }

    let events = await prisma.event.count()
    let users = await prisma.user.count()
    let comments = await prisma.eventcomment.count()
    let categories = await prisma.category.count()

    let lastEvent = await prisma.event.findFirst({orderBy: {date: "desc"}})
    let lastUser = await prisma.user.findFirst({orderBy: {joinDate: "desc"}})
    let lastComment = await prisma.eventcomment.findFirst({orderBy: {date: "desc"}})

    analytics.events.count = events;
    analytics.events.last = lastEvent;

    analytics.users.count = users;
    analytics.users.last = lastUser;

    analytics.comments.count = comments;
    analytics.comments.last = lastComment;
    
    analytics.categories.count = categories;

    return analytics
}

//users
var users = {
    deleteUserById: deleteUserById,
    createUser: createUser,
    deleteUsers: deleteUsers,
    updateUser: updateUser,
    getUsers: getUsers
} 

async function deleteUserById(userId) {
    let user = await prisma.user.count({where: {id: parseInt(userId)}})
    if(user==0){
        throw new Error("Nincs ilyen felhasználó, vagy már törölve lett", {cause: 404})
    }

    await db.query("delete from eventuser where userId = ?", [parseInt(userId)])
    await db.query("delete from event where userId = ?", [parseInt(userId)])
    await db.query("delete from eventcomment where userId = ?", [parseInt(userId)])
    
    await prisma.user.delete({where: {id: parseInt(userId)}})
}

async function createUser(userObject){
    if(userObject.username == null || userObject.email == null){
        throw new Error("A felhasználónév és az email nem lehet null", {cause: 400})
    }
    let defaultUserObject = {
        username: null,    
        email: null,
        password: null,
        joinDate: null,
        cityId: null,
        bio: null,
        pfp: null,
        completed: null,
        tempPin: null,
        role: null,
        oauthType: null
    }
    let mergedUserData = new Map([
        ...Object.entries(defaultUserObject),
        ...Object.entries(userObject)
    ])

    let createUserData = Object.fromEntries(mergedUserData)
    
    await prisma.user.create(createUserData)
}

async function deleteUsers(userIdList) {
    for(let i of userIdList){
        await deleteUserById(parseInt(i))
    }
}

async function updateUser(userObject) {
    if(userObject.id == null){
        throw new Error("Az id-t kötelező megadni", {cause: 400})
    }
    let userId = userObject.id
    delete userObject.id
    if(userObject.username == null || userObject.email == null){
        throw new Error("A felhasználónév és az email nem lehet null", {cause: 400})
    }
    let user = await prisma.user.count({where: {id: parseInt(userId)}})
    if(user==0){
        throw new Error("Nincs ilyen felhasználó, vagy már törölve lett", {cause: 404})
    }
    let defaultUserObject = await prisma.user.findFirst({where: {id: parseInt(userId)}})
    let mergedUserData = new Map([
        ...Object.entries(defaultUserObject),
        ...Object.entries(userObject)
    ])

    let updateUserData = Object.fromEntries(mergedUserData)
    
    await prisma.user.update({
        where: {id: parseInt(userId)},
        data: updateUserData
    })
}

async function getUsers(query){
    let userQuery = []
    let page = 0

    if(query.username){
        userQuery.push({username: {contains: query.username}})
    }
    if(query.id){
        userQuery.push({id: parseInt(query.id)})
    }
    if(query.page){
        page = parseInt(query.page)-1
    }
    

    if(query.q){
        if(!isNaN(parseInt(query.q))){
            userQuery.push({id: parseInt(query.q)})
        }
        
        userQuery.push({username: {contains: query.q}})
        userQuery.push({email: {contains: query.q}})

    }

    let OrUserQuery = {OR: userQuery}
    if(userQuery.length == 0){
        OrUserQuery = {}
    }

    let resultCount = await prisma.user.count({
        where: OrUserQuery
    })
    let results = await prisma.user.findMany({where: OrUserQuery,
    take: 12, skip: page*12, include: {city: true}, orderBy: {joinDate: "desc"}})

    let output = {
        currentPage: page+1,
        maxPages: Math.ceil(resultCount/12),
        allResultsCount: resultCount,
        results: results
    }

    return output

}


module.exports = {getAdminAnalyticsJSON, users}
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

//events
var events = {
    deleteEventById: deleteEventById,
    createEvent: createEvent,
    deleteEvents: deleteEvents,
    updateEvent: updateEvent,
    getEvents: getEvents
} 

async function deleteEventById(eventId) {
    let event = await prisma.event.count({where: {id: parseInt(eventId)}})
    if(event==0){
        throw new Error("Nincs ilyen esemény, vagy már törölve lett", {cause: 404})
    }

    await db.query("delete from eventuser where eventId = ?", [parseInt(eventId)])
    await db.query("delete from eventgalleryimage where eventId = ?", [parseInt(eventId)])
    await db.query("delete from eventcomment where eventId = ?", [parseInt(eventId)])
    await db.query("delete from event where id = ?", [parseInt(eventId)])
}

async function createEvent(eventObject){
    if(eventObject.title == null || eventObject.startDate == null){
        throw new Error("A cím és a kezdődátum nem lehet null", {cause: 400})
    }
    let defaultEventObject = {
        id: null,
        userId: null,
        title: null,
        description: null,
        startDate: null,
        endDate: null,
        cityId: null,
        location: null,
        maxResponse: null,
        ageLimit: null
    }
    let mergedEventData = new Map([
        ...Object.entries(defaultEventObject),
        ...Object.entries(eventObject)
    ])

    let createEventData = Object.fromEntries(mergedEventData)
    
    await prisma.event.create(createEventData)
}

async function deleteEvents(eventIdList) {
    for(let i of eventIdList){
        await deleteEventById(parseInt(i))
    }
}

async function updateEvent(eventObject) {
    if(eventObject.id == null){
        throw new Error("Az id-t kötelező megadni", {cause: 400})
    }
    let eventId = eventObject.id
    delete eventObject.id
    if(eventObject.title == null || eventObject.startDate == null){
        throw new Error("A cím és a kezdődátum nem lehet null", {cause: 400})
    }
    let user = await prisma.event.count({where: {id: parseInt(eventId)}})
    if(user==0){
        throw new Error("Nincs ilyen esemény, vagy már törölve lett", {cause: 404})
    }
    let defaultEventObject = await prisma.event.findFirst({where: {id: parseInt(eventId)}})
    let mergedEventData = new Map([
        ...Object.entries(defaultEventObject),
        ...Object.entries(eventObject)
    ])

    let updateEventData = Object.fromEntries(mergedEventData)
    
    await prisma.event.update({
        where: {id: parseInt(eventId)},
        data: updateEventData
    })
}

async function getEvents(query){
    let userQuery = []
    let page = 0

    if(query.title){
        userQuery.push({title: {contains: query.title}})
    }
    if(query.id){
        userQuery.push({id: parseInt(query.id)})
    }
    if(query.userId){
        userQuery.push({userId: parseInt(query.userId)})
    }
    if(query.page){
        page = parseInt(query.page)-1
    }
    

    if(query.q){
        if(!isNaN(parseInt(query.q))){
            userQuery.push({id: parseInt(query.q)})
        }
        
        userQuery.push({title: {contains: query.q}})
    }

    let OrUserQuery = {OR: userQuery}
    if(userQuery.length == 0){
        OrUserQuery = {}
    }

    let resultCount = await prisma.event.count({
        where: OrUserQuery
    })
    let results = await prisma.event.findMany({where: OrUserQuery,
    take: 12, skip: page*12, include: {city: true, user: true}, orderBy: {startDate: "desc"}})

    let output = {
        currentPage: page+1,
        maxPages: Math.ceil(resultCount/12),
        allResultsCount: resultCount,
        results: results
    }

    return output

}

//comments
var comments = {
    deleteCommentById: deleteCommentById,
    createComment: createComment,
    deleteComments: deleteComments,
    updateComment: updateComment,
    getComments: getComments
} 

async function deleteCommentById(eventId) {
    let event = await prisma.eventcomment.count({where: {id: parseInt(eventId)}})
    if(event==0){
        throw new Error("Nincs ilyen komment, vagy már törölve lett", {cause: 404})
    }

    await db.query("delete from eventcomment where id = ?", [parseInt(eventId)])
}

async function createComment(commentObject){
    if(commentObject.id == null || commentObject.commentText == null || commentObject.userId == null || commentObject.eventId == null){
        throw new Error("Az id, szöveg, userId, és az eventId nem lehet null", {cause: 400})
    }
    let defaultCommentObject = {
        id: null,
        eventId: null,
        userId: null,
        commentText: null
    }
    let mergedCommentData = new Map([
        ...Object.entries(defaultCommentObject),
        ...Object.entries(mergedCommentData)
    ])

    let createCommentData = Object.fromEntries(mergedCommentData)
    
    await prisma.eventcomment.create(createCommentData)
}

async function deleteComments(commentIdList) {
    for(let i of commentIdList){
        await deleteCommentById(parseInt(i))
    }
}

async function updateComment(commentObject) {
    if(commentObject.id == null){
        throw new Error("Az id-t kötelező megadni", {cause: 400})
    }
    let commentId = commentObject.id
    delete commentObject.id
    if(commentObject.commentText == null || commentObject.userId == null || commentObject.eventId == null){
        console.log(commentObject)
        throw new Error("A szöveg, userId, és az eventId nem lehet null", {cause: 400})
    }
    let user = await prisma.eventcomment.count({where: {id: parseInt(commentId)}})
    if(user==0){
        throw new Error("Nincs ilyen komment, vagy már törölve lett", {cause: 404})
    }
    let defaultCommentObject = await prisma.eventcomment.findFirst({where: {id: parseInt(commentId)}})
    let mergedCommentData = new Map([
        ...Object.entries(defaultCommentObject),
        ...Object.entries(commentObject)
    ])

    let updateCommentData = Object.fromEntries(mergedCommentData)
    
    await prisma.eventcomment.update({
        where: {id: parseInt(commentId)},
        data: updateCommentData
    })
}

async function getComments(query){
    let userQuery = []
    let page = 0

    if(query.eventId){
        userQuery.push({eventId: parseInt(query.eventId)})
    }
    if(query.userId){
        userQuery.push({userId: parseInt(query.userId)})
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
        
        userQuery.push({commentText: {contains: query.q}})
    }

    let OrUserQuery = {OR: userQuery}
    if(userQuery.length == 0){
        OrUserQuery = {}
    }

    let resultCount = await prisma.eventcomment.count({
        where: OrUserQuery
    })
    let results = await prisma.eventcomment.findMany({where: OrUserQuery,
    take: 12, skip: page*12, include: {event: true, user: true}, orderBy: {date: "desc"}})

    let output = {
        currentPage: page+1,
        maxPages: Math.ceil(resultCount/12),
        allResultsCount: resultCount,
        results: results
    }

    return output

}

//categories
var categories = {
    deleteCategoryById: deleteCategoryById,
    createCategory: createCategory,
    deleteCategories: deleteCategories,
    updateCategory: updateCategory,
    getCategories: getCategories
} 

async function deleteCategoryById(eventId) {
    let event = await prisma.category.count({where: {id: parseInt(eventId)}})
    if(event==0){
        throw new Error("Nincs ilyen kategória, vagy már törölve lett", {cause: 404})
    }

    await db.query("delete from eventcategory where categoryId = ?", [parseInt(eventId)])
    await db.query("delete from category where id = ?", [parseInt(eventId)])
}

async function createCategory(commentObject){
    if(commentObject.name == null){
        throw new Error("A név nem lehet null", {cause: 400})
    }
    let defaultCommentObject = {
        name: null
    }
    let mergedCommentData = new Map([
        ...Object.entries(defaultCommentObject),
        ...Object.entries(commentObject)
    ])

    let createCommentData = Object.fromEntries(mergedCommentData)
    
    await prisma.category.create({data: createCommentData})
}

async function deleteCategories(commentIdList) {
    for(let i of commentIdList){
        await deleteCategoryById(parseInt(i))
    }
}

async function updateCategory(commentObject) {
    if(commentObject.id == null){
        throw new Error("Az id-t kötelező megadni", {cause: 400})
    }
    let commentId = commentObject.id
    delete commentObject.id
    if(commentObject.name == null){
        console.log(commentObject)
        throw new Error("A név nem lehet null", {cause: 400})
    }
    let user = await prisma.category.count({where: {id: parseInt(commentId)}})
    if(user==0){
        throw new Error("Nincs ilyen kategória, vagy már törölve lett", {cause: 404})
    }
    let defaultCommentObject = await prisma.category.findFirst({where: {id: parseInt(commentId)}})
    let mergedCommentData = new Map([
        ...Object.entries(defaultCommentObject),
        ...Object.entries(commentObject)
    ])

    let updateCommentData = Object.fromEntries(mergedCommentData)
    
    await prisma.category.update({
        where: {id: parseInt(commentId)},
        data: updateCommentData
    })
}

async function getCategories(query){
    let userQuery = []
    let page = 0

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
        
        userQuery.push({name: {contains: query.q}})
    }

    let OrUserQuery = {OR: userQuery}
    if(userQuery.length == 0){
        OrUserQuery = {}
    }

    let resultCount = await prisma.category.count({
        where: OrUserQuery
    })
    let results = await prisma.category.findMany({where: OrUserQuery,
    take: 12, skip: page*12})

    let output = {
        currentPage: page+1,
        maxPages: Math.ceil(resultCount/12),
        allResultsCount: resultCount,
        results: results
    }

    return output

}


module.exports = {getAdminAnalyticsJSON, users, events, comments, categories}
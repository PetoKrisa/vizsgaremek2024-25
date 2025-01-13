const {db, prisma} = require("../db")
require("dotenv").config()
const crypto = require("crypto")
const city = require("../city/model")
const user = require("../user/model")
const { start } = require("repl")
const { error } = require("console")

const basePath =  __dirname.replace("backend\\event", "")

async function createEvent(eventObject){
    if(eventObject.ageLimit == "on" || eventObject.ageLimit == "true"){
        eventObject.ageLimit = true
    } else{
        eventObject.ageLimit = false
    }
    console.log(eventObject)
    let defaultObject = {
            title: null,
            description: null,
            startDate: null,
            endDate: null,
            visibility: "public",
            cover: null,
            city: "",
            location: null,
            maxResponse: 10,
            gallery: [],
            ageLimit: false
    }
    let eventObjectToPush = {...defaultObject, ...eventObject}
    if(eventObject.title == null || eventObject.title == "" ||
        eventObject.startDate == null || eventObject.startDate == "" ||
        eventObject.city == null || eventObject.city == ""
    ){
        throw new Error("A Cím, kezdő időpont vagy város üres!", {cause: 400})
    }
    let gallery = eventObjectToPush.gallery
    delete eventObjectToPush.gallery
    if(eventObjectToPush.cover != null){
        eventObjectToPush.cover.replace("\\", "/")
    }
    let cityData = await city.getCities(eventObjectToPush.city)
    eventObjectToPush.cityId = cityData[0].id
    delete eventObjectToPush.city

    let startDate = new Date(eventObjectToPush.startDate)
    let endDate;
    if(endDate==undefined || endDate == ""){
        endDate = null
    } else{
        endDate = new Date(eventObjectToPush.endDate)
        endDate.setHours(endDate.getHours()+1)
    }
    startDate.setHours(startDate.getHours()+1)
    
    eventObjectToPush.startDate = startDate
    eventObjectToPush.endDate = endDate
    
    eventObjectToPush.ageLimit = Boolean(eventObjectToPush.ageLimit)
    eventObjectToPush.maxResponse = parseInt(eventObjectToPush.maxResponse)

    let eventCreated = await prisma.event.create({
        data: eventObjectToPush
    })

    for(let pic of gallery){
        await prisma.eventgalleryimage.create({data: {eventId: eventCreated.id, image: pic}})
    }
    
    return parseInt(eventCreated.id)
}

async function getEventById(id) {
    let events = await prisma.event.findMany({where: {id: parseInt(id)}})
    if(events.length==0){
        throw new Error("Ilyen ID-vel rendelkező event nem létezik!", {cause: 404})
    }
    let gallery = await prisma.eventgalleryimage.findMany({where: {eventId: parseInt(id)}})
    let cityData = await prisma.city.findFirst({where: {id: parseInt(events[0].cityId)}})
    events[0].gallery = []
    events[0].gallery = gallery
    events[0].author = await user.getUserById(events[0].userId)
    events[0].city = cityData
    delete events[0].cityId

    let views = await prisma.eventuser.count({where: {eventId: parseInt(id), type: "view"}})

    events[0].views = views

    return events[0]
}

async function deleteEventById(id) {
    await prisma.event.delete({where: {id: parseInt(id)}})
}

async function updateEventById(id, body) {
    let defaultObject = {
        title: null,
        description: null,
        startDate: null,
        endDate: null,
        visibility: "public",
        cover: null,
        city: "",
        location: null,
        maxResponse: 10,
        ageLimit: false
}
let eventObjectToPush = {...defaultObject, ...body}
if(body.title == null ||
    body.startDate == null ||
    body.city == null
){  
    throw new Error("A Cím, kezdő időpont vagy város üres!", {cause: 400})
}
//fixing data types
if(eventObjectToPush.cover != null){
    eventObjectToPush.cover.replace("\\", "/")
}
let cityData = await city.getCities(eventObjectToPush.city)
eventObjectToPush.cityId = cityData[0].id
delete eventObjectToPush.city

let startDate = new Date(eventObjectToPush.startDate)
if(eventObjectToPush.endDate != null){
    let endDate = new Date(eventObjectToPush.endDate)
    endDate.setHours(endDate.getHours()+1)
    eventObjectToPush.endDate = endDate
}
startDate.setHours(startDate.getHours()+1)
eventObjectToPush.startDate = startDate
eventObjectToPush.ageLimit = Boolean(eventObjectToPush.ageLimit)
eventObjectToPush.maxResponse = parseInt(eventObjectToPush.maxResponse)
//updating event
let eventCreated = await prisma.event.update({
    where: {id: parseInt(id)},
    data: eventObjectToPush
})

}

async function saveGalleryImages(id, files) {
    for(let i of files){
        await prisma.eventgalleryimage.create({
            data: {
                eventId: parseInt(id),
                image: i.path.replace(basePath, "")
            }
        })
    }
}

async function deleteGalleryImage(galleryImageId) {
    let exists = await prisma.eventgalleryimage.count({where: {id: parseInt(galleryImageId)}})
    if(exists==0){
        throw new Error("Ez a kép nem létezik", {cause: 404})
    }
    await prisma.eventgalleryimage.delete({
        where: {id: parseInt(galleryImageId)}
    })
}

async function addView(eventId, userId){
    let count = await prisma.eventuser.count({where: {userId: parseInt(userId), eventId: parseInt(eventId)}})
    if(count==0){
        await prisma.eventuser.create({data: {
            eventId: parseInt(eventId),
            userId: parseInt(userId),
            type: "view"
        }})
    } else{
        throw new Error("Már megtekintve", {cause: 202})
    }
}

module.exports = {createEvent, getEventById, deleteEventById, updateEventById, saveGalleryImages, deleteGalleryImage, addView}
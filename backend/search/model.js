const {db, prisma} = require("../db")
require("dotenv").config()
const crypto = require("crypto")
const city = require("../city/model")
const user = require("../user/model")
const event = require("../event/model")

async function getUserIntrests(userId){
    let userEventResponses = await prisma.eventuser.findMany({
        where: {
            userId: userId,
            type: "response"
        }
    })

    let eventCategories = new Set()

    for(let i of userEventResponses){
        let currentEventCategories = await prisma.eventcategory.findMany({
            where: {
                eventId: i.eventId
            }
        })

        for(let tag of currentEventCategories){
            let category = await prisma.category.findFirst({
                where: {id: tag.categoryId}
            })
            eventCategories.add(category.name)
        }
    }

    return eventCategories
}

async function getUserIntrestIds(userId){
    let userEventResponses = await prisma.eventuser.findMany({
        where: {
            userId: userId,
            type: "response"
        }
    })

    let eventCategories = new Set()

    for(let i of userEventResponses){
        let currentEventCategories = await prisma.eventcategory.findMany({
            where: {
                eventId: i.eventId
            }
        })

        for(let tag of currentEventCategories){
            let category = await prisma.category.findFirst({
                where: {id: tag.categoryId}
            })
            eventCategories.add(category.id)
        }
    }

    return eventCategories
}

async function getPopular(page) {
    
    let [eventIDs] = await db.query(`
        SELECT event.id
        FROM event
        JOIN eventuser ON event.id = eventuser.eventId
        WHERE eventuser.type = 'view'
        AND event.startDate > NOW()
        GROUP BY event.id
        ORDER BY COUNT(eventuser.id) DESC
        Limit 3 offset ${parseInt(page)*3}
        `)
    let events = []
    for(let i of eventIDs){
        let temp = await event.getEventById(i.id)
        events.push(temp)
    }
    return events
}


async function getEventsBasedOnInterests(userId, page){
    let interests = await getUserIntrestIds(userId)
    interests = Array.from(interests)
    let [eventIDs] = await db.query(
        `SELECT e.id
       FROM event e
       JOIN eventcategory ec ON e.id = ec.eventId
       WHERE ec.categoryId IN (?)
       AND e.startDate > NOW()
       GROUP BY e.id
       Limit 3 offset ${parseInt(page)*3}`,
       [interests]
    )
    let events = []
    for(let i of eventIDs){
        let temp = await event.getEventById(i.id)
        events.push(temp)
    }
    return events
}

async function getEventsBasedOnCounty(userId, page){
    let user = await prisma.user.findFirst({where: {id: parseInt(userId)}, include: {city: true}})
    let [eventIDs] = await db.query(
        `
        SELECT e.id
        FROM event e
        JOIN city c ON e.cityId = c.id
        WHERE c.county = ?
        AND e.startDate > NOW()
        limit 3 offset ${parseInt(page)*3}
        `,
        [user.city.county]
    )
    let events = []
    for(let i of eventIDs){
        let temp = await event.getEventById(i.id)
        events.push(temp)
    }
    return events
}

async function search(query) {
    let categoryIds = []
    let filter = {}
    let page = 0;
    if(query.q){
        filter.title = {contains: query.q}
    }
    if(query.tags){
        filter.eventcategory = {some: {
                categoryId: {in: JSON.parse(query.tags)}
            }}
    }
    if(query.startDate){
        filter.startDate = {gte: new Date(query.startDate)}
    }
    if(query.city){
        filter.city = {name: query.city}
    }
    if(query.county){
        filter.city = {county: query.county}
    }
    if(query.city && query.county){
        filter.city = {
            name: query.city,
            county: query.county
        }
    }
    if(query.ageLimit){
        if(query.ageLimit.toLowerCase() == "true"){
            filter.ageLimit = true
        } else if(query.ageLimit.toLowerCase() == "false"){
            filter.OR =[
                {ageLimit: false},
                {ageLimit: null}
            ]
        }
        
    }
    if(query.page){
        page = parseInt(query.page)-1
    }

    let result = await prisma.event.findMany({
        where: { AND: filter },
        orderBy: {date: "desc"},
        skip: page*8,
        take: 8})

    let resultcount = await prisma.event.count({
        where: { AND: filter }})
    
    let result2 = []

    for(let i of result){
        let temp = await event.getEventById(i.id)
        result2.push(temp)
    }
    let output = {currentPage: page+1, allResultCount: resultcount, pages: Math.ceil(resultcount/8), results: result2}
    return output
}



module.exports = {getUserIntrests, getPopular, getEventsBasedOnInterests, getEventsBasedOnCounty, search}
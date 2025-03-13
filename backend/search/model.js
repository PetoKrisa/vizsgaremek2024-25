const {db, prisma} = require("../db")
require("dotenv").config()
const crypto = require("crypto")
const city = require("../city/model")
const user = require("../user/model")

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
        console.log(currentEventCategories)

        for(let tag of currentEventCategories){
            let category = await prisma.category.findFirst({
                where: {id: tag.categoryId}
            })
            eventCategories.add(category.name)
        }
    }

    return eventCategories
}

module.exports = {getUserIntrests}
const {db, prisma} = require("../db")
require("dotenv").config()

async function getCities(query = ""){
    let tryCities = await prisma.city.findMany({where: {
        name: query
    }})

    let cities = await prisma.city.findMany({where: {
        name: {
            contains: query
        }
    }})
    if(tryCities.length>0){
        return tryCities
    }

    if(cities.length > 0){
        return cities
    }
    throw Error("Nem létezik ilyen nevű város", {cause: 404})

}

module.exports = {getCities}
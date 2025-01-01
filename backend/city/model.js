const {db, prisma} = require("../db")
require("dotenv").config()

async function getCities(query = ""){
    let cities = await prisma.city.findMany({where: {
        name: {
            contains: query
        }
    }})
    if(cities.length == 0){
        throw Error("Nem létezik ilyen nevű város", {cause: 404})
    }
    return cities
}

module.exports = {getCities}
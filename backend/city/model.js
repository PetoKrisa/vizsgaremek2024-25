const db = require("../db")
require("dotenv").config()

async function getCities(query = ""){
    if(query.length==0){
        throw Error("A város nem lehet üres", {cause: 400})
    }
    query = `%${query}%`
    let [cities, fields] = await db.query("select * from city where lower(name) like lower(?)", [query])
    if(cities.length == 0){
        throw Error("Nem létezik ilyen nevű város", {cause: 404})
    }
    return cities
}

module.exports = {getCities}
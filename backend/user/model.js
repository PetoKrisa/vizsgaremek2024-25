const db = require("../db")

async function getUserById(id){
    let [rows,fields] = await db.query("select * from user where id = ?;", [parseInt(id)])
    if(rows.length<1){
        return null
    }
    let u = rows[0]
    let user = {
        id: u.id,
        joinDate: u["join_date"],
        username: u.username,
        city: {},
        bio: u.bio,
        pfp: u.pfp,
        role: u.role
    }

    let [cityRows, cityFields] = await db.query("select * from city where id = ?", [parseInt(u["city_id"])])

    user.city = cityRows[0]

    return user
}

async function getUserByUsername(username){
    let [rows,fields] = await db.query("select * from user where username = ?;", [username])
    if(rows.length<1){
        return null
    }
    let u = rows[0]
    let user = {
        id: u.id,
        joinDate: u["join_date"],
        username: u.username,
        city: {},
        bio: u.bio,
        pfp: u.pfp,
        role: u.role
    }

    let [cityRows, cityFields] = await db.query("select * from city where id = ?", [parseInt(u["city_id"])])

    user.city = cityRows[0]

    return user
}

getUserByUsername("Admin")

module.exports = {getUserById,getUserByUsername}
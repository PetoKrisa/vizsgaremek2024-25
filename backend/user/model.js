const db = require("../db")
require("dotenv").config()
const crypto = require("crypto")
const city = require("../city/model")

async function getUserById(id){
    let [rows,fields] = await db.query("select * from user where id = ?;", [parseInt(id)])
    if(rows.length<1){
        throw new Error("A felhasználó nem létezik", {cause: 404})
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
    if(u.pfp != null){
        user.pfp = `${process.env.url}public/user/${u.pfp}`
    } else{
        user.pfp = `${process.env.url}public/assets/placeholder.png`
    }

    let [cityRows, cityFields] = await db.query("select * from city where id = ?", [parseInt(u["city_id"])])

    user.city = cityRows[0]

    return user
}

async function getUserByUsername(username){
    let [rows,fields] = await db.query("select * from user where lower(username) = lower(?);", [username])
    if(rows.length<1){
        throw new Error("A felhasználó nem létezik", {cause: 404})
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
    if(u.pfp != null){
        user.pfp = `${process.env.url}public/user/${u.pfp}`
    } else{
        user.pfp = `${process.env.url}public/assets/placeholder.png`
    }

    let [cityRows, cityFields] = await db.query("select * from city where id = ?", [parseInt(u["city_id"])])

    user.city = cityRows[0]

    return user
}

async function updateUserData(userId, cityName, bio) {
    let [exitsRows, existsFields] = await db.query("select count(id) as count from user where id = ?;", [parseInt(userId)])
    if(exitsRows[0].count == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let cityData = await city.getCities(cityName)
    if(bio.length>255){
        throw new Error("A bio túl hosszú (255+ karakter)", {cause: 400})
    }
    await db.query("update user set city_id=?, bio=? where id=?", [parseInt(cityData[0].id), bio, parseInt(userId)])
}


async function deleteUser(userId) {
    let [exitsRows, existsFields] = await db.query("select count(id) as count from user where id = ?;", [parseInt(userId)])
    if(exitsRows[0].count == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    await db.query("delete from user where id = ?", [parseInt(userId)])
}

async function changeEmail(userId, newEmail, password) {
    if(newEmail==undefined ||newEmail.length==0 || newEmail==null){
        throw new Error("Az új email nem lehet üres", {cause: 400})
    }
    let [exitsRows, existsFields] = await db.query("select * from user where id = ?;", [parseInt(userId)])
    if(exitsRows.length == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    let [userRows, userFields] = await db.query("select * from user where id=? and password = ?", [parseInt(userId), passwordHash])
    if(userRows.length==0){
        throw new Error("A jelszó nem egyezik", {cause: 400})
    }
    await db.query("update user set email=? where id=?", [newEmail, parseInt(userId)])
}

async function changePassword(userId, newPassword, password) {
    console.log(userId, newPassword, password)
    if(newPassword==undefined ||newPassword.length==0 || newPassword==null){
        throw new Error("Az új jelszó nem lehet üres", {cause: 400})
    }
    let [exitsRows, existsFields] = await db.query("select * from user where id = ?;", [parseInt(userId)])
    if(exitsRows.length == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    let [userRows, userFields] = await db.query("select * from user where id=? and password = ?", [parseInt(userId), passwordHash])
    if(userRows.length==0){
        throw new Error("A jelszó nem egyezik", {cause: 400})
    }
    let newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    await db.query("update user set password=? where id=?", [newPasswordHash, parseInt(userId)])
}

module.exports = {getUserById,getUserByUsername, updateUserData, deleteUser, changeEmail, changePassword}
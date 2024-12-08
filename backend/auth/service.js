const db = require("../db")
const jwt = require("jsonwebtoken")
require("dotenv").config()
var crypto = require('crypto');
const user = require("../user/model")

const permissions = {
    "admin": new Set([
        "delete:allComments",
        "create:comment",
        "delete:comment",

        "create:event",
        "delete:event",
        "edit:event",
        "delete:allEvents",
        "delete:allEvents",
        "read:allEvents",

        "read:admin",

        "edit:allUsers",
        "delete:allUsers",
        "create:user",
        "edit:user",
        "delete:user"
    ]),
    "moderator": new Set([
        "delete:allComments",
        "delete:comment",
        "create:comment",

        "create:event",
        "delete:event",
        "edit:event",
        "delete:allEvents",
        "delete:allEvents",
        
        "edit:allUsers",
        "delete:allUsers",
        "edit:user",
        "delete:user"
    ]),
    "user": new Set([
        "delete:comment",
        "create:comment",

        "create:event",
        "delete:event",
        "edit:event",

        "edit:user",
        "delete:user"
    ])
}

async function login(username, password) {

        let passHash = crypto.createHash('sha256').update(password).digest('hex');
        let [rows,fields]=await db.query("select * from user where username = ? and password = ?", [username, passHash])
    
        if(rows.length==0){
            throw (new Error("Jelszó vagy felhasználómnév nem megfelelő", {cause: 404}));
        }
        if(Boolean(rows[0].completed) == false){
            throw (new Error("A Profil még nincs megerősítve", {cause: 401}))
        }
    
        if(rows.length>0){
            return jwt.sign(JSON.stringify(await user.getUserById(rows[0].id)), process.env.secret)
        }

    
}

async function register(username, password, email, cityId) {
    console.log(username, password, email, cityId)
    console.log("1")
    let [existsRows, existsFields] = await db.query("select count(id) as count from user where LOWER(username) = LOWER(?);", [username])
    if(existsRows[0].count > 0){
        throw new Error("A felhasználónév már létezik", {cause: 400})
    }
    console.log("2")
    let [existsRows2, existsFields2] = await db.query("select count(id) as count from user where LOWER(email) = LOWER(?);", [email])
    console.log("2.5")
    if(existsRows2[0].count > 0){
        throw new Error("Az email már használatban van", {cause: 400})
    }
    console.log("3")
    let passHash = crypto.createHash('sha256').update(password).digest('hex');
    let [rows,fields]= await db.query(`
    insert into user (username, password, email, city_id, completed, role)
    values (?,?,?,?,?,?)`,
    [username, passHash, email, cityId, false, "user"])
    console.log("4")
    let pin = Math.floor(Math.random() * (999999 - 100000) + 999999);
    
    await db.query("update user set tempPin = ? where username=?", [pin, username])

    return `${process.env.url}api/user/verify?username=${username}&id=${rows.insertId}&pin=${pin}`
}


async function verifyEmail(username, userid, tempPin){
    let [rows,fields] = await db.query("select * from user where username=? and id=?", [username, parseInt(userid)])
    if(rows.length==0){
        throw new Error("A felhasználó nem létezik vagy hibásak az adatai", {cause: 404})
    }
    if(Boolean(rows[0].completed)){
        throw new Error("A felhasználó már meg van erősítve", {cause: 400})
    }
    if(parseInt(rows[0].tempPin) != parseInt(tempPin)){
        throw new Error("A megerősítéshez használt kód hibás", {cause: 400})
    }
    await db.query("update user set tempPin = null, completed = true where user.id = ?", [parseInt(userid)])
}

function decodeJWT(req, res, next){
    try{
        let token = req.headers.authorization.split(" ")[1]
        let decodedToken = jwt.verify(token, process.env.secret)
        req.decodedToken = decodedToken
        next()
    } catch(e){
        res.status(403).json({status: 403,message: "A token nem megfelelő vagy üres"})
    }
    
}

//resource = {name: "comment", id: 1}
//resource = {name: "event", id: 2}
//resource = {name: "user", id: 3}
//resource = {name: "admin", id: null}

async function hasPermission(decodedJwt, ownerUsername, ownerPermissionList, permissionList) {
    if(decodedJwt.username == null || decodedJwt.username == undefined){
        throw new Error("Csak bejelentkezett fehasználók férnek hozzá az erőforráshoz", {cause: 401})
    }
    if(ownerUsername == undefined || ownerUsername == null){
        throw new Error("Nincs erőforrás megadva", {cause: 500})
    }
    if(ownerPermissionList == undefined || ownerPermissionList == null){
        return true
    }

    let [rows, fields] = await db.query("select * from user where lower(username) = lower(?)", [decodedJwt.username])
    let [rows2, fields2] = await db.query("select * from user where lower(username) = lower(?)", [ownerUsername])
    if(rows.length==0){
        throw new Error("A felhasználó akihez a token tartozik nem létezik", {cause: 404})
    }
    if(rows2.length==0){
        throw new Error("A szerkesztendő felhasználó nem létezik", {cause: 404})
    }

    let user = rows[0]
    let owner = rows2[0]

    let hasPerm = true;
    if(user.id != owner.id){
        hasPerm = true;
        for (let i of permissionList){
            if(!permissions[user.role].has(i)){
                hasPerm = false
            }
        }
    } else{
        hasPerm = true;
        for (let i of ownerPermissionList){
            if(!permissions[user.role].has(i)){
                hasPerm = false
            }
        }
    }

    return hasPerm
}

module.exports = {login, register, verifyEmail, hasPermission, decodeJWT}
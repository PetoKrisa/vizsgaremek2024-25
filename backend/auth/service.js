const db = require("../db")
const jwt = require("jsonwebtoken")
require("dotenv").config()
var crypto = require('crypto');
const user = require("../user/model")

const permissions = {
    "admin": new Set([
        "delete:allComments",
        "delete:comment",
        "create:event",
        "delete:event",
        "edit:event",
        "delete:allEvents",
        "delete:allEvents",
        "read:admin",
        "edit:allUsers",
        "delete:allUsers",
        "create:user",
        "create:comment",
        "read:allPrivateEvents"
    ]),
    "moderator": new Set([
        "delete:allComments",
        "delete:comment",
        "create:event",
        "delete:event",
        "edit:event",
        "delete:allEvents",
        "delete:allEvents",
        "create:comment"
    ]),
    "user": new Set([
        "delete:comment",
        "create:event",
        "delete:event",
        "edit:event",
        "create:comment"
    ])
}

async function login(username, password) {
    let passHash = crypto.createHash('sha256').update(password).digest('hex');
    let [rows,fields]=await db.query("select * from user where username = ? and password = ?", [username, passHash])
    console.log(await user.getUserById(rows[0].id))
    if(rows.length>0){
        return jwt.sign(JSON.stringify(await user.getUserById(rows[0].id)), process.env.secret)
    } else{
        return null;
    }
}

async function register(username, password, email, cityId) {
    let passHash = crypto.createHash('sha256').update(password).digest('hex');
    let [rows,fields]=await db.query(`
        insert into user (username, password, email, city_id)
        values (?,?,?,?)`,
    [username, passHash, email, cityId])
    return jwt.sign(JSON.stringify(await user.getUserById(rows.insertId)), process.env.secret)
}


//resource = {name: "comment", id: 1}
//resource = {name: "event", id: 2}

async function checkPermissions(username, permissionList) {
    
}
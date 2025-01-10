const {db, prisma} = require("../db")
const jwt = require("jsonwebtoken")
require("dotenv").config()
var crypto = require('crypto');
const user = require("../user/model")
const city = require("../city/model");

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
        let existsRows = await prisma.user.findMany({where: {username: username}})
        let rows = await prisma.user.findMany({where: {username: username, password: passHash}})

        if(existsRows.length==0){
            throw new Error("Ilyen nevű felhasználó nem létezik!", {cause: 404})
        }
        if(rows.length==0){
            throw (new Error("Hibás jelszó", {cause: 400}));
        }
        if(Boolean(rows[0].completed) == false){
            throw (new Error("A Profil még nincs megerősítve", {cause: 401}))
        }
    
        if(rows.length>0){
            return jwt.sign(JSON.stringify(await user.getUserById(rows[0].id)), process.env.secret)
        }

    
}

async function oauthLogin(token) {
    if(token == undefined || token == null){
        throw new Error("A google token üres, próbáld újra", {cause: 400})
    }
    let userDataReq = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)
    let userData = await userDataReq.json()
    console.log(userData)
    let exists = await prisma.user.findMany({where:  {email: userData.email}})
    let userToLogin = null
    if(exists.length==0){
        userToLogin = await prisma.user.create({data: {
            username: userData.email.replace("@gmail.com", ""),
            email: userData.email,
            completed: true,
            pfp: userData.picture,
            oauthType: "google",
            password: null,
            cityId: 1,
            role: "user"
        }})
    } else if(exists.length>0 && exists[0].oauthType == "google"){
        userToLogin = await prisma.user.findFirst({where: {id: exists[0].id}})
        await prisma.user.update({where: {id: userToLogin.id},
        data: {
            pfp: userData.picture
        }
        }

        )
    } else if(exists.length>0 && exists[0].oauthType != "google") {
        throw new Error("Ebbe a profilba nem lehet google-el bejelentkezni", {cause: 400})
    }
    else{
        throw new Error("Hibatörtént a bejelentkezés során", {cause: 403})
    }

    return [jwt.sign(JSON.stringify(await user.getUserById(userToLogin.id)), process.env.secret), userToLogin.username]
}

async function register(username, password, email, cityName) {
    if(username.trim().length<3){
        throw new Error("A felhasználónév túl rövid (<3 karakter)", {cause: 400})
    }
    let existsRows = await prisma.user.count({
        where: {username: username}
    })
    if(existsRows > 0){
        throw new Error("A felhasználónév már létezik", {cause: 400})
    }
    let existsRows2 = await prisma.user.count({
        where: {email: email}
    })
    if(existsRows2 > 0){
        throw new Error("Az email már használatban van", {cause: 400})
    }
    let passHash = crypto.createHash('sha256').update(password).digest('hex');

    let cityData = await city.getCities(cityName)
    let pin = Math.floor(Math.random() * (999999 - 100000) + 999999);

    let rows = await prisma.user.create({data:{
        username: username,
        password: passHash,
        email: email,
        cityId: cityData[0].id,
        oauthType: null,
        tempPin: pin,
        role: "user"
    }
    })

    return `${process.env.url}api/user/verify?username=${username}&id=${rows.id}&pin=${pin}`
}


async function verifyEmail(username, userid, tempPin){
    let rows = await prisma.user.findMany({
        where: {
            username: username,
            id: parseInt(userid)
        }
    })
    if(rows.length==0){
        throw new Error("A felhasználó nem létezik vagy hibásak az adatai", {cause: 404})
    }
    if(Boolean(rows[0].completed)){
        throw new Error("A felhasználó már meg van erősítve", {cause: 400})
    }
    if(parseInt(rows[0].tempPin) != parseInt(tempPin)){
        throw new Error("A megerősítéshez használt kód hibás", {cause: 400})
    }
    await prisma.user.update({
        where: {
            id: parseInt(userid)
        },
        data: {
            tempPin: null,
            completed: true
        }
    })
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
    
    let rows = await prisma.user.findMany({where: {username: decodedJwt.username}})
    let rows2 = await prisma.user.findMany({where: {username: ownerUsername}})
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

async function googleGetTokenFromCode(code){
    let request = await fetch(`https://oauth2.googleapis.com/token
?code=${code}
&client_id=${process.env.gClientId}
&client_secret=${process.env.gClientSecret}
&redirect_uri=${process.env.url}oauth
&grant_type=authorization_code
`.replaceAll("\n", ""), {method: "post",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
       })
    let response = await request.json()
    return response.access_token
}

module.exports = {login, register, verifyEmail, hasPermission, decodeJWT, googleGetTokenFromCode, oauthLogin}
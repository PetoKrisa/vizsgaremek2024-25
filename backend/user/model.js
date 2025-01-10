const {db, prisma} = require("../db")
require("dotenv").config()
const crypto = require("crypto")
const city = require("../city/model")

async function getUserById(id){
    let rows = await prisma.user.findMany({
        where:{
            id: parseInt(id)
        }
    })
    if(rows.length<1){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let u = rows[0]
    let user = {
        id: u.id,
        joinDate: u.joinDate,
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

    let cityRow = await prisma.city.findFirst({
        where: {
            id: u.cityId
        }
    })
    
    user.city = cityRow
    
    return user
}


async function getUserByUsername(username){
    let rows = await prisma.user.findMany({
        where:{
            username: username
        }
    })
    if(rows.length<1){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let u = rows[0]
    let user = {
        id: u.id,
        joinDate: u.joinDate,
        username: u.username,
        city: {},
        bio: u.bio,
        pfp: u.pfp,
        role: u.role
    }
    if(u.pfp != null){
        user.pfp = `${u.pfp}`
    } else{
        user.pfp = `/public/assets/placeholder.png`
    }

    let cityRow = await prisma.city.findFirst({
        where: {
            id: u.cityId
        }
    })
    
    user.city = cityRow

    return user
}

async function updateUserData(userId, cityName, bio) {
    let exitsRows = await prisma.user.count({where:{
        id: parseInt(userId)
    }})
    if(exitsRows == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let cityData = await city.getCities(cityName)
    if(bio.length>255){
        throw new Error("A bio túl hosszú (255+ karakter)", {cause: 400})
    }
    await prisma.user.update({
    where: {
        id: parseInt(userId)
    },
    data:{
        cityId: cityData[0].id,
        bio: bio
    }
        
    })
}


async function deleteUser(userId) {
    let exitsRows = await prisma.user.count({where:{
        id: parseInt(userId)
    }})
    if(exitsRows == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    await prisma.user.delete({where: {
        id: parseInt(userId)
    }})
}

async function changeEmail(userId, newEmail, password) {
    if(newEmail==undefined ||newEmail.length==0 || newEmail==null){
        throw new Error("Az új email nem lehet üres", {cause: 400})
    }
    let exitsRows = await prisma.user.count({where:{
        id: parseInt(userId)
    }})
    if(exitsRows == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    let userRows = await prisma.user.count({where:{
        id: parseInt(userId),
        password: passwordHash
    }})
    if(userRows==0){
        throw new Error("A jelszó nem egyezik", {cause: 400})
    }
    await prisma.user.update({
        where: {id: parseInt(userId)},
        data: {email: newEmail}
    })
}

async function changePassword(userId, newPassword, password) {
    if(newPassword==undefined ||newPassword.length==0 || newPassword==null){
        throw new Error("Az új jelszó nem lehet üres", {cause: 400})
    }
    let exitsRows = await prisma.user.count({where:{
        id: parseInt(userId)
    }})
    if(exitsRows == 0){
        throw new Error("A felhasználó nem létezik", {cause: 404})
    }
    let passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    let userRows = await prisma.user.count({where:{
        id: parseInt(userId),
        password: passwordHash
    }})
    if(userRows==0){
        throw new Error("A jelszó nem egyezik", {cause: 400})
    }
    let newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    await prisma.user.update({
        where: {id: parseInt(userId)},
        update: {password: newPasswordHash}
    })
}

module.exports = {getUserById,getUserByUsername, updateUserData, deleteUser, changeEmail, changePassword}
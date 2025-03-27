const {db} = require("../backend/db")
const fs = require('node:fs');

var file = fs.readFileSync("./tools/városok.csv", "utf-8")
var fileRows = file.split("\n")

async function load(){
    await db.query("SET FOREIGN_KEY_CHECKS=0;")
    await db.query("delete from city;")
    await db.query("alter table city AUTO_INCREMENT=1")
    await db.query("SET FOREIGN_KEY_CHECKS=1;")

    let maxLength = fileRows.length
    let index = 1;
    for(let row of fileRows){
        let splitRow = row.split(";")
        let [rows,fields] = await db.query("insert into city (name, county) values (?,?);", [
            splitRow[0],
            splitRow[3]
        ])
        console.clear()
        console.log(`${index++}/${maxLength}`)
    }
    console.log("Kész")
}

load()

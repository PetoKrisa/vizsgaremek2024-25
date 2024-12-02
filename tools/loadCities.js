const db = require("../backend/db")
const fs = require('node:fs');

var file = fs.readFileSync("./tools/városok.csv", "utf-8")
var fileRows = file.split("\n")

async function load(){
    db.query("delete from city;")

    for(let row of fileRows){
        let splitRow = row.split(";")
        let [rows,fields] = await db.query("insert into city (name, county) values (?,?);", [
            splitRow[0],
            splitRow[3]
        ])
    }
}

load()

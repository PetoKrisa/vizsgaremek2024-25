const path = window.location.pathname.split("/")
const userName = path[path.length-1]


fetch(`/api/user/${userName}`)
.then(r=>r.json())
.then(data=>{
    console.log(data)
    if(data.status != undefined && data.status != 200){
        alert("Hiba: "+data.message)
        return
    }
    document.getElementById("username").innerText = data.username
    document.getElementById("username2").innerText = data.username
    document.getElementById("username3").innerText = data.username

    var joinDate = document.getElementById("joinDate")
    console.log(data)
    var time = new Date(data.joinDate)
    var city = `${data.city.name}, ${data.city.county}`
    
    joinDate.innerText = `Csatlakozott: ${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()-1} • ${city}`

    document.getElementById("bio").innerText = data.bio

    document.getElementById("pfp").src = data.pfp    
})
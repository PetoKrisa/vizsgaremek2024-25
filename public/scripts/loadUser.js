const path = window.location.pathname.split("/")
const userName = path[path.length-1]


fetch(`/api/user/${userName}`)
.then(r=>r.json())
.then(data=>{
    if(data.status != undefined && data.status != 200){
        alert("Hiba: "+ data.message)
        return
    }
    document.getElementById("username").innerText = data.username
    document.getElementById("username2").innerText = data.username
    document.getElementById("username3").innerText = data.username

    var joinDate = document.getElementById("joinDate")
    var time = new Date(data.joinDate)
    var city = `${data.city.name}, ${data.city.county}`
    
    joinDate.innerText = `Csatlakozott: ${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()-1} • ${city}`

    document.getElementById("bio").innerText = data.bio

    let eventCards = document.getElementById("event-cards")
    eventCards.innerHTML = ""
    console.log(data.events)
    for(let i of data.events){
        eventCards.innerHTML += 
        `
        <a href="/event/${i.id}}">
        <div class="event-card">
        <img src="/${i.cover}" alt="Esemény">
        <div class="content">
            <h4>${i.title}</h4>
            <p><i class="glyphicon glyphicon-pushpin"></i> ${i.city.name}, ${i.location}</p>
            <p class="event-date"><i class="glyphicon glyphicon-calendar"></i>${new Date(i.startDate).toLocaleString("hu-HU")}</p>
        </div>
        </div>
        </a>
        `
    }

    document.getElementById("pfp").src = data.pfp
    document.title = `@${data.username} profil`
})
const path = window.location.pathname.split("/")
const eventId = path[path.length-1]

fetch(`/api/event/${eventId}`)
.then(r=>{
    return r.json()
})
.then(data=>{
    console.log(data)
    if(data.status != undefined && data.status != 200){
        alert("Hiba: " + data.message)
        return
    }
    

    document.getElementById("title").innerText = data.title
    document.getElementById("description").innerText = data.description
    document.getElementById("cover").src = "/"+data.cover
    document.getElementById("responses").innerText = data.maxResponse
    document.getElementById("location").innerText = data.location
    document.getElementById("city").innerText = data.city.name
    document.getElementById("organizer").innerHTML = `<a href="/user/@${data.author.username}">@${data.author.username}</a>`
    document.getElementById("views").innerText = `${data.views}`

    document.getElementById("tags").innerHTML = ""
    for(let i = 0; i < data.categories.length; i++){
        document.getElementById("tags").innerHTML += `<span class="tag">${data.categories[i].category.name}</span>`
    }
    if(data.author.username.toLowerCase() == localStorage.getItem("username").toLowerCase()){
        document.getElementById("editLink").classList.remove("hidden")
        document.getElementById("editLink").href = `/event/${eventId}/edit`

        document.getElementById("deleteLink").classList.remove("hidden")
    }

    if(data.ageLimit){
        document.getElementById("tags").innerHTML = "<span class='tag-18'>18+</span>" + document.getElementById("tags").innerHTML
    }

    let startDate = new Date(data.startDate)
    let t1 = startDate.getMonth()+1 
    let t2 = startDate.getHours()-1 
    startDate.setMonth(t1)
    startDate.setHours(t2)
    let endDate;
    if(data.endDate != null){
        endDate = new Date(data.endDate)
        let t3 = endDate.getMonth()+1 
        let t4 = endDate.getHours()-1 
        endDate.setMonth(t3)
        endDate.setHours(t4)
    } else{
        endDate = null
    }

    if(endDate != null){
        document.getElementById("date").innerText = `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()} ${startDate.getHours()<10 ? "0" : ""}${startDate.getHours()}:${startDate.getMinutes()<10 ? "0" : ""}${startDate.getMinutes()} - ${endDate.getFullYear()}.${endDate.getMonth()}.${endDate.getDate()} ${endDate.getHours()<10 ? "0" : ""}${endDate.getHours()}:${endDate.getMinutes()<10 ? "0" : ""}${endDate.getMinutes()}`
    } else{
        document.getElementById("date").innerText = `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()} ${startDate.getHours()<10 ? "0" : ""}${startDate.getHours()}:${startDate.getMinutes()<10 ? "0" : ""}${startDate.getMinutes()}`
    }
    

    for(let i of data.gallery){
        document.getElementById("gallery").innerHTML = document.getElementById("gallery").innerHTML + 
        `<img src='/${i.image}' />`
    }

})

fetch(`/api/event/${eventId}/view`, {
    headers: {"Authorization": `bearer ${localStorage.getItem("token")}`}
})

if(Boolean(localStorage.getItem("isLoggedIn"))){
    fetch(`/api/event/${eventId}/response`)
    .then(r=>{
        if(r.redirected){
            logout()
            return;
        }
        return r.json()
    })
    .then(d=>{
        if(d.resp){
            document.getElementById("respondBtn").innerText = "Nem Érdekel"
        }
    })       
}

function deleteEvent(){
    confirmPopup("Biztosan törli az eseményt?", ()=>{
        fetch(`/api/event/${eventId}`, {method: "delete"})
        .then(r=>r.json())
        .then(d=>{
            if(d.status != 200){
                showErrorMessage(d.message)
                return
            }
            window.location = `/user/@${localStorage.getItem("username")}`

        })
    })
}

function respond(){
    if(!Boolean(localStorage.getItem("isLoggedIn"))){
        window.location = "/login"
    }
    fetch(`/api/event/${eventId}/respond`, {method: "post"})
    .then(r=>{
        window.location.reload()
    })
}
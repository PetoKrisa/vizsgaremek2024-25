const path = window.location.pathname.split("/")
const eventId = path[path.length-1]

fetch(`/api/event/${eventId}`)
.then(r=>r.json())
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
    document.getElementById("organizer").innerText = `${data.author.username}`
    document.getElementById("views").innerText = `${data.views}`

    if(data.ageLimit){
        document.getElementById("tags").innerHTML = "<span class='tag-18'>18+</span>" + document.getElementById("tags").innerHTML
    }

    let startDate = new Date(data.startDate)
    let endDate;
    if(data.endDate != null){
        endDate = new Date(data.endDate)
    } else{
        endDate = null
    }

    document.getElementById("date").innerText = `${startDate.getFullYear()}.${startDate.getMonth()+1}.${startDate.getDate()} ${startDate.getHours()<10 ? "0" : ""}${startDate.getHours()}:${startDate.getMinutes()<10 ? "0" : ""}${startDate.getMinutes()} - ${endDate.getFullYear()}.${endDate.getMonth()+1}.${endDate.getDate()} ${endDate.getHours()<10 ? "0" : ""}${endDate.getHours()}:${endDate.getMinutes()<10 ? "0" : ""}${endDate.getMinutes()}`

    for(let i of data.gallery){
        document.getElementById("gallery").innerHTML = document.getElementById("gallery").innerHTML + 
        `<img src='/${i.image}' />`
    }

})

fetch(`/api/event/${eventId}/view`, {
    headers: {"Authorization": `bearer ${localStorage.getItem("token")}`}
})
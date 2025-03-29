var popularPage = 0
function loadPopular(){
    fetch(`/api/search/popular?page=${popularPage}`)
    .then(r=>r.json())
    .then(d=>{
        console.log(d)

        let eventsRow = document.getElementById("popular")
        if(popularPage == 0){
            eventsRow.innerHTML = ''
        }

        for(let i of d){
            let startDate = new Date(i.startDate)
            eventsRow.innerHTML+= `
            <div class="event-card">
                <a href="/event/${i.id}">
                <img src="/${i.cover}" alt="Esemény képe">
                <div class="overlay">
                    <div class="text-bg">
                    <div class="event-title">${i.title}</div>
                    <p class="location">
                        <i class="glyphicon glyphicon-map-marker"></i>
                        <strong title="${i.city.name}, ${i.city.county}">${i.city.name}</strong>, ${i.location}
                    </p>
                    <p class="date">
                        <i class="glyphicon glyphicon-calendar"></i>
                        ${startDate.toLocaleString("hu-HU")}
                    </p>
                    </div>
                </div>
                </a>
            </div>
            `
        }
        popularPage+=1
    })

    
}

var recommendedPage = 0
function loadRecommended(){
    if(Boolean(localStorage.getItem("isLoggedIn"))){
        document.getElementById("recommended").classList.remove("hidden")
    } else{
        document.getElementById("recommended").classList.remove("hidden")
        document.getElementById("recommended").innerText = "Csak bejelentkezett felhasználóknak"
        return
    }
    fetch(`/api/search/recommended?page=${recommendedPage}`)
    .then(r=>r.json())
    .then(d=>{
        console.log(d)

        let eventsRow = document.getElementById("recommended")
        if(recommendedPage == 0){
            eventsRow.innerHTML = ''
        }

        for(let i of d){
            let startDate = new Date(i.startDate)
            eventsRow.innerHTML+= `
            <div class="event-card">
                <a href="/event/${i.id}">
                <img src="/${i.cover}" alt="Esemény képe">
                <div class="overlay">
                    <div class="text-bg">
                    <div class="event-title">${i.title}</div>
                    <p class="location">
                        <i class="glyphicon glyphicon-map-marker"></i>
                        <strong title="${i.city.name}, ${i.city.county}">${i.city.name}</strong>, ${i.location}
                    </p>
                    <p class="date">
                        <i class="glyphicon glyphicon-calendar"></i>
                        ${startDate.toLocaleString("hu-HU")}
                    </p>
                    </div>
                </div>
                </a>
            </div>
            `
        }
        recommendedPage+=1
    })

    
}

var nearbyPage = 0
function loadNearby(){
    if(Boolean(localStorage.getItem("isLoggedIn"))){
        document.getElementById("nearby").classList.remove("hidden")
    } else{
        document.getElementById("nearby").classList.remove("hidden")
        document.getElementById("nearby").innerText = "Csak bejelentkezett felhasználóknak"
        return
    }
    fetch(`/api/search/nearby?page=${nearbyPage}`)
    .then(r=>r.json())
    .then(d=>{
        console.log(d)

        let eventsRow = document.getElementById("nearby")
        if(nearbyPage == 0){
            eventsRow.innerHTML = ''
        }

        for(let i of d){
            let startDate = new Date(i.startDate)
            eventsRow.innerHTML+= `
            <div class="event-card">
                <a href="/event/${i.id}">
                <img src="/${i.cover}" alt="Esemény képe">
                <div class="overlay">
                    <div class="text-bg">
                    <div class="event-title">${i.title}</div>
                    <p class="location">
                        <i class="glyphicon glyphicon-map-marker"></i>
                        <strong title="${i.city.name}, ${i.city.county}">${i.city.name}</strong>, ${i.location}
                    </p>
                    <p class="date">
                        <i class="glyphicon glyphicon-calendar"></i>
                        ${startDate.toLocaleString("hu-HU")}
                    </p>
                    </div>
                </div>
                </a>
            </div>
            `
        }
        nearbyPage+=1
    })

    
}

loadPopular()
loadRecommended()
loadNearby()
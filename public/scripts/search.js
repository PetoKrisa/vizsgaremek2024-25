var searchParams = new URLSearchParams(window.location.search) 
fetch(`/api/search${window.location.search}`).then(r=>r.json())
.then(d=>{
    console.log(d)
    document.getElementById("resultsCount").innerHTML = `Talált események (${d.allResultCount}db) <span class="pageIndicator">${d.currentPage}. oldal</span>`

    document.getElementById("results").innerHTML = ""

    for(let i of d.results){
        let tags = ""
        if(i.ageLimit == true){
            tags += '<span class="tag tag-koncert">18+</span>'
        }
        for(let tag of i.categories){
            tags += `<span class="tag tag-rock">${tag.category.name}</span>`
        }

        document.getElementById("results").innerHTML += `
        <a href="/event/${i.id}">
        <div class="event-card">
              <img src="/${i.cover}" alt="Esemény képe">
              <div class="event-details">
                <div class="tags">
                  ${tags}
                </div>
                <div class="event-title">${i.title}</div>
                <div class="event-meta">
                  <span><i class="glyphicon glyphicon-map-marker"></i>${i.city.name}, ${i.location}</span><br>
                  <span><i class="glyphicon glyphicon-calendar"></i> ${new Date(i.startDate).toISOString().replace("T", " ").replace(":00.000Z", "")}</span><br>
                  <span><i class="glyphicon glyphicon-user"></i> ${i.maxResponse}</span>
                  <span><i class="glyphicon glyphicon-eye-open"></i> ${i.views}</span>
                </div>
              </div>
            </div>
        </a>
        `
    }

    document.getElementById("pages").innerHTML = ""
    searchParams.set("page", d.currentPage)
    window.history.pushState({}, "", "/search?"+searchParams.toString())
    for(let i = 0; i < d.pages; i++){
        let searchParamsTemp = new URLSearchParams(searchParams.toString())
        searchParamsTemp.set("page", i+1)
        if(i+1 == d.currentPage){
            document.getElementById("pages").innerHTML += `
        <a href="/search?${searchParamsTemp.toString()}"><strong style="text-decoration: underline;">&nbsp;${i+1}&nbsp;</strong></a>
        `
        } else{
            document.getElementById("pages").innerHTML += `
        <a href="/search?${searchParamsTemp.toString()}">&nbsp;${i+1}&nbsp;</a>
        `
        }
    }

    if(searchParams.has("q")){
        document.getElementById("searchBar").value = searchParams.get("q")
    }

})

async function loadFilters() {
    //tags
  fetch("/api/category").then(r=>r.json())
  .then(d=>{
    
    let categories = []
    if(searchParams.has("tags")){
        categories = JSON.parse(searchParams.get("tags"))
        console.log(categories)
    } 
    console.log(d)
    document.getElementById("filterCategories").innerHTML = ""
    for(let i of d){
        let checked = ""
        console.log(categories.includes(i.id))
        if(categories.includes(i.id)){
            checked = "checked"
        }
        document.getElementById("filterCategories").innerHTML += `<div class="checkbox"><label><input type="checkbox" ${checked} class="tagCheckbox" value="${i.id}"> ${i.name}</label></div>`
    }
  })  

  //counties
  if(searchParams.has("county")){
    document.getElementById("megye").value = searchParams.get("county")
  }
  //city
  if(searchParams.has("city")){
    document.getElementById("varos").value = searchParams.get("city")
  }

  if(searchParams.has("startDate")){
    document.getElementById("start-date").value = searchParams.get("startDate")
  }

  document.getElementById("korhatarNone").checked = true
  if(searchParams.has("ageLimit")){
    if(searchParams.get("ageLimit") == "true"){
        document.getElementById("korhatarTrue").checked = true;
        document.getElementById("korhatarNone").checked = false

    } else if(searchParams.get("ageLimit") == "false"){
        document.getElementById("korhatarFalse").checked = true;
        document.getElementById("korhatarNone").checked = false

    }
  }
}

loadFilters()

function applyFilters(){
    let newSearchParams = new URLSearchParams()
    if(document.getElementById("searchBar").value.length>0){
        newSearchParams.set("q", document.getElementById("searchBar").value)
    }

    //tags
    let tags = document.getElementsByClassName("tagCheckbox")
    let selectedTags = []
    for(let i of tags){
        if(i.checked){
            selectedTags.push(parseInt(i.value))
        }
    }
    if(selectedTags.length>0){  
        newSearchParams.set("tags", JSON.stringify(selectedTags))
    }

    //county
    if(document.getElementById("megye").value != ""){
        newSearchParams.set("county", document.getElementById("megye").value)
    }

    //city
    if(document.getElementById("varos").value != ""){
        newSearchParams.set("city", document.getElementById("varos").value)
    }

    //startDate
    if(document.getElementById("start-date").value != ""){
        newSearchParams.set("startDate", document.getElementById("start-date").value)
    }

    //ageLimit
    for(let i of document.querySelectorAll("input[name='korhatar']")){
        if(i.checked && i.value != "none"){
            newSearchParams.set("ageLimit", i.value)
        }
    }

    window.history.pushState({}, "", "/search?"+newSearchParams.toString())
    window.location.reload()
}

function resetTags(){
    for(let i of document.querySelectorAll("input[type='checkbox']")){
        i.checked=false
    }
}

function resetCounty(){
    document.getElementById("megye").value = ""
}

function resetCity(){
    document.getElementById("varos").value = ""
}

function resetStartDate(){
    document.getElementById("start-date").value = ""
}
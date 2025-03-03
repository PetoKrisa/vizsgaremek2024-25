const path = window.location.pathname.split("/")
const eventId = path[path.length-2]

fetch(`/api/event/${eventId}`)
.then(r=>r.json())
.then(data=>{
    console.log(data)
    document.getElementById("title").value = data.title
    document.getElementById("cover-fill").src = `/${data.cover}`
    document.getElementById("city").value = data.city.name
    document.getElementById("description").value = data.description
    document.getElementById("startDate").value = new Date(data.startDate).toISOString().replace("Z", "")
    document.getElementById("endDate").value = new Date(data.endDate).toISOString().replace("Z", "")
    document.getElementById("location").value = data.location
    document.getElementById("maxResponse").value = data.maxResponse

    for(let i of data.gallery){
        document.getElementById("gallery").innerHTML += `
        <span>
                <img src="/${i.image}" alt="Gallery Image" data-id="${i.id}">
                <br>
                <button data-id="${i.id}" class="delete-image-button" onclick="deleteImg(this)">Kép Törlése</button>
        </span>
        `
    }

    document.getElementById("gallery").innerHTML += `
    <button class="add-image-button" onclick="openGallery()">+</button>
    `

    document.getElementById("tags").innerHTML = ""
    for(let i = 0; i < data.categories.length; i++){
        document.getElementById("tags").innerHTML += `
         <span class="tag">
                ${data.categories[i].category.name}
                <button onclick="deleteTag(${data.categories[i].category.id})" class="delete-tag-button">X</button>
            </span>
        `

    }
    document.getElementById("tags").innerHTML += `<button class="add-tag-button" onclick="openTags()">+</button>`
})

fetch("/api/category")
.then(r=>r.json())
.then(d=>{
    for(let i = 0; i < d.length; i++){
        document.getElementById("tags2").innerHTML += `<span class="tag" onclick="addTag('${d[i].name}')">${d[i].name}</span>`
    }
})

async function deleteImg(button){
    let id = button.dataset.id
    confirmPopup("Biztosn törli a képet?", async ()=>{
        await fetch(`/api/event/${eventId}/gallery/${id}`, {method: "delete"})
        window.location.reload()
    })
    
}

function openTags(){
    document.getElementById("addTagDialog").showModal()
}

function closeTags(){
    document.getElementById("addTagDialog").close()
}

async function submitForm(form) {
    const formData = new FormData(form);
    formData.delete('id');
    
    try {
        const response = await fetch(`/api/event/${eventId}`, {
            method: 'PUT',
            body: formData
        });
        
        let rJson = await response.json()

        if (!response.ok) {
            showErrorMessage(rJson.message);
        }
        
        console.log('Success:', rJson);
        document.body.scrollTo({top: 0})
        window.location.reload()
    } catch (error) {
        console.error('Error:', rJson);
        showErrorMessage(error.message);
    }
}

async function deleteCover(){
    console.log("deleteing cover")
    confirmPopup("Biztosan törli a borító képet?", ()=>{
        fetch(`/api/event/${eventId}/deleteCover`).then(r=>r.json())
        .then(d=>{
            if(d.status == 200){
                showMessage(d.message)
            } else{
                showErrorMessage(d.message)
            }
        })
        })
    
}

function addTag(tag){
    document.getElementById("category-input").value = tag;
}

function uploadTag(){
    let tag = document.getElementById("category-input").value
    fetch(`/api/event/${eventId}/category`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({category: tag})
    }).then(r=>r.json())
    .then(d=>{
        if(d.status != 200){
            showErrorMessage(d.message)
        }
        window.location.reload()
    })
    
}


function deleteTag(id){
    fetch(`/api/event/${eventId}/category/${id}`, {method: "delete"})
    .then(r=>r.json())
    .then(d=>{
        if(d.status != 200){
            showErrorMessage(d.message)
        }
        window.location.reload()
    })
}

function openGallery(){
    document.getElementById("galleryDialog").showModal()
}

function closeGallery(){
    document.getElementById("galleryDialog").close()
}

function uploadGallery(){
    let form1 = new FormData(document.getElementById("galleryForm"))

    fetch(`/api/event/${eventId}/gallery`, {method: "post", body: form1})
    .then(r=>r.json())
    .then(d=>{
        if(d.status != 200 && d.status != 201){
            showErrorMessage(d.message)
        }
        window.location.reload()
    })
}
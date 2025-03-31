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
    var startDate = new Date(data.startDate)
    var endDate = new Date(data.endDate)
    startDate.setHours(startDate.getHours())
    endDate.setHours(endDate.getHours())
    
    document.getElementById("startDate").value = startDate.toISOString().replace("Z", "")
    document.getElementById("endDate").value = endDate.toISOString().replace("Z", "")
    document.getElementById("location").value = data.location
    document.getElementById("maxResponse").value = data.maxResponse

    if(data.endDate == null){
        document.getElementById("endDate").value = ''
    }

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
    confirmPopup("Biztosan törli a képet?", async ()=>{
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
    let form1 = new FormData(document.getElementById("galleryForm"));
    let xhr = new XMLHttpRequest();

    xhr.open("POST", `/api/event/${eventId}/gallery`, true);
    xhr.timeout = 0
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            let percentComplete = (event.loaded / event.total) * 100;
            console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
            document.getElementById("uploadProgress").value = Math.floor(percentComplete)
            document.getElementById("uploadProgressText").innerText = `${Math.floor(percentComplete)}%`
        }
    };

    xhr.onload = function () {
        if (xhr.status !== 200 && xhr.status !== 201) {
            let response = JSON.parse(xhr.responseText);
            showErrorMessage(response.message);
        }
        window.location.reload();
    };

    xhr.onerror = function () {
        console.error("Upload failed.");
    };

    document.getElementById("uploadProgress").classList.remove("hidden")
    xhr.send(form1);
}
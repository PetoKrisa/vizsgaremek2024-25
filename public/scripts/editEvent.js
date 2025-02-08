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
    <button class="add-image-button">+</button>
    `
})

async function deleteImg(button){
    let id = button.dataset.id
    confirmPopup("Biztosn törli a képet?", async ()=>{
        await fetch(`/api/event/${eventId}/gallery/${id}`, {method: "delete"})
        window.location.reload()
    })
    
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
    fetch(`/api/event/${eventId}/deleteCover`).then(r=>r.json())
    .then(d=>{
        if(d.status == 200){
            showMessage(d.message)
        } else{
            showErrorMessage(d.message)
        }
    })
}
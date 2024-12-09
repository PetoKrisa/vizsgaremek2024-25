fetch(`/api/user/@${localStorage.getItem("username")}/email`,{
    headers: {"Authorization": `bearer ${localStorage.getItem("token")}`}
})
.then(r=>r.json())
.then(data=>{
    if(data.status != undefined && data.status != 200){
        showErrorMessage(data.message)
        return
    }
    document.getElementById("email").value = data.email
})

fetch(`/api/user/@${localStorage.getItem("username")}`)
.then(r=>r.json())
.then(data=>{
    if(data.status != undefined && data.status != 200){
        showErrorMessage(data.message)
        return
    }
    document.getElementById("city").value = data.city.name
    document.getElementById("bio").value = data.bio
    document.getElementById("pfp").src = data.pfp
    document.getElementById("username").innerText = data.username
    console.log(data)
})

function updateUserData(){
    let formData = new FormData(document.getElementById("userDataForm"))
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);

    fetch(`/api/user/@${localStorage.getItem("username")}`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${localStorage.getItem("token")}`
        },
        body: json
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            showErrorMessage(data.message)
            return
        }
        showMessage(data.message)
    })
}

function updatePfp(){
    let formData = new FormData(document.getElementById("pfpForm"))

    fetch(`/api/user/@${localStorage.getItem("username")}/pfp`, {
        method: "post",
        headers: {
            "Authorization": `bearer ${localStorage.getItem("token")}`
        },
        body: formData
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            showErrorMessage(data.message)
            return
        }
        showMessage(data.message)
        window.location.reload()
    })
}

function deletePfp(){
    fetch(`/api/user/@${localStorage.getItem("username")}/pfp`, {
        method: "delete",
        headers: {
            "Authorization": `bearer ${localStorage.getItem("token")}`
        },
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            showErrorMessage(data.message)
            return
        }
        showMessage(data.message)
        window.location.reload()
    })
}

function updateEmail(){
    let formData = new FormData(document.getElementById("emailForm"))
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);

    fetch(`/api/user/@${localStorage.getItem("username")}/email`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${localStorage.getItem("token")}`
        },
        body: json
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            showErrorMessage(data.message)
            return
        }
        showMessage(data.message)
    })
}

function updatePassword(){
    let formData = new FormData(document.getElementById("passwordForm"))
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);

    fetch(`/api/user/@${localStorage.getItem("username")}/password`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${localStorage.getItem("token")}`
        },
        body: json
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            showErrorMessage(data.message)
            return
        }
        showErrorMessage(data.message)
    })
}

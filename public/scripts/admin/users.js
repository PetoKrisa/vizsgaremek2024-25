var UrlSearchparams = new URLSearchParams(window.location.search)

var selectedRows = [] 

function showAlert(message, type = 'danger') {
    const alertContainer = document.getElementById('alert-container');

    // Create alert div
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show w-75 mx-auto mt-3" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    alertContainer.append(wrapper);
}

function loadTable(){
    fetch(`/api/admin/users${window.location.search}`)
    .then(r=>r.json())
    .then(d=>{
        if(d.status && d.status != 200){
            showAlert(d.message)
        }

        console.log(d)
        
        let tb = document.getElementById("tableBody")
        tb.innerHTML = ""

        for(let i of d.results){
            tb.innerHTML += `
            <tr data-id=${i.id}>
                    <td class="text-center"><input type="checkbox" class="rowCheckbox" data-id="${i.id}" oninput="selectRow(this)"></td>
                    <td class="text-center w-auto px-0">
                        <span class="material-symbols-outlined" data-bs-toggle="modal" data-bs-target="#editPrompt" data-id="${i.id}" role="button">
                            edit_square
                        </span>
                    </td>
                    <td title='${i.id}'>${i.id}</td>
                    <td title='${i.username}'>${i.username != null ? i.username.substring(0,17)+(i.username.length>17?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                    <td title='${i.email}'>${i.email != null ? i.email.substring(0,17)+(i.email.length>17?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                    <td title='${i.password}'>${i.password != null ? i.password.substring(0,7)+"..." : "<span class='text-muted'>null</span>"}</td>
                    <td title='${i.joinDate}'>${new Date(i.joinDate.replace("Z", "")).toLocaleDateString()}</td>
                    <td title='${i.cityId}'>${i.cityId} - ${i.city.name}</td>
                    <td title='${i.bio}'>${i.bio != null ? i.bio.substring(0,20)+(i.bio.length>20?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                    <td title='${i.pfp}'>${i.pfp != null ? i.pfp.substring(0,10)+"..." : "<span class='text-muted'>null</span>"}</td>
                    <td title='${i.completed}'>${i.completed}</td>
                    <td title='${i.role}'>${i.role}</td>
                    <td title='${i.oauthType}'>${i.oauthType != null ? i.oauthType : "<span class='text-muted'>null</span>"}</td>
                </tr>
            `
        }

        let pages = document.getElementById("pagination")
        pages.innerHTML = ""
        if(d.currentPage>1){
            pages.innerHTML += `
            <li class="page-item">
              <a class="page-link" onclick="goToPage(${d.currentPage-1})" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`
        }
        for(let i = 1; i <= d.maxPages; i++){
            if(i==d.currentPage){
                pages.innerHTML += `<li class="page-item active"><a class="page-link" onclick="goToPage(${i})">${i}</a></li>`
            } else{
                pages.innerHTML += `<li class="page-item"><a class="page-link" onclick="goToPage(${i})">${i}</a></li>`
            }
            
        }
        if(d.currentPage<d.maxPages){
            pages.innerHTML += `
            <li class="page-item">
              <a class="page-link" onclick="goToPage(${d.currentPage+1})" aria-label="Previous">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>`
        }
    })
}

function goToPage(page){
    let tempParams = new URLSearchParams(UrlSearchparams.toString())
    tempParams.set("page", page)
    window.history.replaceState({}, "", window.location.pathname+"?"+tempParams.toString())
    loadTable()
}

function search(){
    let searchParams = new URLSearchParams()
    if(document.getElementById("searchInput").value.trim().length == 0){
        window.history.replaceState({}, "", window.location.pathname)
        loadTable()
        return
    }
    searchParams.set("q", document.getElementById("searchInput").value)
    window.history.replaceState({}, "", window.location.pathname+"?"+searchParams.toString())
    loadTable()
    selectedRows = []
    updateDeleteBtn()
}


if(UrlSearchparams.has("q")){
    document.getElementById("searchInput").value = UrlSearchparams.get("q")
}

function updateDeleteBtn(){
    if(selectedRows.length>0){
        document.getElementById("deleteBtn").classList.remove("disabled")
    } else{
        document.getElementById("deleteBtn").classList.add("disabled")

    }
}

function selectRow(checkbox){
    if(checkbox.checked){
        selectedRows.push(parseInt(checkbox.dataset.id))
    } else{
        selectedRows.pop(selectedRows.indexOf(parseInt(checkbox.dataset.id)))
    }
    updateDeleteBtn()
}

function selectAll(){
    selectedRows = []
    for(let i of document.querySelectorAll(".rowCheckbox")){
        if(document.getElementById("selectAllCheckbox").checked){
            i.checked = true
            selectRow(i)
        } else{
            i.checked = false
        }
    }
    if(!document.getElementById("selectAllCheckbox").checked){
        selectedRows = []
    }
    updateDeleteBtn()
}

function deleteSelected(){
    fetch("/api/admin/users", {method: "delete", body: JSON.stringify({idList: selectedRows}), 
headers: {
    "content-type": "application/json"
}})
    .then(r=>r.json())
    .then(d=>{
        if(d.status && d.status != 200){
            showAlert(d.message)
        } else{
            showAlert(d.message, "success")
        }
        console.log(d)
        loadTable()
    })
    document.getElementById("selectAllCheckbox").checked = false
    var modal = bootstrap.Modal.getInstance(document.getElementById("deletePrompt"))
    modal.hide()
    selectedRows = []
    updateDeleteBtn()
}


function editRow(){
    let formData = new FormData(document.getElementById("editUserForm"))
    var json = Object.fromEntries(formData.entries());
    if(json.password == ""){
        delete json.password;
    }
    if(json.oauthType == ""){
        json.oauthType == null
    }
    if(json.bio == ""){
        json.bio = null
    }
    json.completed = (json.completed == "true");
    json.tempPin = parseInt(json.tempPin);
    json.id = parseInt(json.id);
    json.joinDate = json.joinDate.replace("T", " ")+"Z"
    console.log(JSON.stringify(json));

    fetch(`/api/admin/users`, {method: "put", body: JSON.stringify(json), 
        headers: {
            "content-type": "application/json"
        }
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.status && d.status != 200){
            showAlert(d.message)
        } else{
            showAlert(d.message, "success")
            loadTable()
        }
    })
    var modal = bootstrap.Modal.getInstance(document.getElementById("editPrompt"))
    modal.hide()
}


const deletePrompt = document.getElementById('deletePrompt')
if (deletePrompt) {
    deletePrompt.addEventListener('show.bs.modal', event => {
    deletePrompt.querySelector("#deletePromptNumber").innerHTML = selectedRows.length
  })
}

const editPrompt = document.getElementById('editPrompt')
if (editPrompt) {
    editPrompt.addEventListener('show.bs.modal', event => {
    var openedBy = event.relatedTarget

    fetch(`/api/admin/users?id=${openedBy.dataset.id}`)
    .then(r=>r.json())
    .then(d=>{
        user = d.results[0]
        console.log(`${user.completed}`)
        editPrompt.querySelector("#editId").value = user.id
        editPrompt.querySelector("#editUsername").value = user.username
        editPrompt.querySelector("#editEmail").value = user.email
        editPrompt.querySelector("#editCurrentPassword").innerText = user.password
        editPrompt.querySelector("#editJoinDate").value = new Date(user.joinDate).toISOString().slice(0, 16)
        editPrompt.querySelector("#editCityId").value = user.city.name
        editPrompt.querySelector("#editBio").value = user.bio
        editPrompt.querySelector("#editCompleted").value = `${user.completed}`
        editPrompt.querySelector("#editTempPin").value = user.tempPin
        editPrompt.querySelector("#editRole").value = user.role
        editPrompt.querySelector("#editOuathType").value = user.oauthType
        editPrompt.querySelector("#editCurrentPfp").innerText = user.pfp
        editPrompt.querySelector("#currentPfp").src = user.pfp

        editPrompt.querySelector("#userVerificationLink").innerText = `/api/user/verify?username=${user.username}&id=${user.id}&pin=${user.tempPin}`
        editPrompt.querySelector("#userVerificationLink").href = `/api/user/verify?username=${user.username}&id=${user.id}&pin=${user.tempPin}`

        editPrompt.querySelector("#userEventsLink").innerText = `Események`
        editPrompt.querySelector("#userEventsLink").href = `/admin/events?userId=${user.id}`

        editPrompt.querySelector("#userCommentsLink").innerText = `Kommentek`
        editPrompt.querySelector("#userCommentsLink").href = `/admin/comments?userId=${user.id}`

        editPrompt.querySelector("#userProfileLink").innerText = `Profil`
        editPrompt.querySelector("#userProfileLink").href = `/user/@${user.username}`

        editPrompt.querySelector("#deletePfpBtn").dataset.username = user.username
        editPrompt.querySelector("#editPfpBtn").dataset.username = user.username
        
    })


  })
}

function deletePfp(e){
    fetch(`/api/user/@${e.dataset.username}/pfp`, {method: "delete"})
    .then(r=>r.json())
    .then(d=>{
        if(d.status && d.status != 200){
            showAlert(d.message)
        } else{
            showAlert(d.message, "success")
            loadTable()
        }
    })
    var modal = bootstrap.Modal.getInstance(document.getElementById("editPrompt"))
    modal.hide()
}

function updatePfp(e){
    let formData = new FormData(document.getElementById("editPfpForm"))
    fetch(`/api/user/@${e.dataset.username}/pfp`, {method: "post", body: formData})
    .then(r=>r.json())
    .then(d=>{
        if(d.status && d.status != 200){
            showAlert(d.message)
        } else{
            showAlert(d.message, "success")
            loadTable()
        }
    })
    var modal = bootstrap.Modal.getInstance(document.getElementById("editPrompt"))
    modal.hide()
}

loadTable()
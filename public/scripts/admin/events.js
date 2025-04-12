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
    fetch(`/api/admin/events${window.location.search}`)
    .then(r=>r.json())
    .then(d=>{
        if(d.status && d.status != 200){
            showAlert(d.message)
        }

        console.log(d)
        
        let tb = document.getElementById("tableBody")
        tb.innerHTML = ""

        if(document.body.clientWidth>991){
            document.getElementById("lg-table").style.display = "table"
            document.getElementById("sm-cards").style.display = "none"
            document.getElementById("overflowContainer").classList.add("overflow-auto")
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
                        <td title='${i.userId}'>${i.userId} - ${i.user.username != null ? i.user.username.substring(0,17)+(i.user.username.length>17?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                        <td title='${i.title}'>${i.title != null ? i.title.substring(0,17)+(i.title.length>17?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                        <td title='${i.description}'>${i.description != null ? i.description.substring(0,20)+(i.description.length>20?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                        <td title='${i.startDate}'>${new Date(i.startDate.replace("Z", "")).toLocaleDateString()}</td>
                        <td title='${i.cityId}'>${i.cityId} - ${i.city.name}</td>
                        <td title='${i.location}'>${i.location != null ? i.location.substring(0,20)+(i.location.length>20?"..." : "") : "<span class='text-muted'>null</span>"}</td>
                        <td title='${i.maxResponse}'>${i.maxResponse}</td>
                        <td title='${i.ageLimit}'>${i.ageLimit}</td>
                    </tr>
                `
            }
        } else{
            document.getElementById("lg-table").style.display = "none"
            document.getElementById("sm-cards").style.display = "flex"
            document.getElementById("sm-cards").innerHTML = ""
            document.getElementById("overflowContainer").classList.remove("overflow-auto")

            for(let i of d.results){
                document.getElementById("sm-cards").innerHTML += `
                <div class="col-sm-6 col-12 p-0">
                    <div class="card m-1">
                        <div class="card-header d-flex flex-row align-items-center gap-1 flex-grow-1">
                           <input id="checkbox-${i.id}" type="checkbox" class="rowCheckbox" data-id="${i.id}" oninput="selectRow(this)"> 
                           <label for="checkbox-${i.id}" class="w-100">#${i.id}</label>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${i.title}</h5>
                            <p class="card-text"><strong>description:</strong> ${i.description != null ? i.description.substring(0,40)+(i.description>40?"..." : "") : "<span class='text-muted'>null</span>"}<br><strong>user:</strong>${i.userId} - ${i.user.username != null ? i.user.username.substring(0,40)+(i.user.username>40?"..." : "") : "<span class='text-muted'>null</span>"}<br><strong>city:</strong> ${i.city.id} - ${i.city.name}<br><strong>ageLimit:</strong> ${i.ageLimit} </p>
                            <button class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#editPrompt" data-id="${i.id}" role="button">Szerkesztés</button>
                        </div>
                    </div>
                </div>
                `
            }
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
    fetch("/api/admin/events", {method: "delete", body: JSON.stringify({idList: selectedRows}), 
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
    if(json.location == ""){
        json.location == null
    }
    
    if(json.description == ""){
        json.description = null
    }

    json.maxResponse = parseInt(json.maxResponse);
    json.id = parseInt(json.id);
    json.userId = parseInt(json.userId);
    json.startDate = json.startDate.replace("T", " ")+"Z"
    if(json.endDate){
        json.endDate = json.endDate.replace("T", " ")+"Z"
    }
    console.log(JSON.stringify(json));

    fetch(`/api/admin/events`, {method: "put", body: JSON.stringify(json), 
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

    fetch(`/api/admin/events?id=${openedBy.dataset.id}`)
    .then(r=>r.json())
    .then(d=>{
        event = d.results[0]
        editPrompt.querySelector("#editId").value = event.id
        editPrompt.querySelector("#editUserId").value = event.userId
        editPrompt.querySelector("#editTitle").value = event.title
        editPrompt.querySelector("#editDescription").innerText = event.description
        editPrompt.querySelector("#editStartDate").value = new Date(event.startDate).toISOString().slice(0, 16)
        editPrompt.querySelector("#editEndDate").value = new Date(event.endDate).toISOString().slice(0, 16)
        editPrompt.querySelector("#editCityId").value = event.city.name
        editPrompt.querySelector("#editLocation").value = event.location
        editPrompt.querySelector("#editAgeLimit").value = `${event.ageLimit}`
        editPrompt.querySelector("#editMaxResponse").value = event.maxResponse


        editPrompt.querySelector("#eventUserLink").innerText = `/admin/users?id=${event.userId}`
        editPrompt.querySelector("#eventUserLink").href = `/admin/users?id=${event.userId}`

        editPrompt.querySelector("#editEventLink").innerText = `Esemény szerkesztése az oldalon`
        editPrompt.querySelector("#editEventLink").href = `/events/${event.id}/edit`

        editPrompt.querySelector("#eventCommentsLink").innerText = `Kommentek`
        editPrompt.querySelector("#eventCommentsLink").href = `/admin/comments?eventId=${event.id}`
        
    })


  })
}

loadTable()
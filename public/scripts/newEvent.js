function uploadEvent(form){
    let formData = new FormData(form)
    
    fetch("/api/event", {method: "post", body: formData}).then(r=>r.json())
    .then(d=>{
        if(d.status != 200 && d.status != 201){
            showErrorMessage(d.message)
        } else{
            window.location = `/event/${d.id}`
        }

    })

}

fetch("/api/category")
.then(r=>r.json())
.then(d=>{
    console.log(d)
    for(let i = 0; i < d.length; i++){
        document.getElementById("categories-div").innerHTML += `<span class="tag" onclick="addCategory('${d[i].name}')">${d[i].name}</span>`
    }
})

function addCategory(name){
    if(document.getElementById("categories").value == ""){
        document.getElementById("categories").value = name
    } else{
        document.getElementById("categories").value += `, ${name}`
    }
}
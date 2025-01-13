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
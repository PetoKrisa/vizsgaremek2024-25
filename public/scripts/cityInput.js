var cityInputs = document.getElementsByClassName("cityInput")

function loadCities(event){
    if(event.target.value.length>1){
        fetch(`/api/cities?q=${event.target.value}`)
        .then(r=>r.json())
        .then(data=>{
            if(data.status != undefined && data.status != 200){
                return
            }
            document.getElementById("cityInputDatalist").innerHTML = ""
            for(var i of data){
                document.getElementById("cityInputDatalist").innerHTML = document.getElementById("cityInputDatalist").innerHTML + `
                <option value="${i.name}">
                `
            }
        })
    }
    
}

for(let i of cityInputs){
    i.addEventListener("input", loadCities)
}


var isLoggedIn = Boolean(localStorage.getItem("isLoggedIn")) || false

if(isLoggedIn){
    let loggedInItems = document.getElementsByClassName("loggedIn") 
    for(let i of loggedInItems){
        i.classList.add("show")
    }
    document.getElementById("headerPfp").src = `/api/user/@${localStorage.getItem("username")}/pfp`
    document.getElementById("profileLink").href = `/user/@${localStorage.getItem("username")}`
    document.getElementById("profileEditLink").href = `/user/@${localStorage.getItem("username")}/edit`
} else{
    let loggedOutItems = document.getElementsByClassName("loggedOut") 
    for(let i of loggedOutItems){
        i.classList.add("show")
    }
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("isLoggedIn")
    console.log(window.location)
    window.location = `${window.location.origin}/`
}
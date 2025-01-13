var isLoggedIn = Boolean(localStorage.getItem("isLoggedIn")) || false

if(!isLoggedIn){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

}

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
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log(window.location)
    window.location = `${window.location.origin}/`
}
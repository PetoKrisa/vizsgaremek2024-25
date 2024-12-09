function login(){
    var formData = new FormData(document.getElementById("loginForm"))
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);
    fetch("/api/user/login", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: json,
        redirect: "manual"
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            alert("Hiba: "+data.message)
            return
        }
        localStorage.setItem("isLoggedIn", true)
        localStorage.setItem("token", data.jwt)
        localStorage.setItem("username", JSON.parse(json).username)

        window.location = "/user/@"+localStorage.getItem("username")
    })
}   
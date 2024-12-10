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
            showErrorMessage(data.message)
            return
        }
        localStorage.setItem("isLoggedIn", true)
        localStorage.setItem("token", data.jwt)
        localStorage.setItem("username", JSON.parse(json).username)

        window.location = "/user/@"+localStorage.getItem("username")
    })
}   

function register(){
    //validate
    var pass1 = document.getElementById("password")
    var pass2 = document.getElementById("password2")
    if(pass1.value != pass2.value){
        showErrorMessage("A jelszavak nem egyeznek")
        return
    }
    if(!/\d/.test(pass1.value)){
        showErrorMessage("A jelszónak legalább 1 számot kell tartalmaznia")
        return
    }
    if(pass1.value.length < 8){
        showErrorMessage("A jelszó túl rövid (<8 karakter)")
        return
    }

    var formData = new FormData(document.getElementById("registerForm"))
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);
    fetch("/api/user/register", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: json,
        redirect: "manual"
    }).then(r=>r.json())
    .then(data=>{
        if(data.status != undefined && data.status != 200){
            showErrorMessage(data.message)
            return
        }

        confirmPopup("Emailben küldünk egy hitelesítő linket!\n"+data.link, ()=>{
        window.location = "/login"
        })
    })
}
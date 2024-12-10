function showMessage(text){
    document.getElementById("message").style.visibility = "visible"
    document.getElementById("message").style.opacity = 1

    document.getElementById("messageText").innerText = text

    setTimeout(()=>{
        document.getElementById("message").style.visibility = "hidden"
        document.getElementById("message").style.opacity = 0
    }, 2500)
}

function showErrorMessage(text){
    document.getElementById("errorMessage").style.visibility = "visible"
    document.getElementById("errorMessage").style.opacity = 1

    document.getElementById("errorMessageText").innerText = text

    setTimeout(()=>{
        document.getElementById("errorMessage").style.visibility = "hidden"
        document.getElementById("errorMessage").style.opacity = 0
    }, 2500)
}

function confirmPopup(text, okCallback){
    document.getElementById("confirmPopupText").innerText = text
    document.getElementById("confirmPopup").showModal()

    function clickHandler(e){
        okCallback()
        document.getElementById("confirmPopupOk").removeEventListener('click', clickHandler)
        document.getElementById("confirmPopup").close()
    }

    function exitHandler(e){
        document.getElementById("confirmPopupBack").removeEventListener('click', clickHandler)
        document.getElementById("confirmPopup").close()
    }

    document.getElementById("confirmPopupOk").addEventListener("click", clickHandler)
    document.getElementById("confirmPopupBack").addEventListener("click", exitHandler)
}
var replyTo = null
var comments = []

async function loadComments(){
    let response = await fetch(`/api/event/${eventId}/comment`, {redirect: "follow"})
    let data = await response.json()
    comments = data.comments
    displayComments(data.comments)
}

function displayComments(comments){
    let commentsDiv = document.getElementById("comments")
    console.log(comments)
    commentsDiv.innerHTML = ""
    for(let comment of comments){
        commentsDiv.innerHTML += 
        `
        <div class="comment">
                    <p class="author">${comment.user.username}</p>
                    <p class="text">${comment.commentText} <i class="glyphicon glyphicon-share-alt replybtn" onclick="replyToComment(${comment.id})">Válasz</i></p>
        </div>
        `
        for(let reply of comment.replies){
            commentsDiv.innerHTML += 
            `
            <div class="comment reply">
                        <p class="author">${reply.user.username} <span class="black">&gt;</span> ${reply.replyingTo.username}</p>
                        <p class="text">${reply.commentText} 
                        <i class="glyphicon glyphicon-share-alt replybtn" onclick="replyToComment(${reply.id})">Válasz</i>
                        
                        
                        </p>
                        
            </div>
            `
        }
    }
}

loadComments()



function submitComment(){
    let comment = document.getElementById("commentInput").value
    if(comment.length==0){
        return;
    }
    fetch(`/api/event/${eventId}/comment`, {
        method: "post",
        body: JSON.stringify({
            text: comment,
            superCommentId: replyTo
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(r=>r.json())
    .then(d=>{
        if(d.status != 200){
            showErrorMessage(d.message)
        } else{
            window.location.reload()
        }
    })
}

function replyToComment(id){
    if(!Boolean(localStorage.getItem("isLoggedIn"))){
        window.location = "/login"
    }

    replyTo = id
    fetch(`/api/event/${eventId}/comment/${id}`).then(r=>r.json())
    .then(d=>{
        if(d.status != 200){
            showErrorMessage(d.message)
            return;
        }

    document.getElementById("replyingTo").innerHTML = `Válasz ${d.comment.user.username} részére <i style="cursor: pointer;" class="glyphicon glyphicon-remove" onclick="clearReply()"></i>`
    })
       

    }

function clearReply(){
    replyTo = null
    document.getElementById("replyingTo").innerText = ``
}
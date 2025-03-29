var replyTo = null
var replyToTopLevel = null 
var page = 0;
var comments = []

async function loadComments(){
    let response = await fetch(`/api/event/${eventId}/comment?page=${page}`, {redirect: "follow"})
    let data = await response.json()
    comments = data.comments
    displayComments(data.comments)
    page++;
}

function displayComments(comments){
    let commentsDiv = document.getElementById("comments")
    console.log(comments)
    if(page==0){
        commentsDiv.innerHTML = ""
    }
    for(let comment of comments){
        commentsDiv.innerHTML += 
        `
        <div class="comment">
                    <p class="author"><a href="/user/@${comment.user.username}">${comment.user.username}</a></p>
                    <p class="text">${comment.commentText} <i class="glyphicon glyphicon-share-alt replybtn" onclick="replyToComment(${comment.id})">Válasz&nbsp;</i>
                        <i class="glyphicon glyphicon-trash replybtn" onclick="deleteComment(${comment.id})">Törlés&nbsp;</i>
                    </p>
                    </div>
        `
        for(let reply of comment.replies){
            console.log(reply)
            commentsDiv.innerHTML += 
            `
            <div class="comment reply">
                        <p class="author"><a href="/user/@${reply.user.username}">${reply.user.username}</a> <span class="black">&gt;</span> <span title="${reply.replyingTo.commentText}"><a href="/user/@${reply.replyingTo.user.username}">${reply.replyingTo.user.username}</a></span></p>
                        <p class="text">${reply.commentText} 
                        <i class="glyphicon glyphicon-share-alt replybtn" onclick="replyToComment(${reply.id})">Válasz&nbsp;</i>
                        <i class="glyphicon glyphicon-trash replybtn" onclick="deleteComment(${reply.id})">Törlés&nbsp;</i>
                        </p>
                        
            </div>
            `
        }
    }
}

loadComments()

function deleteComment(id){
fetch(`/api/event/${eventId}/comment/${id}`, {method: "delete"})
.then(r=>r.json())
.then(d=>{
    if(d.status != 200){
        showErrorMessage(d.message)
    } else{
        showMessage(d.message)
    }
})
}


function submitComment(){
    let comment = document.getElementById("commentInput").value
    if(comment.length==0){
        return;
    }
    fetch(`/api/event/${eventId}/comment`, {
        method: "post",
        body: JSON.stringify({
            text: comment,
            superCommentId: replyTo,
            topLevelCommentId: replyToTopLevel
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
        console.log(d.comment)
        if(d.comment.topLevelCommentId == null){
            replyToTopLevel = d.comment.id
        } else{
            replyToTopLevel = d.comment.topLevelCommentId
        }
    console.log(replyTo, replyToTopLevel)
    document.getElementById("replyingTo").innerHTML = `Válasz ${d.comment.user.username} részére <i style="cursor: pointer;" class="glyphicon glyphicon-remove" onclick="clearReply()"></i>`
    })
       

    }

function clearReply(){
    replyTo = null
    replyToTopLevel = null
    document.getElementById("replyingTo").innerText = ``
}
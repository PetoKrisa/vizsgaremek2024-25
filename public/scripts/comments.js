
var replyTo = null

async function loadComments(){
    let response = await fetch(`/api/event/${eventId}/comment`)
    let data = await response.json()
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
                    <p class="text">${comment.commentText}</p>
        </div>
        `
        for(let reply of comment.replies){
            commentsDiv.innerHTML += 
            `
            <div class="comment reply">
                        <p class="author">${reply.user.username} <span class="black">&gt;</span> ${reply.replyingTo.username}</p>
                        <p class="text">${reply.commentText}</p>
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
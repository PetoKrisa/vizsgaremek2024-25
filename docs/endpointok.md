# HTML

### GET "/"
Returns `text/html` index.html
___
### GET "/event/:id"
returns `text/html` event.html
___
### GET "/user/@:username"
returns `text/html` user.html
___
### GET "/search"
returns `text/html` search.html
___
### GET "/login"
returns `text/html` login.html
___
### GET "/register"
returns `text/html` register.html

# API
## user
### GET "/api/user/@:username"
response `application/json`:
```
{
id
username
joinDate
city
bio?
pfp?
events: [
		{
		cover
		title
		startDate
		endDate
		}
	]
}
```
___
### PATCH "/api/user/@:username"
body `multipart/form-data`:
```
bio?
city?
pfp? (file)
```
response `application/json` status, message:
___
### DELETE "/api/user/@:username"
If the user has permission it will delete the user
body `applicaion/json`:
```
{
jwt
}
```
response `application/json` status, message:
___
### GET "/api/user/@:username/pfp"
returns the profilepicture as a file
___
### POST "/api/user/login"
body `application/json`
```
{
username
password
}
```
response `application/json`
```
jwt
```
___
### POST "/api/user/register"
body `application/json`
```
{
username
password
email
}
```
response `application/json`
```
jwt
```
___
## Event
### GET "/api/event/:id"
response `application/json`
```
{
id
title
description?
startDate
endDate?
visibility
cover
city
location
maxResponse
responseCount
gallery: [url, url, url]
ageLimit (boolean)
}
```
___
### POST "/api/event"
body `multipart/form-data` :
```
title
description?
startDate
endDate?
visibility (public/private)
cover (file)
city
location
max_response
gallery [] (files)
ageLimit (boolean)
```
response `application/json` status, message
___
### PATCH "/api/event/:id"
body `multipart/form-data` :
```
title?
description?
startDate?
endDate?
visibility? (public/private)
cover? (file)
city?
location?
max_response?
gallery []? (files)
ageLimit? (boolean)
```
response `application/json` status, message
___
### POST "/api/event/:id/respond"
Toggles user response to an event if the user has permission
body `application/json`: 
```
{
jwt
}
```
response `application/json` status, message
___
### POST "/api/event/:id/invite"
Sends an invite to a user, and add them to the invited users of an event, if a user is invited already it will uninvite them
body `application/json`: 
```
{
jwt
invitedUserId
}
```
response `application/json` status, message
___
### GET "/api/event/:id/comment"
body `application/json`:
```
[
	{
	id
	user {id, username, pfpUrl}
	text
	replies [(same comment object)]
	}
]
```
response `application/json` status, message

### POST "/api/event/:id/comment"
body `application/json`:
```
{
jwt
text
superCommentId?
}
```
response `application/json` status, message
### DELETE "/api/comment/:id"
body `application/json`:
```
{
jwt
}
```
response `application/json` status, message
___

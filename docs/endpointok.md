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
### Error model
(If an error occurs the http code will also show an error)
```
{
status: "error",
message: "Example error message!"
}
```
### Authorization header model
Every endpoint that has (token) next to it requires the Authorization header in the request
```
Authorization: "Bearer <token>"
```
## 1. User
### GET "/api/user/@:username"
response `application/json`:
```
{
id
username
joinDate
city {id, name, county}
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
respondedEvents: [
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
body `application/json`:
```
bio?
city? (id int)
```
response `application/json` status, message:
___
### DELETE "/api/user/@:username" (token)
If the user has permission it will delete the user
body `application/json`:
```
{
password
}
```

response `application/json` status, message:
___
### GET "/api/user/@:username/pfp"
returns the profilepicture as a file
___
### POST "/api/user/@:username/pfp" (token)
updates user profilepicture
body `multipart/form-data`:
```
{
pfp
}
```
___
### DELETE "/api/user/@:username/pfp" (token)
deletes users profilepicture
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
city (id int)
}
```
response `application/json` status, message
___
### GET "/api/user/verify"
url query
```
username
userid
temppin
```
response redirect
___
### POST "/api/user/@:username/email" (token)
body `application/json`
```
{
password
email
}
```
response `application/json` status, message
___
### POST "/api/user/@:username/password" (token)
body `application/json`
```
{
password
newPassword
}
```
response `application/json` status, message
___
## 2. Event
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
city {id, name, county}
location
maxResponse
responseCount
gallery: [url, url, url]
ageLimit (boolean)
views
}
```
___
### POST "/api/event" (token)
body `multipart/form-data` :
```
title
description?
startDate
endDate?
visibility (public/private)
cover (file)
city (int id)
location
max_response
gallery [] (files)
ageLimit (boolean)
```
response `application/json` status, message
___
### PATCH "/api/event/:id" (token)
body `multipart/form-data` :
```
title?
description?
startDate?
endDate?
visibility? (public/private)
cover? (file)
city? (int id)
location?
max_response?
gallery []? (files)
ageLimit? (boolean)
```
response `application/json` status, message
___
### POST "/api/event/:id/respond" (token)
Toggles user response to an event if the user has permission

response `application/json` status, message
___
### POST "/api/event/:id/invite" (token)
Sends an invite to a user, and add them to the invited users of an event, if a user is invited already it will uninvite them
body `application/json`: 
```
{
invitedUserId
}
```
response `application/json` status, message
___
## 3. Comment
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
___
### POST "/api/event/:id/comment" (token)
body `application/json`:
```
{
text
superCommentId?
}
```
response `application/json` status, message
___
### DELETE "/api/comment/:id" (token)
deletes comment if user has permission
response `application/json` status, message
___
## 4. Search
### GET "/api/search"
query `application/x-www-form-urlencoded`:
```
q (text to search for)
categories? [] (list of categories to search for)
city?
startDate? (eg.: "2024-10-31 14:30", by default dates that are not in the past)
ageLimit? (boolean)
sortby? (name, startDate) (eg.: "name:desc" "startDate:asc")
page? (int, search only returns 12 per page)
```
response `application/json`:
```
[
	{
	id
	title
	cover
	maxResponse
	responseCount
	startDate
	city
	ageLimit (boolean)
	categories []
	views
	}
]
```
___
### GET "/api/search/popular"
returns the most viewd events that are not expired
response `application/json`: same as regular search
___
### GET "/api/search/recommended"
returns events based on the users intrests
response `application/json`: same as regular search

## 5. Category and cities
### GET "/api/category"
```
q? (category name, search categories)
```
response `application/json`
```
[
	{	
		id
		name
		description
	}
]
```
___
### GET "/api/cities"
query `application/x-www-form-urlencoded`:
```
q? (city name, search cities)
```

response `application/json`
```
[
	{	
		id
		name
		county
	}
]
```

# Function Plan
## 1. Auth
### Register
**Input**
- username: string
- password: string
- email: string
- cityID: number

**Output**
- jsonWebToken: string
___
### login
**Input**
- username: string
- password: string

**Output**
- jsonWebToken: string
___
### checkPermission
**Input**
- jsonWebToken: string
- allowedRoles: string[] (optional)
- ownerID: number (optional)

**Output**
- allowed: boolean
___
## 2. userModel
### User Object Template
```
{
id
username
joinDate
city {id, name, county}
bio?
pfp?
}
```
___
### getUserByID
**Input**
- userID: number

**Output**
- user: object{}
___
### getUserByUsername
**Input**
- userID: number

**Output**
- user: object{}
___
### addUser
**Input**
- username: string
- password: string
- email: string
- cityID: number

**Output**
- none
___
### deleteUser
- userID

**Output**
- none
___
### updateUser
- bio: string (optional)
- cityID: number (optional)
- pfpURL: string (optional)

**Output**
- none
___
### updatePassword
- userID: number
- password: string

**Output**
- none
___
### updateEmail
- userID: number
- email: string

**Output**
- none
___
## 3. eventModel
### Event Object Template
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
### getEventByID
**Input**
- eventID: number

**Output**
- event: object{}
___
### addEvent
**Input**
- eventObject: object
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
gallery [] (urls)
ageLimit (boolean)
```

**Output**
- event: object{}
___
### getEventComments
**Input**
- eventID: number

**Output**
- commentList: list\<comments>
___
### addEventComment
**Input**
- userID: number
- text: string
- superCommentID (optional)

**Output**
- none
___
### deleteEventComment
**Input**
- commentID

**Output**
- none
___
### searchEvents
**Input**
- eventObject: object 
```
q (text to search for)
categories? [] (list of categories to search for)
city?
startDate? (eg.: "2024-10-31 14:30", by default dates that are not in the past)
ageLimit? (boolean)
sortby? (name, startDate) (eg.: "name:desc" "startDate:asc")
page? (int, search only returns 12 per page)
```

**Output**
- eventLlist: list\<event>
___
### deleteEventGalleryImages
**Input**
- imageIDs: List\<number>

**Output**
- none
___

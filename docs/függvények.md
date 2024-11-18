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
gallery [] (files)
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
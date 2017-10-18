# Table of endpoints

| URL                 | HTTP Verb | Action                                   | Required URL Params |
|---------------------|-----------|------------------------------------------|---------------------|
| /user/:username     | GET       | hente info om brukerprofil               | username=[string]   |
| /user/pres          | GET       | hente liste over presentasjoner          |                     |
| /user/login         | GET       | logge inn                                |                     |
| /user               | POST      | lage ny bruker                           |                     |
| /user/pres          | POST      | lage ny presentasjon                     |                     |
| /user/pres/page     | POST      | lage ny side i presentasjon              |                     |
| /user/pres/:id      | PUT       | endre på informasjon om presentasjon     | id=[integer]        |
| /user/:username     | PUT       | endre informasjon om eksisterende bruker | username=[string]   |
| /user/pres/page/:id | PUT       | endre på side                            | id=[integer]        |
| /user/pres/:id      | DELETE    | slette en presentasjon                   | id=[integer]        |

# Beskrivelse av hvert endpoint


## GET

### hente info om brukerprofil
		app.GET("/user/:username", req, res)

### hente liste over presentasjoner
		app.GET("/user/pres", req, res)

### logge inn
		app.GET("/user/login", req, res)
brukernavn passord defineres her


## POST
### lage ny bruker
		app.POST("/user", res, req)
trenger ikke /new, post legger jo til

### lage ny presentasjon
		app.POST("/user/pres", res, req)

### lage ny side i presentasjon:
 		app.POST("/user/pres", res, req)

## PUT
### endre på informasjon om presentasjon
		app.PUT("/user/pres/:id", res, req)

### endre informasjon om eksi.sterende bruker
		app.PUT("/user/:username", res, req)

### endre på side
		app.PUT("/user/pres/page/:id", res, req)


## DELETE
### slette en presentasjon:
		app.DELETE("/user/pres/:id", res, req)

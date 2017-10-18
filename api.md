# Table of endpoints

| URL                  | HTTP Verb | Action                                   |
|----------------------|-----------|------------------------------------------|
| /user/:username      | GET       | hente info om brukerprofil               |
| /user/presentations  | GET       | hente liste over presentasjoner          |
| /user/login          | GET       | logge inn                                |
| /user/               | POST      | lage ny bruker                           |
| /user/presentations/ | POST      | lage ny presentasjon                     |
| /user/presentations  | POST      | lage ny side i presentasjon              |
| /pres/:id            | PUT       | endre på informasjon om presentasjon     |
| /user/:username      | PUT       | endre informasjon om eksisterende bruker |
| /pres/:id            | DELETE    | slette en presentasjon                   |


# Beskrivelse av hvert endpoint


## GET

### hente info om brukerprofil
		app.GET("/user/:username", req, res)

### hente liste over presentasjoner
		app.GET()("/user/presentations/", req, res)

### logge inn
		app.GET()("/user/login/", req, res)
brukernavn passord deifneres her


## POST
### lage ny bruker
		app.POST("/user/", res, req)
trenger ikke /new, post legger jo til

### lage ny presentasjon
			app.POST("/user/presentations/", res, req)

### lage ny side i presentasjon:
			app.POST("/user/presentations/", res, req)

## PUT
### endre på informasjon om presentasjon
		app.PUT("/pres/:id", res, req)

### endre informasjon om eksisterende bruker
		app.PUT("/user/:username", res, req)


## DELETE
### slette en presentasjon:
		app.DELETE("/pres/:id", res, req)

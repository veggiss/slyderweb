# Table of endpoints

	Auth: Demands authorization
	Mw: Middlware
	Sf: Send file

| URL                 | HTTP Verb | Action                                   | Required URL Params |  Auth  |  MW  |   
|---------------------|-----------|------------------------------------------|---------------------|--------|------|
| /                   | GET       | Auth: sf.editor, !Auth: sf.index         | -                   | true   | -    |
| /home               | GET       | sf.index                                 | -                   | -      | -    |
| /editor             | GET       | sf.editor                                | -                   | -      | -    |
| /livemode           | GET       | sf.livemode                              | -                   | -      | -    |
| /userprofile        | GET       | Auth: sf.userprofile, !Auth: sf.index    | -                   | true   | -    |	  
| /user               | GET       | hente info om brukerprofil               | -                   | true   | -    |
| /user/preslist      | GET       | hente liste over presentasjoner          | -                   | true   | -    |
| /user/presentation  | GET       | Hente presentasjons object               | id, username, name  | true   | -    |
| /user/isLogged      | GET       | Bruker autentisering                     | -                   | -      | -    |
| /user/logout        | GET       | Log ut bruker                            | -                   | true   | -    |
| /user/login         | POST      | logge inn                                | username, password  | false  | -    |
| ~~                  | ~~        | Set login timestamp                      | ~~                  | ~~     | true |
| /user               | POST      | lage ny bruker                           | user schema         | false  | -    |
| /user/presentation  | POST      | lage ny presentasjon                     | pres schema         | true   | -    |
| ~~                  | ~~        | Oppdatere presentasjon                   | ~~                  | ~~     | true |
| /user/presentation  | DELETE    | Slette en presentasjon                   | id, username        | true   | -    |
| ~~                  | ~~        | Log event                                | ~~                  | ~~     | true |


# List of return values

## GET

### hente info om brukerprofil
		app.GET("/user")                | Returns: user         | type: object

### hente liste over presentasjoner
		app.GET("/user/preslist")       | Returns: name         | Type: array

### hente presentasjon
		app.GET("/user/presentation")   | Returns: presentation | Type: object

### Bruker autentisering
		app.GET("/user/isLogged")       | Returns: HTTP         | Type: statuscode

## POST

### Bruker autentisering
		app.POST("/user/presentation")  | Returns: presentation | Type: object

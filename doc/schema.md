## Schema for user table

	{
		"type":"JSON",
		"properties":{
			"username":{"type":"string"},
			"password":{"type":"string"},
			"firstName":{"type":"string"},
			"lastName":{"type":"string"},
			"mail":{"type":"string"},
			"profileImg":{"type":"string"},
			"lastLogin":{"type":"number"}
	   }
	}

### Exmaple use:

	{
		"username":"usr123",
		"password":"sfoidfu3453oeriuf234",
		"firstName":"Vegard",
		"lastName":"Schau",
		"mail":"vegaes15@uia.no",
		"profileImg":"path_on_serv/img.jpg",
		"lastLogin":"34598374958734"
	}

## Schema for presentations

	{
		"type":"JSON",
		"properties":{
			"uid":{"type":"integer"},
			"author":{"type":"string"},
			"name":{"type":"string"},
			"bgColors":{"type":"array"},
			"presmode":{"type":"boolean"},
			"originHeight":{"type":"integer"},
			"body":{
				"type":"JSON",
				"properties": {
					"page_n":{
						"type":"JSON",
						"properties": {
							"content":{"type":"string"},
							"notes":{"type":"string"}
						}
					}
				}
			}
		}
	}

### Example use:

	{
		"uid":3141592
		"author":"vegard",
		"name":"Mysuper presentation",
		"bgColors":["hsla(150, 50%, 64%, 1)", "white"],
		"presmode":false,
		"originHeight":1080,
		"body":{
			"page_1":{
				"content":"<div class="content" name="text" style....",
				"notes":"This is my notes for this page"
			}
		}
	}

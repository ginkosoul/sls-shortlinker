// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "sls-shortlinker",
    "version": "1"
  },
  "paths": {
    "/{id}": {
      "get": {
        "summary": "getLink",
        "description": "",
        "operationId": "getLink.get./{id}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "301": {
            "description": "Redirecting to the original Location"
          },
          "404": {
            "description": "Link Not Found"
          },
          "502": {
            "description": "server error"
          }
        }
      },
      "delete": {
        "summary": "deactivateLink",
        "description": "",
        "operationId": "deactivateLink.delete./{id}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Deactivate successfully"
          },
          "403": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Link not found"
          },
          "502": {
            "description": "server error"
          }
        }
      }
    },
    "/": {
      "post": {
        "summary": "setLink",
        "description": "",
        "operationId": "setLink.post./",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/LinkBody"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Link created successfully",
            "schema": {
              "$ref": "#/definitions/LinkResponse"
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "502": {
            "description": "server error"
          }
        }
      }
    },
    "/auth/signin": {
      "post": {
        "summary": "signIn",
        "description": "",
        "operationId": "signIn.post./auth/signin",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AuthBody"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User has been signed in successfully",
            "schema": {
              "$ref": "#/definitions/AuthResponse"
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "409": {
            "description": "Email or password incorect"
          },
          "502": {
            "description": "server error"
          }
        }
      }
    },
    "/auth/signup": {
      "post": {
        "summary": "signUp",
        "description": "",
        "operationId": "signUp.post./auth/signup",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AuthBody"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "User successfully registered",
            "schema": {
              "$ref": "#/definitions/AuthResponse"
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "409": {
            "description": "Email already in use"
          },
          "502": {
            "description": "server error"
          }
        }
      }
    },
    "/listmylinks": {
      "get": {
        "summary": "listLinks",
        "description": "",
        "operationId": "listLinks.get./listmylinks",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "security": [
          {
            "Authorization": []
          }
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "Lists user's links",
            "schema": {
              "$ref": "#/definitions/LinksList"
            }
          },
          "404": {
            "description": "Links not found"
          },
          "502": {
            "description": "server error"
          }
        }
      }
    }
  },
  "definitions": {
    "LifeTime": {
      "enum": [
        "one-time",
        "1 day",
        "3 days",
        "7 days"
      ],
      "title": "LifeTime",
      "type": "string"
    },
    "AuthBody": {
      "properties": {
        "email": {
          "title": "AuthBody.email",
          "type": "string"
        },
        "password": {
          "title": "AuthBody.password",
          "type": "string"
        }
      },
      "required": [
        "email",
        "password"
      ],
      "additionalProperties": false,
      "title": "AuthBody",
      "type": "object"
    },
    "LinkBody": {
      "properties": {
        "url": {
          "title": "LinkBody.url",
          "type": "string"
        },
        "lifetime": {
          "$ref": "#/definitions/LifeTime",
          "title": "LinkBody.lifetime"
        }
      },
      "required": [
        "url",
        "lifetime"
      ],
      "additionalProperties": false,
      "title": "LinkBody",
      "type": "object"
    },
    "LinkResponse": {
      "properties": {
        "shortUrl": {
          "title": "LinkResponse.shortUrl",
          "type": "string"
        },
        "originalUrl": {
          "title": "LinkResponse.originalUrl",
          "type": "string"
        }
      },
      "required": [
        "shortUrl",
        "originalUrl"
      ],
      "additionalProperties": false,
      "title": "LinkResponse",
      "type": "object"
    },
    "LinksList": {
      "items": {
        "$ref": "#/definitions/SingleLink",
        "title": "LinksList.[]"
      },
      "title": "LinksList.[]",
      "type": "array"
    },
    "AuthResponse": {
      "properties": {
        "id": {
          "title": "AuthResponse.id",
          "type": "string"
        },
        "email": {
          "title": "AuthResponse.email",
          "type": "string"
        },
        "refreshToken": {
          "title": "AuthResponse.refreshToken",
          "type": "string"
        },
        "accessToken": {
          "title": "AuthResponse.accessToken",
          "type": "string"
        }
      },
      "required": [
        "id",
        "email",
        "refreshToken",
        "accessToken"
      ],
      "additionalProperties": false,
      "title": "AuthResponse",
      "type": "object"
    },
    "SingleLink": {
      "properties": {
        "id": {
          "title": "SingleLink.id",
          "type": "string"
        },
        "createdAt": {
          "title": "SingleLink.createdAt",
          "type": "string"
        },
        "lifetime": {
          "$ref": "#/definitions/LifeTime",
          "title": "SingleLink.lifetime"
        },
        "originalUrl": {
          "title": "SingleLink.originalUrl",
          "type": "string"
        },
        "shortUrl": {
          "title": "SingleLink.shortUrl",
          "type": "string"
        },
        "visitCount": {
          "title": "SingleLink.visitCount",
          "type": "number"
        }
      },
      "required": [
        "id",
        "createdAt",
        "lifetime",
        "originalUrl",
        "shortUrl",
        "visitCount"
      ],
      "additionalProperties": false,
      "title": "SingleLink",
      "type": "object"
    }
  },
  "securityDefinitions": {
    "Authorization": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    }
  },
  "basePath": "/dev"
};
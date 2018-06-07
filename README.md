# Smart National Park 4.0
[![Build Status](https://travis-ci.com/DreamN/HookWorms-Smart-National-Park-4.0.svg?token=TJpXUXyH6FeVTVskWKZU&branch=master)](https://travis-ci.com/DreamN/HookWorms-Smart-National-Park-4.0)
## Getting Started
### Server Programming
#### Set-Up
- Install [NodeJS](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/getting-started/shell/) -> 'mongodb://localhost/hapi'
- Install dependency

```
  $ cd ServerProgramming/myapp
  $ npm install
```

- Replace GatewayAPI url in [./ServerProgramming/myapp/routes/hapi.js](https://github.com/DreamN/HookWorms-Smart-National-Park-4.0/blob/master/ServerProgramming/myapp/routes/hapi.js)
```js
  [14] const CATurl = "http://10.0.0.10";
```

#### Get Sensors data and insert to DB
```
  $ node dataGetter.js
```

#### Run Web Server
```
  $ npm start
```

### Endpoints
```
  ###################################################################
  # Methods||           URL               ||      Page              #
  ###################################################################
  # [GET ] || /                           || Index                  #
  # [GET ] || /users                      || Participant            #
  # [GET ] || /hapi/                      || hapi_home              #
  # [GET ] || /hapi/teams/all/            || All Teams Data         #
  # [GET ] || /hapi/teams/:teamID         || Team Data              #
  # [GET ] || /hapi/:sensor               || Sensor Data            #
  # [GET ] || /hapi/predicted             || Predicted Data         #
  # [GET ] || /hapi/sendpredicted         || report Predicted Form  #
  # [POST] || /hapi/sendpredicted         || Save Predicted to DB   #
  ###################################################################
```

### Send Predicted Data Form (POST Request)
```json
  {"team_id": "my_team_id", "description": "Forest fire detected!"}
```


## Contributors
- [**Isara Naranirattisai (Dream)**](https://github.com/DreamN): Server Programming
- [**Peerawat Pipattanakulchai (Nay)**](https://www.linkedin.com/in/peerawat-pipattanakulchai-745997117/): Hardware Programming
- [**Siridej Phanathanate (Pao)**](https://www.linkedin.com/in/siridej-phanathanate-aab309115/): Hardware Programming
- [**Patcharapon Jantana (Peach)**](https://web.facebook.com/patcharapon1995): Data Analysis
- [**Thanatcha Sangpetch (Eao)**](https://github.com/ThanatchaEao): Data Analysis

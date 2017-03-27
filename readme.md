# Cacoo API test

1. `$ cd server && npm i`
1. Add the file `server/config.js` (see below for file contents)
1. Within `/server`, run `npm start`

## `server/config.js`

```
module.exports = {
  cacoo: {
    apiUrl: "https://cacoo.com/api/v1/",
    apiKey: "####################",
    consumerKey: "####################",
    consumerSecret: "#################################"
  },
  sessionSecret: "seshhhhhhhhhhhhhh"
}
```

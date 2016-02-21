# Chart the Stock Market App

Third dynamic web application from the Free Code Camp back end development certification.

### Objective: 
Build a full stack JavaScript app that is functionally similar to 
this: http://watchstocks.herokuapp.com/ and deploy it to Heroku.

### User stories: 

  - I can view a graph displaying the recent trend lines for each added stock.
  - I can add new stocks by their symbol name.
  - I can remove stocks.
  - I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.

### Live Version:
https://stock-w.herokuapp.com/

### Requirements:
- Node.js
- NPM
- Mongodb
- Socket.io
- Quandl API

### Installation:

1.Install dependecies 

```sh
$ npm install
```

2.Create a .env file on the app root folder with the following info

```sh
BASEURL=[main url of application]

MONGO_URI=[mongodb url]

QUANDL_API_KEY=[quandl api key]
```
### Run:

```sh
$ npm start
```
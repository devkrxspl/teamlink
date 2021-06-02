//Constants
const express = require("express");
const path = require("path");
const http = require("http");

const root = path.resolve(path.dirname(""));
const room = require(`${root}/lib/socketroom.js`);

//
const header = require(`${root}/core/socket/events/header.js`);
const stream = require(`${root}/core/socket/events/stream.js`);
const reqheader = require(`${root}/core/socket/events/reqHeader.js`);
const info = require(`${root}/core/socket/events/info.js`);

//Variables
var rooms = {};

//Roots
const publicroot = root + "/public";
const htmlroot = publicroot + "/html";

//App Setup
const app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);

app.use(express.static(publicroot));

app.all("/", function(req, res) {
  res.sendFile(htmlroot + "/index.html");
});

//Routing calls
app.get("/call/:path", function(req, res) {

  res.sendFile(htmlroot + "/call.html");
});

//404
app.get("/:path", function(req, res) {
  res.sendFile(htmlroot + "/404.html");
});

//IO
io.sockets.on("connection", function(socket) {

  //Stream handling
  socket.on("header", function(data) {
    header.invoke(data, socket);
  });

  socket.on("reqHeader", function(data) {

    //Send header
    if (data.room in rooms) {
      socket.emit("reqHeader", rooms[data.room].header);
    }
  });

  socket.on("stream", function(data) {
    stream.invoke(data, socket);
  });

  //Socket 
  socket.on("info", function(data) {
    
    //Check if room exists
    if (data.room in rooms) {

      //Room exists, join room
      rooms[data.room].addUser(socket);

    } else {

      //Room doesn't exist, create room
      rooms[data.room] = new room(data.room, socket);
    }
  });

  //Disconnect
  socket.on("disconnect", function() {

    //Loop through all rooms
    for (var i in rooms) {

      //Check if room includes disconnected socket
      if (rooms[i].users.includes(socket)) {
        
        //Remove disconnected socket from room
        rooms[i].removeUser(socket);
        
        //If the room is now empty, delete the room
        if (rooms[i].users.length == 0) {

          delete rooms[i];
          break;
        }
      }
    }
  });
});

server.listen(3001);
console.log();
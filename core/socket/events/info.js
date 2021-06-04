//Constants
const SocketEvent = require("../../../structures/socketevent.js");
const roomhandler = require("../roomhandler.js");
const room = require("../../../lib/socketroom.js");

//Main
module.exports = class InfoEvent extends SocketEvent {
  
  constructor() {
    super({
      name : "InfoEvent",
      description : "Manages new socket connections",
    });
  }

  invoke(socket, data) {

    var rooms = roomhandler.raw;

    if (data.room in rooms) {

      //Room exists, join room
      if (rooms[data.room].users.length < 10) {
        
        //Enough space
        rooms[data.room].addUser(socket);

        //Notify the client everything is ok
        socket.emit("info", undefined);

      } else {
        //Not enough space 
        socket.emit("info", "This room is full.");
      }

    } else {

      //Room doesn't exist, create room
      rooms[data.room] = new room(data.room, socket, 10);

      //Send error to client
      socket.emit("info", undefined);
    }

    roomhandler.update(rooms);
  }
}
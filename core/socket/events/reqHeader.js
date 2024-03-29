//Constants
const SocketEvent = require("../../../structures/socketevent.js");
const roomhandler = require("../roomhandler.js");
const room = require("../../../lib/socketroom.js");

//Main
module.exports = class ReqHeaderEvent extends SocketEvent {
  
  constructor() {
    super({
      name : "ReqHeaderEvent",
      description : "Sends header to requesting socket",
    });
  }

  invoke(socket, data) {

    var rooms = roomhandler.raw;

    if (data.room in rooms) {
      
      //Make sure user is in room before sending header
      if (rooms[data.room].includesUser(socket)) {
        socket.emit("reqHeader", rooms[data.room].header);
      }
    }
  }
}
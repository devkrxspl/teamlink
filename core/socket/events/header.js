//Constants
const SocketEvent = require("../../../structures/socketevent.js");
const roomhandler = require("../roomhandler.js");
const room = require("../../../lib/socketroom.js");

//Main
module.exports = class HeaderEvent extends SocketEvent {
  
  constructor() {
    super({
      name : "Prefix",
      description : "Sets the default prefix for a new guild",
    });
  }

  invoke(data, socket) {

    var rooms = roomhandler.raw;

    if (data.room in rooms) {
      rooms[data.room].updateHeader(data.packet);
    }

    roomhandler.update(rooms);
  }
}
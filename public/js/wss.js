import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";

let socketIO = null;

export const registrSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    socketIO = socket;
    console.log("succesfully connected to socket.io server");
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("emitting pre offer answer");
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      default:
        return;
    }
  });
};

export const sendPreOffer = (data) => {
  console.log("emitting to server pre offer event");
  socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  console.log("emitting to server pre offer answer event");
  socketIO.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);
};

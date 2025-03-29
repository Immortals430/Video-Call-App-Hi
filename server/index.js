require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 5000;
const originUrl = process.env.ORIGIN || "*";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: originUrl,
  },
});

const users = {
  // userId: { socketId, username }
};

const getOnlineUsers = (myUserId = "0") => {
  const onlineUsers = []

  for(const user in users){
    if(user == myUserId) continue
    const obj = {
      userId: user,
      username: users[user]["username"],
      avatar: users[user]["avatar"]
    }
    onlineUsers.push(obj)
  }
  return onlineUsers
}

io.on("connection", (socket) => {
  socket.on(
    "connected",
    ({ myUserId, username, avatar }) => {
      users[myUserId] = { socketId: socket.id, username, avatar };

      const onlineUsers = getOnlineUsers(myUserId)

      socket.emit("online-users", onlineUsers)
      socket.broadcast.emit("new-user", { userId: myUserId, username, avatar});
    }
  );

    socket.on("offer", ({ callerId, userToCallId, offer }) =>{
      io.to(users[userToCallId]["socketId"]).emit("offer", { callerId, offer })
    })

    socket.on("answer", ({ callerId, answer }) =>{
      io.to(users[callerId]["socketId"]).emit("answer", { answer })
    })

    socket.on("icecandidate", ({ outGoingUCallserId, candidate }) => {
      io.to(users[outGoingUCallserId]["socketId"]).emit("icecandidate", { candidate })
    })

    socket.on("end-call", ({ userId, senderId }) => {
      io.to(users[senderId]["socketId"]).emit("end-call", { userId })
    })

  socket.on("disconnect", () => {

    Object.keys(users).forEach((userId) => {
      if (users[userId]["socketId"] === socket.id) {
        delete users[userId];
      }
    });

    const onlineUsers = getOnlineUsers()
    socket.broadcast.emit("online-users", onlineUsers)


    // console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Signaling server running on port 5000");
});

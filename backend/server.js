const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const path = require("path");

dotenv.config();

connectDB();
const app = express();

app.use(express.json()); //to able to accept JSON data

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});
//routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//--------------------------------Deployment--------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "./frontend/build")));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname1, "./frontend/build/index.html"));
  });
} else {
  app.get("/", (_, res) => {
    res.send("API is Running Successfully");
  });
}
//----------------------------------------------------------------
// error handler middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server listening on port ${PORT}`.yellow.bold)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  //create a new socket where frontend join  data
  socket.on("setup", (userData) => {
    console.log("user data:", userData);
    socket.join(userData._id);
    socket.emit("connected");
  });

  //user join a chat socket
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joind room: " + room);
  });

  //tying indicator socket
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  //stop tying indicator socket
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users is empty");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

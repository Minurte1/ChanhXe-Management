const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3002;
require("./config/database.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hostname = process.env.HOST_NAME || "localhost";

// Middleware để gắn `io` vào `req`
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
//setting
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins dynamically
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "src/public/images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//api user
const userRoute = require("./routers/userRouters.js");

app.use("/", userRoute);
//

// Socket.IO logic
const userSockets = {}; // Lưu trữ socket.id của từng user theo userId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id); // Kiểm tra kết nối thành công

  socket.on("user_connected", (userId) => {
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    userSockets[userId] = socket.id;
  });

  socket.on("send_message", (data) => {
    const receiverSocketId = userSockets[data.idNguoiNhan];
    console.log("receiverSocketId", receiverSocketId);
    if (receiverSocketId) {
      console.log("receive_message", data);
      io.to(receiverSocketId).emit("receive_message", data);
    } else {
      console.warn(`Receiver ${data.idNguoiNhan} is not connected.`);
      // Xử lý bổ sung nếu cần, ví dụ: lưu tin nhắn vào cơ sở dữ liệu
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

const configViewEngine = require("./config/viewEngine");
configViewEngine(app);

server.listen(port, hostname, () => {
  console.log(`${hostname}Example app listening on port ${port}`);
});

const express = require("express");
const http = require("http");
var cors = require("cors");
var mqtt = require("mqtt");
const app = express();

var serverPort = 8282;

var server = http.createServer(app);

//set the template engine ejs

app.use(cors());

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.type("text/plain");
  res.status(200).send("YOLO");
});

server.listen(serverPort, () => {
  console.log("ssh websocket server started");
});

/*
mqtt init
*/ 

// mqtt 的基本設定
const client = mqtt.connect("mqtt://localhost:1883", {
  username: "admin",
  password: "admin",
});

// 建立 mqtt 連線並 subscribe topic 
client.on("connect", function () {
  console.log("MQTT CONNECTION START");
  client.subscribe("monosparta/chat");
});

const io = require("socket.io")(server);

io.on("connection", function (socket) {
  socket.on("disconnect", function () {});
  socket.on("chat", function (msg) {
    // 從 client 收到訊息時，使用 topic 傳送訊息到 mqtt broker
    client.publish("monosparta/chat", JSON.stringify(msg));
  });

  // 從 mqtt broker 收到訊息時
  client.on("message", function (topic, msg) {
    try {
      // 以 test 發送訊息給監聽的 client
      if (topic === "monosparta/chat") socket.emit("chat", JSON.parse(msg));
    } catch {
      socket.emit("data", "Node not found.");
    }
  });
});

var express = require("express")
  , app = express()
  , server = require("http").createServer(app)
  , path = require("path")
  , availableInstruments = []
  , io
;


var KEY_ID = "g4rbVcBTVfMFMf4GeZFTjxheBqgAQbc5nJGqef5UtvBZFth8"; //"devfestsp2013gdg"
var server_started = false;

server.listen(3000);

console.log("SERVER PORT: 3000");
console.log("key=", KEY_ID);


app.use(express.static(__dirname + "/public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



app.get("/error", function(req, res){
  res.render("error");
});


app.get("/", function(req, res){

  if (req.query.key !== KEY_ID) {
    res.redirect("/error");
    return true;
  }

  setupSockets();
  res.render("index");
});



app.get("/admin", function(req, res) {
  // Try to prevent people at conference from being smart. =P
  if (req.query.key !== KEY_ID) {
    res.redirect("/");
    return true;
  }

  setupSockets();
  res.render("admin");
});







function setupSockets () {
  if (server_started) return;
  if (!io) {
    io = require("socket.io").listen(server);
  }


  var admin = io
    .of('/admin')
    .on('connection', function (socket) {

      client.emit("message", "ADMIN INICIALIZADO!");
      console.log("ADMIN CONNECTED!");

      //socket.emit("checkin result", "bem-vindo " + data + "\naguarde ser chamado");
      socket.on("checkin result", function(data){
        console.log("ADMIN CHECKIN RESULT", data);
        client.emit("checkin result", data);
      });

      socket.on("disconnect", function () {
        console.log("ADMIN DISCONNECTED!");
      });


  });



  var client = io
    .of('')
    .on('connection', function (socket) {

      console.log("CLIENT CONNECTED!");

      socket.on("checkin", function(data){
        console.log("checkin", socket.id, data);

        //enviar pro server e indicar o ID do socket
        admin.emit("checkin", {"id": data, "socket_id": socket.id});

      });


  });



  server_started = true;
}


setupSockets();


//on utilise express
const express = require("express");
var moment = require('moment');
const app = express();
//on utilise le moteur de template ejs
app.set("view engine", "ejs");
//middleware: on indique que les fichiers statiques (css, stripts js...) sont dans le dossier public
app.use(express.static("public"));
//si un client accede à la racine, on affiche le fichier index.ejs
app.get("/", function (req, res) {
    res.render("index");
});
server = app.listen(process.env.PORT || 8080);
//on utilise socket.io
const io = require("socket.io")(server);
//si un client se connecte...
var nbclients = 0;
var allchatters = 0;
io.on("connection", function (socket) {
    allchatters++;
    // on envoie le nombre de chatters a chaque client
    io.sockets.emit("get_nbusers", {
        nbusers: allchatters
    });
    console.log("connectés: " + allchatters);
    //Si le client nous envoie un message on le renvoie à tous les clients pour l'afficher

    moment.locale("fr");
    socket.on("message", function (data) {
        io.sockets.emit("message", {
            heure: moment().format("HH:mm:ss"),
            pseudo: data.pseudo,
            message: data.message
        });
    });
    socket.on('disconnect', function () {
        allchatters--;
        io.sockets.emit("get_nbusers", {
            nbusers: allchatters
        });
        console.log("connectés: " + allchatters);
    });
});

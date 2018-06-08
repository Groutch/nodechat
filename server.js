//on utilise express
const express = require("express");
const app = express();
//on utilise moment avec les timezone
const moment = require('moment-timezone');
var history = require('./history.json');
var fs = require('fs');

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
    //on envoie l'historique des messages
    //console.log(typeof history);
    for(var i=0; i < history.posts.length;i++){
        socket.emit("message", {
            heure: history.posts[i].heure,
            pseudo: history.posts[i].pseudo,
            message: history.posts[i].message
        });
    }
    // on envoie le nombre de chatters a chaque client
    allchatters++;
    io.sockets.emit("get_nbusers", {
        nbusers: allchatters
    });
    console.log("connectés: " + allchatters);
    //Si le client nous envoie un message on le renvoie à tous les clients pour l'afficher

    //moment().locale("fr");
    socket.on("message", function (data) {
        io.sockets.emit("message", {
            heure: moment().tz("Europe/Paris").format("HH:mm:ss"),
            pseudo: data.pseudo,
            message: data.message
        });
        //on le push dans le tab du json
        history.posts.push({
            heure: moment().tz("Europe/Paris").format("HH:mm:ss"),
            pseudo: data.pseudo,
            message: data.message
        });
        //console.log(history.posts);
        // on ecrit ce tableau dans le json
        fs.writeFile('history.json',JSON.stringify(history), function (err) {
  if (err) return console.log(err);
  console.log('insertion dans fichier history');
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

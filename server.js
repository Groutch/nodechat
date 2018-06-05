//on utilise express
const express=require("express");
const app =express();
//on utilise le moteur de template ejs
app.set("view engine","ejs");
//middleware: on indique que les fichiers statiques (css, stripts js...) sont dans le dossier public
app.use(express.static("public"));
//si un client accede à la racine, on affiche le fichier index.ejs
app.get("/", function(req, res){
    res.render("index");
});
server= app.listen(process.env.PORT || 8080);
//on utilise socket.io
const io = require("socket.io")(server);
//si un client se connecte...
var nbclients = 0;
io.on("connection", function(socket){
    nbclients++;
    console.log("utilisateurs connectés: "+nbclients);
    //Si le client nous envoie un message on le renvoie à tous les clients pour l'afficher
    socket.on("message", function(data){
       io.sockets.emit("message",{pseudo: data.pseudo, message : data.message});
    });
    
});
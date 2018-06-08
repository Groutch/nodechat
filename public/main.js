$(document).ready(function () {
    // on se connecte au serveur 
    //var socket = io.connect("http://127.0.0.1:8080");
    var socket = io();
    $("#divpseudo").show();
    $("#divtext").hide();
    $("#sendpseudo").on("click", function () {
        $("#divpseudo").hide();
        $("#divtext").show();
        socket.emit("sendusername", $("#textpseudo").val());
    });
    //si on appuie sur le bouton envoyer, on envoie le message au serveur
    //$("#sendtext").on("click", sendMessage);
    $("#textchat").on("keypress", function (key) {
        if (key.which == 13) {
            console.log("appui sur la touche entrée");
            sendMessage();
        }
    });

    function sendMessage() {
        if ($("#textchat").val() != "") {
            //on remplace les < et > par leur code HTML histoire de ne pas pouvoir injecter du code
            var textchat = $("#textchat").val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            socket.emit("message", {
                pseudo: $("#textpseudo").val(),
                message: textchat
            });
            $("#textchat").val("");
        }
    }

    //lorsque le serveur nous envoie le nombre d'utilisateurs on l'affiche
    socket.on("get_nbusers", function (data) {
        console.log(data.nbusers);
        $("#nbusers").html("Utilisateurs connectés: " + data.nbusers);
    });

    //lorsque le serveur nous envoie la liste des utilisateurs, on l'affiche
    socket.on("getlistusers", function (data) {
        var msglu = "";
        console.log(data);
        $("#listusers").empty();
        for (var i in data) {
            $("#listusers").append("<p>" + data[i] + "</p>");
        }
    });

    //lorsque le serveur nous envoie un nouveau message on l'affiche
    socket.on("message", function (data) {
        //console.log(data.message);
        //un regex pour voir si c'est un lien vers une image: 
        /*var regexURL = new RegExp("^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$");
        var regexIMG = new RegExp("\.(jpeg|jpg|bmp|png|gif?)$", "i");*/
        console.log(data.message);
        if (data.message.startsWith("http")) {
            console.log("c'est une URL");
            var prefixURL = "<a target='_blank' href='" + data.message + "'>";
            var suffixURL = "</a>";
            if (data.message.endsWith("jpg")||data.message.endsWith("jpeg")||data.message.endsWith("png")||data.message.endsWith("gif")||data.message.endsWith("bmp")) {
                console.log("c'est une image");
                var msgform = "<img src='" + data.message + "' alt='" + data.message + "'>";
            } else {
                var msgform = data.message;
            }
            msgform = prefixURL+msgform+suffixURL;
            $("#chatlog").append("<p>[" + data.heure + "] " + data.pseudo + ": " + msgform + "</p>")
        } else {
            var messageFormated = data.message;
            $("#chatlog").append("<p class='mess'>[" + data.heure + "] " + data.pseudo + ": " + messageFormated + "</p>")
        }
        $("#chatlog").stop().animate({
            scrollTop: $("#chatlog")[0].scrollHeight
        }, 1000);
    });
});

$(document).ready(function () {
    // on se connecte au serveur 
    //var socket = io.connect("http://127.0.0.1:8080");
    var socket = io();
    $("#divpseudo").show();
    $("#divtext").hide();
    $("#sendpseudo").on("click", function () {
        $("#divpseudo").hide();
        $("#divtext").show();
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
    //lorsque le serveur nous envoie un nouveau message on l'affiche
    socket.on("message", function (data) {
        console.log(data.message);
        //un regex pour voir si c'est un lien vers une image: 
        var regex = new RegExp("\.(jpeg|jpg|bmp|png?)$", "i");
        
        if (data.message.match(regex)) {
             $.get(data.message)
            .done(function () {
                var messageFormated = "<a href='" + data.message + "'><img src='" + data.message + "' alt='" + data.message + "'></a>";
                $("#chatlog").append("<p>[" + data.heure + "] " + data.pseudo + ": " + messageFormated + "</p>")
            }).fail(function () {
                var messageFormated = data.message;
                $("#chatlog").append("<p>[" + data.heure + "] " + data.pseudo + ": " + messageFormated + "</p>")
            }) 
        } else {
            var messageFormated = data.message;
            $("#chatlog").append("<p>[" + data.heure + "] " + data.pseudo + ": " + messageFormated + "</p>")
        }
        
    });
});

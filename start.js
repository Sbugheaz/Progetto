var express = require('express');
var app = express();


app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/" + "login.html");
    console.log("Pagina ricevuta!");
});

app.listen(8080, function () {
    console.log('SoundWave - Server avviato. In ascolto sulla porta 8080!');
});
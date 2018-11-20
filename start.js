var express = require('express');
var app = express();


app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile("public/login.html");
});

app.listen(8080, function () {
    console.log('SoundWave - Server avviato. In ascolto sulla porta 8080!');
});
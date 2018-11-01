var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(8080, function () {
    console.log('Server avviato. In ascolto sulla porta 8080!');
});


/*var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 's.wave2019@gmail.com',
        pass: 'soundwave15'
    }
});

var mailOptions = {
    from: 's.wave2019@gmail.com',
    to: 'gc.sbugheaz@gmail.com',
    subject: 'Benvenuto in SoundWave!',
    text: 'La tua registrazione è stata completata correttamente. Ora potrai accedere con le tue credenziali e gestire' +
        'le tue playlist come meglio preferisci, ascoltando tutti i brani che più ti piacciono. Buon divertimento!'
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
*/
/* Modulo che gestisce la pagina di index,
sostanzialmente si tratta di funzionalità di gestione del login */

// Moduli utilizzati

var express = require('express');
var router = express.Router(); // gestisce il routing nel server

router.use(express.static('public'));

/* Restituisce al client la pagina principale, nel caso in cui l'utente sia dentro la sessione
allora viene restituita direttamente la pagina del web player */

router.get('/', function (req, res) {
    if(req.session.idUtente == undefined) // verifica che il parametro (identificativo dell'utente) che discrimina la sessione sia consistente
        res.sendFile('public/login.html', { root: '/var/www/html/' });
    else
        res.sendFile('public/webPlayer.html', { root: '/var/www/html/' });
});


module.exports = router;

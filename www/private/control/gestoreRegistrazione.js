/**
 * Modulo per la gestione della pagina di registrazione.
 */

// Moduli utilizzati
var express = require('express');
var router = express.Router(); // gestisce il routing nel server

/**
 * Chiamata che rende statiche le risorse del server, a partire dalla cartella 'public' per poterle inviare insieme alle
 * pagine.
 */
router.use(express.static('public'));


/**
 * Gestisce l'accesso alle funzionalità della pagina di registrazione, mandandola in seguito ad una richiesta.ù
 */

router.get('/registrazione', function (req, res) {
        res.sendFile('public/registrazione.html', {root: '/var/www/html/'});
        console.log("Pagina di registrazione inviata a " + req.ip.substr(7) + "\n")
});

module.exports = router; //esporta il router cosicchè possa essere chiamato dal file main.js del server
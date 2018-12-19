/**
 * Modulo per la gestione della pagina del web player.
 */

// Moduli utilizzati
var express = require('express');
var router = express.Router(); // modulo che gestisce il routing nel server

/**
 * Chiamata che rende statiche le risorse del server, a partire dalla cartella 'public' per poterle inviare insieme alle
 * pagine.
 */
router.use(express.static('public'));


/**
 * Gestisce l'accesso alle funzionalità della pagina del webPlyaer, mandandola in seguito ad una richiesta di un utente
 * che ha già effettuato l'accesso al sito. Se l'utente non si è collegato rimanda la pagina di login.
 */

router.get('/', function (req, res) {
    if (req.session.idUtente != undefined) {
        res.sendFile('public/webPlayer.html', {root: '/var/www/html/'});
        console.log("Pagina del web player inviata a " + req.ip.substr(7) + "\n");
        var query = "SELECT * " +
            "FROM Account " +
            "WHERE IDUtente = '" + req.session.idUtente + "'";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result.length != 0) res.send(JSON.stringify(result));
            else res.send("ERR");
        });
    }
    else {
        res.redirect('/');
        console.log("Pagina di login inviata a " + req.ip.substr(7) + "\n");
    }
});


module.exports = router; //esporta il router cosicchè possa essere chiamato dal file main.js del server
/**
 * Modulo per la gestione della pagina del web player.
 */

// Moduli utilizzati
var express = require('express');
var router = express.Router(); // modulo che gestisce il routing nel server
var mysql = require('mysql'); // modulo che gestisce l'interazione col database MySQL

/**
 * Inizializzazione della connessione con il database.
 * @type {Connection}
 */
var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "SoundWaveDB",

    typeCast: function castField(field, useDefaultTypeCasting) {
        /**
         *  Vogliamo castare solamente i field contenenti un singolo bit. Se il field ha piu di un bit, non possiamo
         *   assumere che sia un booleano.*/
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            /**
             *  Un buffer in node rappresenta un insieme di interi unsigned da 8 bit. Quindi, il nostro singolo
             *  "bit field" consiste nei bit ad esempio "0000 0001", equivalenti al numero 1.
             */
            return (bytes[0] === 1);
        }
        return useDefaultTypeCasting();
    }
});

//Avvia la connessione al database
con.connect(function(err) {
    if (err) throw err;
});
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
    }
    else {
        res.redirect('/');
        console.log("Pagina di login inviata a " + req.ip.substr(7) + "\n");
    }
});


/**
 * Restituisce i dati dell'utente che ha eseguito il login non appena carica la pagina del web player.
 */
router.get('/utente', function (req, res) {
        var query = "SELECT NomeUtente, Nome, Cognome, DataDiNascita, Email " +
            "FROM Account " +
            "WHERE IDUtente = '" + req.session.idUtente + "'";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            //Se la query restituisce l'utente lo manda al client
            if(result.length != 0) res.send(JSON.stringify(result));
            //Se la query non trova alcun utente il server manda un errore
            else res.send("ERR");
        });
});


module.exports = router; //esporta il router cosicchè possa essere chiamato dal file main.js del server
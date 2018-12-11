/**
 * Modulo per la gestione della pagina di login.
 */

// Moduli utilizzati
var express = require('express');
var router = express.Router(); // gestisce il routing nel server
var mysql = require('mysql'); // gestisce l'interazione col database MySQL

/**
 * Inizializzazione della connessione con il database.
 * @type {Connection}
 */
var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "SoundWaveDB"
});

con.connect(function(err) {
    if (err) throw err;
});

/**
 * Chiamata che rende statiche le risorse del server, a partire dalla cartella 'public' per poterle inviare insieme alle
 * pagine.
 */
router.use(express.static('public'));


/**
 * Gestisce l'accesso ai servizi offerti dall'applicazione, quando l'utente invia la richiesta direttamente alla root
 * del server o alla pagina di login. Tramite l'oggetto session, il server può determinare se si tratti di un utente
 * autenticato e rendirizzarlo al webPlayer o meno e mandare la pagina di login.
*/

router.get('/', function (req, res) {
    if(req.session.idUtente == undefined) { /* verifica che il parametro idUtente, dal quale si determina se la sessione,
                                               sia consistente, sia undefined o meno e restituisce le pagine in base a
                                               questo */
        res.sendFile('public/login.html', {root: '/var/www/html/'});
        console.log("Pagina di login inviata a " + req.ip.substr(7) + "\n");
    }
    else {
        res.sendFile('public/webPlayer.html', { root: '/var/www/html/' });
        console.log("Pagina del web player inviata a " + req.ip.substr(7) + "\n");
    }
});

/**
 * Verifica se i dati di accesso sono corretti a seguito di una richiesta al DBMS, in caso di risposta positiva
 * restituisce la pagina del web player e inizializza la sessione dell'utente, altrimenti manda diversi avvisi
 * a seconda del problema riscontrato.
 */

router.post('/Login', function (req, res) {
    var query = "SELECT * " +
        "FROM Account " +
        "WHERE " + "nomeUtente = '" + req.body.nomeUtente + "' AND " + "password = '" + req.body.password + "'";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        if(result.length != 0 && result[0].verify == 0 && (req.body.nomeUtente != "" || req.body.password != "") ){ // Credenziali corrette
            req.session.idUtente = result[0].idUtente; // Inizia la sessione settanto il relativo parametro identificativo
            var sql = "UPDATE Utente SET StatoOnline = 1 " + "WHERE idUtente=" + req.session.idUtente;
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
            });
            res.send('Log ok!');
        }
        else if(result.length == 0 || (req.body.nomeUtente == "" || req.body.password == "") ){
            res.send("c1"); // Credenziali errate
        }
        else {
            res.send("c2"); // L'utente non ha verificato la mail
        }
    });
});


module.exports = router; //esporta il router cosicchè possa rispondere alle route dal file main.js del server
/**
 * Modulo per la gestione della pagina di login.
 */
// Moduli utilizzati
var express = require('express');
var router = express.Router(); // modulo che gestisce il routing nel server
var mysql = require('mysql'); // modulo che gestisce l'interazione col database MySQL
var crypto = require('crypto'); //modulo che permette la criptografia delle password
var generator = require('generate-password'); //modulo che permette di generare una password casuale
var mailer = require('../mailer');

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

con.connect(function(err) {
    if (err) throw err;
});


mailer.inizializza("s.wave2019@gmail.com", "soundwave15", "gmail");

/**
 * Funzione che richiama la funzione della libreria di hashing per criptare laa password passata come argomento.
 * @param {string} password - La password in chiaro
 * @returns {string} - La password criptata.
 */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
}


/**
 * Funzione che controlla che l'e-mai rispetti la formattazione richiesta.
 * @param email da controllare
 * @returns {boolean} ritorna vero o falso a seconda che la verifica sia soddisfatta
 */
function verificaEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


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
 * restituisce la pagina del web player e inizializza la sessione dell'utente, altrimenti manda diversi errori
 * a seconda del problema riscontrato.
 */
router.post('/Login', function (req, res) {
    var nomeUtente = req.body.nomeUtente;
    var password = hashPassword(req.body.password);
    if(nomeUtente == ""|| password == "") {
        res.send("ERR_1"); //Uno dei due campi è vuoto
    }
    else {
        var query = "SELECT * " +
            "FROM Account " +
            "WHERE " + "NomeUtente = '" + nomeUtente + "' AND " + "Password = '" + password + "'";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        // Controllo se i dati di accesso siano validi
        if (result.length != 0 && result[0].Attivazione == 1) {
            req.session.idUtente = result[0].IDUtente; // Inizia la sessione settanto il relativo parametro identificativo
            var query = "UPDATE Account SET StatoOnline = 1 WHERE IDUtente = " + req.session.idUtente;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
            });
            res.send('OK');
            console.log("L'utente " + nomeUtente + " ha effettuato l'accesso.\n");
        } else if (result.length == 0) {
            res.send("ERR_2"); //Non è stata trovata alcuna corrispondenza tra i dati inseriti e un account nel database
        } else {
            res.send("ERR_3"); // L'utente non ha verificato la mail
        }
    });
    }
});

/**
 * Funzione che gestisce il logout di un utente.
 */
router.get('/Logout', function (req, res) {
    var query1 = "UPDATE Account SET StatoOnline = 0 " + "WHERE IDUtente=" + req.session.idUtente;
    var query2 = "SELECT NomeUtente FROM Account WHERE IDUtente = '" + req.session.idUtente + "'";
    req.session.idUtente = undefined;
    con.query(query1, function (err, result, fields) {
        if (err) throw err;
    });
    con.query(query2, function (err, result, fields) {
        if (err) throw err;
        console.log("L'utente " + result[0].NomeUtente + " si è disconnesso.\n");
    });
    res.end('OK');
});

/**
 * Gestisce il recupero della password da parte di un utente, verificando che l'e-mail esista a seguito di una richiesta
 * al DBMS, in caso di risposta positiva invia una e-mail all'utente per il recupero.
 */

router.post('/RecuperoPassword', function (req, res) {
    var email = req.body.email;
    if (email == "") {
        res.send("ERR_1"); //Il campo email è vuoto
    }
    else if(!verificaEmail(email)) {
        res.send("ERR_2")
    }
    else {
        var query = "SELECT * " +
            "FROM Account " +
            "WHERE " + "Email = '" + email + "'";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            // Controllo se l'email inserita esiste e l'account ad essa associato è attivato
            if (result.length != 0 && result[0].Attivazione == 1) {
                var nuovaPassword = generator.generate({
                    length: 14,
                    numbers: true,
                    uppercase: true,
                    strict: true
                });
                mailer.inviaMailRipristinoPassword(result[0].NomeUtente, result[0].Email, nuovaPassword);
                nuovaPassword = hashPassword(nuovaPassword);
                var query = "UPDATE Account SET Password = '" + nuovaPassword + "' WHERE IDUtente= '" + result[0].IDUtente +" '";
                con.query(query, function (err, result, fields) {
                    if (err) throw err;
                });
                res.send('OK');
            }
            else if (result.length == 0) {
                res.send("ERR_3"); //Non è stata trovata alcuna corrispondenza tra l'email inserita e un account nel database
            }
            else {
                res.send("ERR_4"); // L'utente non ha verificato la mail
            }
        });
    }
});


module.exports = router; //esporta il router cosicchè possa rispondere alle route dal file main.js del server
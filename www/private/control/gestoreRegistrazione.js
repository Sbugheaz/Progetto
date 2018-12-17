/**
 * Modulo per la gestione della pagina di registrazione.
 */
// Moduli utilizzati
var express = require('express');
var router = express.Router(); // gestisce il routing nel server
var mysql = require('mysql'); // modulo che gestisce l'interazione col database MySQL
var crypto = require('crypto'); //modulo che permette la criptografia delle password
var mailer = require('../mailer'); //modulo che gestisce le comunicazioni del server via mail

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


//Inizializza l'account gmail del server con cui inviare le mail agli utenti
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
 * Funzione che verifica se un'e-mail inserita per la registrazione di un account è già associata ad un altro account
 * o è disponibile.
 * @param email - E-mail che l'utente vuole utilizzare per la registrazione.
 */
function verificaEsistenzaEmail(email) {
        var query = "SELECT Email " +
            "FROM Account " +
            "WHERE " + "Email = '" + email + "'";
        con.query(query, function (err, result, fields) {
                if (err) throw err;
                // Controllo se i dati di accesso siano validi
                if (result.length != 0) return true; //L'e-mail passata è disponibile e non è utilizzata da
                // nessun account all'interno del database
                else return false; //L'e-mail passata è già associata ad un account all'interno del database
        });
}


/**
 * Chiamata che rende statiche le risorse del server, a partire dalla cartella 'public' per poterle inviare insieme alle
 * pagine.
 */
router.use(express.static('public'));


/**
 * Gestisce l'accesso alle funzionalità della pagina di registrazione, mandandola in seguito ad una richiesta.
 */
router.get('/', function (req, res) {
        res.sendFile('public/registrazione.html', {root: '/var/www/html/'});
        console.log("Pagina di registrazione inviata a " + req.ip.substr(7) + "\n")
});


module.exports = router; //esporta il router cosicchè possa essere chiamato dal file main.js del server
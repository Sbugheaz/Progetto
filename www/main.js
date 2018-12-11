/** Il server è gestito secondo tre route, una per ciascuna pagina di SoundWave:
* - Login, pagina di accesso alle funzionalità del sito, che mostra dei campi da compilare per accedervi;
* - Registrazione, pagina che permette di inserire i dati richiesti per registrarsi al sito;
* - WebPlayer, pagina che adempie a tutte le funzionalità per cui il sito è stato progettato.
 */
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session'); // modulo che si occupa della gestione delle sessioni degli utenti che accedono
                                         // al sito web.
var bodyParser = require('body-parser'); // modulo che permette di interpretare il corpo di una risposta http
var debug = require('debug')('progetto:server'); //modulo che permette l'inizializzazione della porta di ascolto
var http = require('http'); //modulo necessario alla creazione del server HTTP
var gestoreLogin = require('./private/control/gestoreLogin'); // control che gestisce la pagina di login
var gestoreRegistrazione = require('./private/control/gestoreRegistrazione'); // control che gestisce la pagina di registrazione
var gestoreWebPlayer = require('./private/control/gestoreWebPlayer'); // control che gestisce la pagina del web player
var app = express();

/**
 * Imposta la porta e la memorizza in express
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Creazione del server HTTP.
 */

var server = http.createServer(app);

/**
 * Il server si mette in ascolto sulla porta fornita, su tutte le interfacce di rete.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Funzione che normalizza una porta e restituisce il numero, una stringa o false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener per gli eventi "error" del server HTTP.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Porta ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' richiede privilegi elevati');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' già in uso');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener per gli eventi "listening" del server HTTP.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'porta ' + addr.port;
    debug('Server in ascolto sulla ' + bind);
    console.log("SoundWave\nServer avviato. In ascolto sulla porta 3000!\n");
}

/**
 * Intercetta il segnale SIGINT (CTRL + C da tastiera) e scrive sulla console che il server è stato terminato
 * manualmente.
 */
process.on('SIGINT', function () {
    console.log("Server terminato a causa di un'interruzione manuale.\n");
    process.exit();
});

// Parametri di configurazione della sessione
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// Utility per interpretare il corpo delle richieste post
app.use( bodyParser.json() );

app.use(bodyParser.urlencoded({
    extended: true
}));

// Route per la pagina principale

app.use('/', gestoreLogin);

// Route per la pagina di registrazione

app.use('/Registrazione', gestoreRegistrazione);

// Route per la pagina del web player
app.use('/WebPlayer', gestoreWebPlayer);

/**
 * Gestisce gli errori 404 di pagina non trovata. Deve essere messa più in basso rispetto a tutte le altre funzioni, di modo che intercetti
 * solamente le richieste non intercettate da nessun altro route. Manda la pagina error.html.
 */
app.use(function (req, res) {
    res.sendFile('public/error.html', { root: '/var/www/html/' });
    console.log('404 NOT FOUND - ' + req.url + '\n');
});
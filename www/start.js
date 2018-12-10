var express = require('express');
var app = express();
const appRoot = '/var/www/html/'; // Directory root del server.
var debug = require('debug')('progetto:server');
var http = require('http');
var path = require('path');
const bodyParser = require('body-parser'); // Legge i parametri della post.
const cookieParser = require('cookie-parser'); // Gestisce i cookie.
const session = require('express-session'); // Gestisce le sessioni degli utenti che accedono al sito web.
global.serverAddress = "http://localhost"; // Indirizzo IP del server.
global.app = app;
global.appRoot = appRoot;
const router = require('express').Router();

/**
 * Imposta la porta e la memorizza in express
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
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
 * Event listener for HTTP server "error" event.
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
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * Intercetta il segnale SIGINT (CTRL + C da tastiera) e avverte tramite log che il server è stato terminato
 * manualmente.
 */
process.on('SIGINT', function () {
    console.log("Server terminato a causa di un'interruzione manuale.");
    process.exit();
});


/**
 * Funzione di logging che sulla console mostra ogni messaggio preceduto dall'orario del server.
 * @param args - Gli argomenti da passare alla console.log.
 */
app.log = function (...args) {
    var arguments = Array.prototype.slice.call(args);
    arguments.unshift('[' + (new Date()).toLocaleTimeString() + ']');
    console.log.apply(console, arguments);
};

/**
 * Di ogni richiesta in arrivo, logga l'IP richiedente, il metodo richiesto e il path richiesto.
 */
app.use(function timeLog(req, res, next) {
    app.log('IP richiedente: ' + req.ip);
    app.log('Metodo: ' + req.method);
    app.log('PATH richiesto: ' + req.url + '\n');
    next();
});

/**
 * L'accesso diretto ai file html viene impedito, per evitare che un utente possa accedere direttamente alla pagina del
 * webplayer senza essere autenticato.
 */
app.use('*.html', function (req, res, next) {
    res.status('403').end('Errore 403 File nascosto');
});

app.use(express.static(__dirname + '/public'));

/**
 * Inizializzazione del bodyParser (body delle post), del cookieParse e della session. I cookie vengono fatti scadere
 * dopo un giorno.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 8.64e7} //la valenza dei cookie è impostata ad un giorno
}));

/**
 * Gestisce l'accesso ai servizi offerti dall'applicazione, quando l'utente invia la richiesta direttamente alla root
 * del server. Tramite l'oggetto session, il server può determinare se si tratti di un utente autenticato e rendirizzarlo
 * al webPlayer o meno e mandare la pagina di login.
 */
app.route('/').get(function (req, res) {
    if (req.session && !req.session.dati_utente) {
        res.redirect('/webPlayer');
    }
    else res.redirect('/login');
});

/**
 * Manda la pagina di login in seguito ad una richiesta di /login.
 */
app.route("/login").get(function(req, res) {
    res.sendFile('login.html', { root: path.join(__dirname, 'public') });
});

/**
 * Manda la pagina di registrazione in seguito ad una richiesta di /registrazione.
 */
app.route("/registrazione").get(function(req, res) {
    res.sendFile('registrazione.html', { root: path.join(__dirname, 'public') });
});

/**
 * Gestisce l'accesso ai servizi offerti dall'applicazione, quando l'utente invia una richiesta di /webplayer.
 * Tramite l'oggetto session, il server può determinare se si tratti di un utente autenticato e rendirizzarlo
 * al webPlayer o meno e mandare la pagina di login.
 */
app.route('/webplayer').get(function (req, res) {
    if (!req.session && req.session.dati_utente) {
        res.redirect('/login');
    } else res.sendFile('webPlayer.html', { root: path.join(__dirname, 'public') });
});

/**
 * Gestisce gli errori 404 di pagina non trovata. Deve essere messa più in basso rispetto a tutte le altre funzioni, di modo che intercetti
 * solamente le richieste non intercettate da nessun altro route. Manda la pagina error.html.
 */
app.use(function (req, res) {
    res.sendFile('error.html', { root: path.join(__dirname, 'public') });
    app.log('404 NOT FOUND - ' + req.url + '\n');
});
const express = require('express');
const app = express();
const appRoot = '/var/www/html/'; // Directory root del server.
const bodyParser = require('body-parser'); // Legge i parametri della post.
const cookieParser = require('cookie-parser'); // Gestisce i cookie.
const session = require('express-session'); // Gestisce le sessioni degli utenti che accedono al sito web.
global.serverAddress = "https://localhost"; // Indirizzo IP del server.
const fs = require('fs'); // Modulo per l'accesso al file system.
global.app = app;
global.appRoot = appRoot;
const autenticazioneControl = require('./private/control/autenticazionecontrol'); // Modulo che gestisce le funzionalità relative all'autenticazione degli utenti.
const gestioneAmiciControl = require('./private/control/gestioneamicicontrol'); // Modulo che gestisce le funzionalità relative alle amicizie tra gli utenti.
const gestionePlaylistControl = require('./private/control/gestioneplaylistcontrol'); // Modulo per la gestione delle playlist da parte degli utenti.
const riproduzioneControl = require('./private/control/riproduzionecontrol'); // Modulo per la gestione dello streaming.
const connessionedb = require('./private/connessionedb'); // Modulo che interfaccia il server con il database.
const https = require('https');

/**
 * Campo della risposta che indica ai browser che la ricevono che le risorse del server possono essere
 * accedute da qualsiasi origine. Necessario per rispondere all'applicazione mobile.
 */
app.use(function setHeader(req, res, next) {
    res.set({"Access-Control-Allow-Origin": "*"});
    next();
});

/**
 * Anche questo route è necessario per la gestione dell'applicazione mobile. Difatti spesso le richieste da parte
 * dell'applicazione mobile vengono prima mandate tramite delle CORS, in cui l'applicazione (o il browser) richiede
 * prima la conferma di validità della richiesta al server (tramite il metodo OPTIONS).
 */
app.options("*", function (req, res) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "origin, x-requested-with, content-type",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    });
    res.send();
});

/**
 * Semplice funzione di logging che wrappa console.log, in modo che ogni messaggio stmapato sulla console
 * venga preceduto dall'orario del server.
 * @param args - Gli argomenti da passare alla console.log.
 */
app.log = function (...args) {
    var arguments = Array.prototype.slice.call(args);
    arguments.unshift('[' + (new Date()).toLocaleTimeString() + ']');
    console.log.apply(console, arguments);
};

/**
 * Intercetta il segnale SIGINT (CTRL + C da tastiera) e avverte tramite log che il server è stato terminato
 * manualmente.
 */
process.on('SIGINT', function () {
    app.log('Server terminato a causa di SIGINT.');
    process.exit();
});

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
 * Gestisce l'accesso ai servizi offerti dall'applicazione, quando l'utente invia la richiesta direttamente alla root
 * del server. Tramite l'oggetto session, il server può discriminare se si tratta di un utente autenticato o meno. Nel
 * primo caso, questo verrà redirezionato al webplayer, nel secondo al login.
 */
app.route('/').get(function (req, res) {
    if (req.session && !req.session.dati_utente) {
        res.redirect('/webplayer');
    }
    else res.redirect('/login');
});

/**
 * L'accesso diretto ai file html viene impedito, per evitare che un utente possa accedere direttamente alla pagina del
 * webplayer senza essere autenticato.
 */
app.use('*.html', function (req, res, next) {
    res.status('403').end('403 Forbidden');
});

/**
 * Tramite la chiamata che segue viene consentito l'accesso alle risorse statiche del server, a partire dalla cartella
 * public (come specificato sopra, fanno eccezione i file html, in quanto le richieste per questi vengono prima
 * intercettate dal route precedente e ricevono una risposta 403.
 */
app.use(express.static(appRoot + 'public'));

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
    cookie: {maxAge: 8.64e7} //un giorno
}));

/**
 *  Invia la pagina del webplayer. Se l'utente non è loggato, viene redirezionato alla pagina di login.
 */
app.route('/webplayer/?').get(function (req, res) {
    if (!req.session || !req.session.dati_utente) {
        res.redirect('/login');
    }
    else res.sendFile(appRoot + 'public/webplayer.html');
});

/**
 * /webplayer/* viene utilizzato come entry point per tutte le funzionalità per cui un utente necessita di essere
 * registrato e verificato. Se un utente non verificato tenta di accedere ad una di queste funzionalità, il server
 * rifiuta di server la richiesta inviando la risposta NOTVERIFIED.
 */
app.route('/webplayer/*').all(function (req, res, next) {
    if (!req.session || !req.session.dati_utente) res.redirect('/login');
    else if (req.session.dati_utente.verifica_registrazione) next();
    else res.send('NOTVERIFIED');
});

/**
 * Inizializza i moduli del server.
 */
// I dati utente scadono dopo 15 secondi, il timeout di disconnessione è impostato a tre minuti.
autenticazioneControl.inizializza(15, 3);
// I dati relativi alle amicizie di ogni utente scadono dopo 15 secondi.
gestioneAmiciControl.inizializza(15);
// I dati della cache delle playlist scadono dopo 30 secondi, quelli della cache degli artisti ogni 15 minuti.
gestionePlaylistControl.inizializza(30, 15);
// Le riproduzioni dei brani vengono caricate ogni 15 minuti, gli url dei brani vengono tenuti in una cache per 15 minuti
// e le ultime riproduzioni di ogni utente vengono caricate ogni 30 secondi.
riproduzioneControl.inizializza(15, 15, 30);

/**
 * Corrisponde in parte al metodo avviaRicerca individuato in fase di analisi. In fase di progettazione si è
 * pensato di unificare la ricerca per utenti, brani, artisti, playlist e album.
 */
app.route('/u/cerca/?').post(function (req, res) {
    var stringaDaCercare = req.body.query;
    if (stringaDaCercare) {
        connessionedb.richiestaRicerca(stringaDaCercare, req.session.dati_utente.id_utente, function (dati, esitoOperazione) {
            if (esitoOperazione === 'OK') res.json(dati);
            else res.send(esitoOperazione);
        });
    } else res.send('EMPTYQUERY');
});


/**
 * Gestione delle 404, deve essere messo piu' in basso rispetto a tutte le altre funzioni, di modo che intercetti
 * solamente le richieste non intercettate da nessun altro route.
 * */
app.use(function (req, res, next) {
    app.log('404 NOT FOUND - ' + req.url + '\n');
    res.status(404).send('Ci spiace, ma non troviamo quello che stai cercando.');
});

/**
 * Funzione per avviare il server. Innanzitutto carica i certificati per l'utilizzo di HTTPS, poi crea il server, avvia
 * il gestore, e una volta che questo ha terminato le sue operazioni si mette in ascolto sulla porta 443. Viene inoltre
 * messo in ascolto sulla porta 80 un redirecter delle richieste HTTP.
 */
function avviaServer() {
    var privateKey = fs.readFileSync(appRoot + 'private/ssl/key.pem');
    var certificate = fs.readFileSync(appRoot + 'private/ssl/cert.pem');
    var httpsServer = https.createServer({key: privateKey, cert: certificate}, app);
    app.log("Avvio del gestore del server...");
    require("./private/gestore/gestore").inizializza(() => {
        httpsServer.listen(443, function () {
            app.log("In ascolto sulla porta 443...");
        });
        var httpRedirecter = express();
        httpRedirecter.route("*").all(function (req, res, next) {
            res.redirect("https://" + req.headers.host + req.path);
        });
        httpRedirecter.listen(80, function () {
            app.log("Redirezionatore HTTP in ascolto sulla porta 80...");
        });
    });
}


avviaServer();


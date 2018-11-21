var express = require('express');
var app = express();
var debug = require('debug')('progetto:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8080');
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
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
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
 * Manda la pagina di login in seguito ad una richiesta di pagina principale.
 */
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/" + "login.html");
    console.log("GET pagina di login");
});

app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/public/" + "login.html");
    console.log("GET pagina di login");
});

/**
 * Manda la pagina di registrazione in seguito ad una richiesta di /registrazione.
 */
app.get("/registrazione", function(req, res) {
    res.sendFile(__dirname + "/public/" + "registrazione.html");
    console.log("GET pagina di registrazione");
});

/**
 * Manda la pagina relativa al web player in seguito ad una richiesta di /webplayer.
 */
app.get("/webplayer", function(req, res) {
    res.sendFile(__dirname + "/public/" + "webPlayer.html");
    console.log("GET pagina del web player");
});
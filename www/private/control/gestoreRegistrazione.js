/**
 * Modulo per la gestione della pagina di registrazione.
 */
// Moduli utilizzati
var express = require('express');
var router = express.Router(); // modulo che gestisce il routing nel server
var mysql = require('mysql'); // modulo che gestisce l'interazione col database MySQL
var crypto = require('crypto'); // modulo che permette la criptografia delle password
var mailer = require('../mailer'); // modulo che gestisce le comunicazioni del server via mail
/* Vettori per la gestione delle attivazioni degli account, in base al numero presente nel link di attivazione, servono a
discriminare se un link sia valido o meno per attivare un account */
var numeriAttivazione = []; // array che contiene i codici degli account non attivati
var numeriAccountAttivati = []; // array che contiene i codici degli account già attivi

/**
 * Creazione di un pool di connessioni per permettere la comunicazione con il database, in questo modo ogni richiesta
 * avverrà su una connessione distinta per evitare il flooding di richieste al database.
 * @type {Pool}
 */
var con = mysql.createPool({
        host: "localhost",
        user: "admin",
        password: "password",
        database: "SoundWaveDB",
        multipleStatements: true,
        waitForConnections: true,
        queueLimit: 1000,

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

//Inizializza l'account gmail del server con cui inviare le mail agli utenti
mailer.inizializza("s.wave2019@gmail.com", "soundwave15", "gmail");

/**
 * Funzione che richiama la funzione della libreria di hashing per criptare laa password passata come argomento.
 * @param {string} password - La password in chiaro.
 * @returns {string} - La password criptata.
 */
function hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('base64');
}

/**
 * Funzione che controlla che l'e-mail rispetti la formattazione richiesta.
 * @param email - Email da controllare.
 * @returns {boolean} ritorna vero o falso a seconda che il formato dell'email sia corretto o meno.
 */
function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
}

/**
 * Funzione che controlla che il nome utente rispetti la formattazione richiesta.
 * @param nomeUtente - Nome utente da controllare.
 * @returns {boolean} ritorna vero o falso a seconda che il formato del nome utente sia corretto  o meno.
 */
function validateUsername(nomeUtente) {
        var testo = /^[A-Za-z][A-Za-z0-9]{1,20}$/;
        return testo.test(String(nomeUtente));
}

/**
 * Funzione che controlla che il nome e il cognome rispettino la formattazione richiesta.
 * @param nome - Stringa da controllare.
 * @returns {boolean} ritorna vero o falso a seconda che la stringa sia formattata correttamente o meno.
 */
function validateName(nome) {
        var testo = /^[A-Z][a-z]{1,15}(\s[A-Z][a-z]{1,15})*$/;
        return testo.test(String(nome));
}

/**
 * Funzione che controlla che la password rispetti la formattazione richiesta.
 * @param password - Password da controllare.
 * @returns {boolean} ritorna vero o falso a seconda che la password sia formattata correttamente o meno.
 */
function validatePassword(password) {
        var testo = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        return testo.test(String(password));
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
        console.log("Pagina di registrazione inviata a " + req.ip.substr(7) + "\n");
});

/**
 * Funzione che gestisce la registrazione di un nuovo account. Controlla che tutti i dati inseriti siano corretti e che
 * nome utente ed e-mail non siano già utilizzati da un altro account. Invia i dati al DBMS e una mail contenente un
 * link di attivazione all'utente che ha effettuato la registrazione. Fino a quando l'utente non attivarà il proprio
 * account cliccando sul link ricevuto non potrà usufruire delle funzionalità della piattaforma.
 */
router.post('/registrati', function (req, res) {
        var nome = req.body.nome;
        var cognome = req.body.cognome;
        var data_nascita = req.body.data_nascita;
        var sesso = req.body.sesso;
        var email = req.body.email;
        var nomeUtente = req.body.nomeUtente;
        var password = req.body.password;
        if(!validateName(nome) || !validateName(cognome) || data_nascita == "" || !validateEmail(email) ||
             !validateUsername(nomeUtente) || !validatePassword(password))
                res.send("ERR_1"); //i dati inseriti non rispettano il formato corretto
        else {
            var query1 = "SELECT Email " +
                "FROM Account " +
                "WHERE Email = '" + email + "'";
            con.query(query1, function (err, result, fields) {
                if (err) throw err;
                //controllo se l'email sia disponibile o meno
                if (result.length != 0)
                    res.send("ERR_2"); //l'e-mail è già associata ad un altro account
                else {
                    var query2 = "SELECT NomeUtente " +
                        "FROM Account " +
                        "WHERE NomeUtente = '" + nomeUtente + "'";
                    con.query(query2, function (err, result, fields) {
                        if (err) throw err;
                        if (result.length != 0)
                            res.send("ERR_3"); //il nome utente è già utilizzato da un altro account}
                        else {
                            var query3 = "INSERT INTO Account (nomeUtente, password, Email, Nome, Cognome, Sesso," +
                                " dataDiNascita, Attivazione) VALUES ('" + nomeUtente + "', '" + hashPassword(password) +
                                "', '" + email + "', '" + nome + "', '" + cognome + "', '" + sesso + "', '" + data_nascita + "', 0)";
                            con.query(query3, function (err, result, fields) {
                                if (err) throw err;
                                else {
                                    var randNum = Math.floor(Math.random() * (99999999 - 10000000) + 10000000) + 1;
                                    numeriAttivazione.push(randNum);
                                    var urlAttivazione = "http://192.168.33.10:3000/Registrazione/" + randNum + "/" + nomeUtente;
                                    mailer.inviaMailAttivazioneAccount(nome, cognome, email, urlAttivazione);
                                    res.send("OK");
                                }
                            });
                        }
                    });
                }
            });
        }
});

/**
 * Funzione che viene invocata quando un nuovo utente registrato clicca il link di attivazione dell'account ricevuto
 * tramite mail al seguito della registrazione. Segna l'account dell'utente come attivato, consentendogli di accedere
 * alla piattaforma alle successive richieste di login.
 */
router.get('/((\\d+)' + '/(\\w+))', function (req, res) {
    var flag = false;
    var nomeUtente = req.url.split("/")[2];
    var query1 = "SELECT Attivazione " +
        "FROM Account " +
        "WHERE NomeUtente = '" + nomeUtente + "'";
    con.query(query1, function (err, result, fields) {
        if (err) throw err;
        else if (result == 0)
            res.redirect('/Error');
        else if (result[0].Attivazione == 1) {
            for(var i = 0; i<numeriAccountAttivati.length; i++) {
                if (numeriAccountAttivati[i] == req.url.split("/")[1]) {
                    var tmp = numeriAccountAttivati[i];
                    numeriAccountAttivati[i] = numeriAccountAttivati[numeriAccountAttivati.length-1];
                    numeriAccountAttivati[numeriAccountAttivati.length-1] = tmp;
                    flag = true;
                    break;
                    }
                }
            if(flag == true) {
                res.send('<!DOCTYPE html>\n' +
                    '<html lang="it">\n' +
                    '<head>\n' +
                    '<link rel="stylesheet" type="text/css" href="../stylesheets/login.css">\n' +
                    '<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">\n' +
                    '<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                    '<title>SoundWave - Attivazione Account</title>\n' +
                    '<link rel="icon" href="../images/Onda.png" type="image/png" />\n' +
                    '</head>\n' +
                    '<body background="../images/Sfondo.jpg">\n' +
                    '<div style=" width: 30%; margin: 1rem;">\n ' +
                    '<img src="../images/Logo.png" alt="logo" style="width:100%;">\n'+
                    '</div>\n' +
                    ' <p id="testo-home" style="margin: 3rem auto;">Il tuo account è già stato attivato!<br> Sarai ' +
                    'reindirizzato alla pagina principale tra <span id ="countdown">10</span> secondi.\n' +
                    '<a class="lk" onclick="window.location.href=\'/\'">Clicca qui</a> se non vuoi attendere oltre.\n' +
                    '</p>\n' +
                    '</body>\n'+
                    '<script type="text/javascript">\n' +
                    '    \n' +
                    '    var seconds = 11;\n' +
                    '    \n' +
                    '    function countdown() {\n' +
                    '        seconds = seconds - 1;\n' +
                    '        if (seconds < 0) {\n' +
                    '            window.location = "/";\n' +
                    '        } else {\n' +
                    '            document.getElementById("countdown").innerHTML = seconds;\n' +
                    '            window.setTimeout("countdown()", 1000);\n' +
                    '        }\n' +
                    '    }\n' +
                    '    countdown();\n' +
                    '    \n' +
                    '</script>\n' +
                    '</html>');
                }
            else
                res.redirect('/Error');
            }
            else {
                for(var i = 0; i<numeriAttivazione.length; i++) {
                    if (numeriAttivazione[i] == req.url.split("/")[1]) {
                        flag = true;
                        break;
                    }
                }
                if(flag == true) {
                    var query2 = "UPDATE Account SET Attivazione = 1 WHERE NomeUtente = '" + nomeUtente + "'";
                    con.query(query2, function (err, result, fields) {
                        if (err) throw err;
                        else {
                            console.log("L'utente " + nomeUtente + " ha attivato l'account.\n");
                            res.send('<!DOCTYPE html>\n' +
                                '<html lang="it">\n' +
                                '<head>\n' +
                                '<link rel="stylesheet" type="text/css" href="../stylesheets/login.css">\n' +
                                '<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">\n' +
                                '<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                                '<title>SoundWave - Attivazione Account</title>\n' +
                                '<link rel="icon" href="../images/Onda.png" type="image/png" />\n' +
                                '</head>\n' +
                                '<body background="../images/Sfondo.jpg">\n' +
                                '<div style=" width: 30%; margin: 1rem;">\n ' +
                                '<img src="../images/Logo.png" alt="logo" style="width:100%;">\n'+
                                '</div>\n' +
                                ' <p id="testo-home" style="margin: 3rem auto;">Il tuo account è adesso attivo!<br> Sarai ' +
                                'reindirizzato alla pagina principale tra <span id ="countdown">10</span> secondi.\n' +
                                '<a class="lk" onclick="window.location.href=\'/\'">Clicca qui</a> se non vuoi attendere oltre.\n' +
                                '</p>\n' +
                                '</body>\n'+
                                '<script type="text/javascript">\n' +
                                '    \n' +
                                '    var seconds = 11;\n' +
                                '    \n' +
                                '    function countdown() {\n' +
                                '        seconds = seconds - 1;\n' +
                                '        if (seconds < 0) {\n' +
                                '            window.location = "/";\n' +
                                '        } else {\n' +
                                '            document.getElementById("countdown").innerHTML = seconds;\n' +
                                '            window.setTimeout("countdown()", 1000);\n' +
                                '        }\n' +
                                '    }\n' +
                                '    countdown();\n' +
                                '    \n' +
                                '</script>\n' +
                                '</html>');
                            numeriAccountAttivati.push(numeriAttivazione[numeriAttivazione.length - 1]);
                            numeriAttivazione.pop();
                        }
                    });
                }
                else
                    res.redirect('/Error');
            }
        });
});

module.exports = router; //esporta il router cosicchè possa essere chiamato dal file main.js del server
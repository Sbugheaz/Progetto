/**
 * Modulo che si occupa dell'invio delle mail per l'attivazione degli account e il recupero della password.
 */
const nodemailer = require('nodemailer'); // Modulo di nodejs per l'invio delle email.
var indirizzoMail; // Indirizzo email utilizzato per inviare le email
var transporter; // Transporter di nodemailer, utilizzato per inviare le email.
const indirizzoServer = global.serverAddress; // Indirizzo del server, viene incluso nei link che vengono inviati tramite mail.

/**
 * Inizializza il modulo creando il transporter con i dati passati come argomento.
 * @param {string} mail - Indirizzo dell'account con cui inviare le email.
 * @param {string} password - Password per accedere all'account con cui inviare le email.
 * @param {string} servizio - Servizio email utilizzato. Es.: gmail.
 */
exports.inizializza = function (mail, password, servizio) {
    indirizzoMail = mail;
    transporter = nodemailer.createTransport({
        service: servizio,
        auth: {
            user: indirizzoMail,
            pass: password
        },
        port: 587
    });
};

/**
 * Invia una email contenente l'URL per ripristinare la propria password ad un utente che ha effettuato la richiesta.
 * @param {string} utente - Il nome dell'utente che intende ripristinare la sua password.
 * @param {string} email - L'email dell'utente che intende ripristinare la sua password.
 * @param {string} urlPaginaRipristino - L'URL della pagina di ripristino da fornire all'utente.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.inviaMailRipristinoPassword = function (utente, email, urlPaginaRipristino, callback) {
    var html = '<body><h2>SoundWave</h2><div>Ciao ' + utente + '! Per ripristinare la tua password, clicca ' +
        '<a href="' + indirizzoServer + '/ripristino/' + urlPaginaRipristino + '">qui</a>'+ ' .</div>' +
        '<div>Questo link ha una validità di tre ore.</div></body>';
    inviaMail(email, 'SoundWave - Ripristino password', html, callback);
};

/**
 *
 * @param {string} utente - Il nome dell'utente che intende attivare il suo account.
 * @param {string} email - L'email dell'utente che intende attivare il suo account.
 * @param {string} urlPaginaConferma - L'URL della pagina alla quale l'utente deve accedere per verificare il suo account.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.inviaMailDiConferma = function (utente, email, urlPaginaConferma, callback) {
    var html = '<body><h2>SoundWave</h2><div>Ciao ' + utente + '! Per attivare il tuo account su SoundWave, clicca ' +
        '<a href="' + indirizzoServer + '/attivazione/' + urlPaginaConferma + '">qui</a>'+ ' .</div>' +
        '<div>Questo link ha una validità di un giorno.</div></body>';
    inviaMail(email, 'SoundWave - Benvenuto', html, callback);
};

/**
 * Funzione generalizzata per l'invio di una email.
 * Esegue la callback inviando MAILERR se l'operazione non è andata buon fine, e OK altrimenti.
 * @param {string} destinatario - Destinatario dell'email.
 * @param {string} oggetto - Oggetto dell'email.
 * @param {string} contenuto - Contenuto HTML dell'email.
 * @param {function} callback - Funzione da eseguire una volta terminate le operazioni.
 */
function inviaMail(destinatario, oggetto, contenuto, callback) {
    var opzioni = {
        from: indirizzoMail,
        to: destinatario,
        subject: oggetto,
        html: contenuto
    };
    transporter.sendMail(opzioni, function (err) {
        if (err) {
            callback('MAILERR');
            console.log(err);
        }
        else {
            callback('OK');
            console.log('Inviata mail a ' + destinatario + '.\n');
        }
    });
}
/**
 * Modulo che si occupa dell'invio delle mail per l'attivazione degli account e il recupero della password.
 */
var nodemailer = require('nodemailer'); // Modulo di nodejs per l'invio delle email.
var indirizzoMail; // Indirizzo email utilizzato per inviare le email
var transporter; // Transporter di nodemailer, utilizzato per inviare le email.

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
    });
};

/**
 *
 */
exports.inviaMailRipristinoPassword = function (nome, cognome, emailDestinatario, passwordTemporanea) {
    var oggettoMail = "SoundWave - Recupero password";
    var contenutoMail = "Ciao " + nome + " " + cognome + "!\nHai recentemente richiesto il recupero della password dal nostro sito. " +
        "Qui di seguito troverai una password provvisoria con cui poter effettuare il tuo prossimo accesso. Ti " +
        "invitiamo ad accedere e aggiornarla.\n\nPassword temporanea: " + passwordTemporanea;
    var opzioni = {
        from: indirizzoMail,
        to: emailDestinatario,
        subject: oggettoMail,
        text: contenutoMail
    };
    transporter.sendMail(opzioni, function (err) {
        if (err)  console.log("Errore nel tentativo di invio della mail a " + emailDestinatario + ".\n");
        else console.log("Email di recupero password inviata a " + emailDestinatario + ".\n");
    });
};


/**
 *
 * @param {string} utente - Il nome dell'utente che intende attivare il suo account.
 * @param {string} email - L'email dell'utente che intende attivare il suo account.
 * @param {string} urlPaginaConferma - L'URL della pagina alla quale l'utente deve accedere per verificare il suo account.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
/*
exports.inviaMailDiConferma = function (utente, email, urlPaginaConferma, callback) {
    var html = '<body><h2>SoundWave</h2><div>Ciao ' + utente + '! Per attivare il tuo account su SoundWave, clicca ' +
        '<a href="' + indirizzoServer + '/attivazione/' + urlPaginaConferma + '">qui</a>'+ ' .</div>' +
        '<div>Questo link ha una validità di un giorno.</div></body>';
    inviaMail(email, 'SoundWave - Benvenuto', html, callback);
};
*/
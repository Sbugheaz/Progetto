/**
 * Modulo che si occupa dell'invio delle mail per l'attivazione degli account e il recupero della password.
 */
var nodemailer = require('nodemailer'); // Modulo per l'invio delle email.
var indirizzoMail; // Indirizzo email utilizzato per inviare le email
var transporter; // Transporter di nodemailer, utilizzato per inviare le email.

/**
 * Inizializza il modulo creando il transporter con i dati passati come argomento.
 * @param {string} mail - Indirizzo dell'account del sito con cui inviare le e-mail.
 * @param {string} password - Password per accedere all'account del sito con cui inviare le e-mail.
 * @param {string} servizio - Servizio e-mail utilizzato dal sito. Es.: gmail.
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
 * Funzione che manda l'e-mail contenente una password temporanea ad un utente che ha richiesto il recupero della password.
 * @param nome - Nome dell'utente a cui è destinata la mail.
 * @param cognome - Cognome dell'utente a cui è destinata la mail.
 * @param emailDestinatario - E-mail dell'utente che ha richiesto il recupero della password.
 * @param passwordTemporanea - Password con cui l'utente potrà effettuare il prossimo accesso che viene inviata via mail.
 */
exports.inviaMailRipristinoPassword = function (nome, cognome, emailDestinatario, passwordTemporanea) {
    var oggettoMail = "SoundWave - Recupero password";
    var contenutoMail = "Ciao " + nome + " " + cognome + "!\n\nHai recentemente richiesto il recupero della password dal nostro sito. " +
        "Qui di seguito troverai una password provvisoria con cui poter effettuare il tuo prossimo accesso. Ti " +
        "invitiamo ad accedere e ad aggiornarla.\n\nPassword temporanea: " + passwordTemporanea;
    var opzioni = {
        from: indirizzoMail,
        to: emailDestinatario,
        subject: oggettoMail,
        text: contenutoMail
    };
    transporter.sendMail(opzioni, function (err) {
        if (err)  console.log("Errore nel tentativo di invio della mail di recupero password a " + emailDestinatario + ".\n");
        else console.log("Email di recupero password inviata a " + emailDestinatario + ".\n");
    });
};

/**
 * Funzione che manda l'e-mail per l'attivazione dell'account ad un utente che ha eseguito la registrazione.
 * @param nome - Nome dell'utente a cui è destinata la mail.
 * @param cognome - Cognome dell'utete a cui è destinata la mail.
 * @param emailDestinatario - E-mail con cui l'utente ha effettuato la registrazione.
 * @param urlAttivazione - Link che al click dell'utente esegue l'attivazione dell'account.
 */
exports.inviaMailAttivazioneAccount = function (nome, cognome, emailDestinatario, urlAttivazione) {
    var oggettoMail = "SoundWave - Benvenuto!";
    var contenutoMail = "Ciao " + nome + " " + cognome + ", ti diamo il benvenuto in SoundWave!\n\nSe stai leggendo questa mail hai " +
        "compilato correttamente il modulo per la registrazione del tuo account. Per completare la tua registrazione e " +
        "poter accedere al nostro sito ti basta cliccare sl link di attivazione: " + urlAttivazione;
    var opzioni = {
        from: indirizzoMail,
        to: emailDestinatario,
        subject: oggettoMail,
        text: contenutoMail
    };
    transporter.sendMail(opzioni, function (err) {
        if (err)  console.log("Errore nel tentativo di invio della mail di attivazione dell'account a " + emailDestinatario + ".\n");
        else console.log("Email di attivazione dell'account inviata a " + emailDestinatario + ".\n");
    });
};
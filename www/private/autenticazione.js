/**
 * Questo modulo si occupa di tutto ciò che concerne l'autenticazione, la registrazione e la gestione dei dati
 * degli utenti.
 */
const connessionedb = require('connessioneDB'); // Modulo per accedere al database.
const mailer = require('mailer'); // Modulo per inviare le email di attivazione e ripristino.
const crypto = require('crypto'); // Modulo per cifrare le password prima di memorizzarle sul database.
const timerDisconnessioneUtenti = {}; // Oggetto contenente i timer che regolano lo stato online degli utenti
const path = require('path');
const mkdirp = require('mkdirp'); // Modulo per la creazione condizionale delle directory
const router = require('express').Router();

/**
 * Tempo in minuti che deve passare dall'ultima richiesta di un utente perchè questo venga impostato come
 * offline sul database.
 */
var timeoutDisconnessione;
/**
 * Tempo in secondi oltre il quale i dati della cache di un utente vengono considerati scaduti e devono essere
 * nuovamente richiesti al DBMS.
 */
var scadenzaDatiUtente;
/**
 * Oggetto contenente gli url per il ripristino della password o la conferma di registrazione degli utenti.
 * I nomi delle proprietà di questo oggetto sono gli url stessi. Il valore di queste proprietà è un oggetto contenente
 * il nome utente a cui si riferisce l'url, un booleano che indica se si tratta di un link di ripristino (true) o di
 * attivazione (false) e un timeout oltre il quale questi dati vengono eliminati.
 */
var urlRipristinoEConferma = {};


/** Inizializza il modulo.
 * @param {number} scadenzaDati - Tempo in secondi oltre il quale i dati di un utente nella cache devono essere
 *                                nuovamente richiesti al DBMS.
 * @param {number} timeout - Tempo in minuti che deve passare dall'ultima richiesta di un utente perchè questo
 *                           venga impostato come offline sul database.
 */
exports.inizializza = function (scadenzaDati, timeout) {
    timeoutDisconnessione = timeout;
    scadenzaDatiUtente = scadenzaDati;
    // Aggiunge le route gestite da questo modulo a quelle gestite dal main e dagli altri moduli.
    app.use(router);
    // Inizializza il mailer con i dati dell'account gmail di SoundWave
    mailer.inizializza('s.wave2019@gmail.com', 'soundwave15', 'gmail');
};

// COSTRUZIONE DEI ROUTE

/**
 * Ad ogni richiesta da parte di un client, se esiste una sessione e quindi un cookie per quell'utente,
 * e se questa rappresenta un utente autenticato, viene aggiornato lo stato online per quell'utente.
 */
router.use(function (req, res, next) {
    if (req.session !== undefined && req.session.dati_utente !== undefined) {
        var nomeUtente = req.session.dati_utente.Nome_utente;
        impostaStatoOnline(nomeUtente);
    }
    next();
});

/**
 * Route utile per l'applicazione mobile. E' un semplice controllo che restituisce "YES" se l'utente è già stato
 * autenticato, e "NO" altrimenti.
 */
router.get("/verificaaccesso/?", function (req, res) {
    res.send((req.session && req.session.dati_utente) ? "YES" : "NO");
});

/**
 * Corrisponde al metodo "richiestaAutenticazione" identificato in fase di analisi. Il metodo legge i dati di
 * autenticazione inseriti dall'utente nella pagina di login, e verifica la corrispondenza sul server. Nel caso in
 * cui questa corrispondenza venga trovata, l'utente viene autenticato e i suoi dati personali vengono memorizzati
 * all'interno della sessione.
 */
router.post('/login/?', function (req, res) {
    var nomeUtente = req.body.usr;
    var password = req.body.pass;

    //Viene eseguito l'hash della password, per non memorizzarla in chiaro.
    password = hashPassword(password);
    connessionedb.verificaDatiAccesso(nomeUtente, password, function (dati, esitoOperazione) {
        if (esitoOperazione === 'OK') {
            app.log('Utente ' + nomeUtente + ' loggato su un nuovo dispositivo.\n');
            req.session.dati_utente = dati;
            // Viene impostata la scadenza per i dati utente salvati nella sessione.
            req.session.scadenza_dati_utente = Date.now();
        }
        else {
            app.log('Autenticazione fallita.');
        }
        res.send(esitoOperazione);
    });
});

/**
 * Corrisponde al metodo deautentica individuato in fase di analisi.
 * Controlla se esiste una sessione per l'utente che ha effettuato la richiesta (per prevenire che un utente possa
 * utilizzare il metodo scrivendolo nell'URL del browser portando a comportamenti inaspettati). Poi
 * redireziona alla pagina di login.
 */
router.use('/logout/?', function (req, res) {
    if (req.session && req.session.dati_utente) {
        app.log('Utente ' + req.session.dati_utente.nome_utente + ' deautenticato dalla postazione ' + req.ip + '.\n');
        req.session.destroy();
    }
    res.redirect('/login');
});

/**
 *  Chiama il gestore del ripristino password, tentando di identificare l'utente tramite le credenziali inserite nella
 *  pagina di login*/
router.post('/ripristino/?', function (req, res) {
    // Se l'utente è già loggato viene redirezionato alla pagina principale
    if (req.session.dati_utente !== undefined) res.redirect('/webplayer');
    else {
        /**
         * Viene cercata una corrispondeza per l'utente specificato come parametro "usr" della post. Se questa
         * corrispondenza viene trovata, viene avviato il ripristino della password per quell'utente.
         */
        trovaCorrispondenza(req.body.usr, function (esitoOperazione) {
            res.send(esitoOperazione);
        });
    }
});

/**
 * Intercetta tutti gli url che cominciano con /ripristino/.
 * Tenta di avviare il ripristino della password di uno specifico utente, tramite uno speciale url generato temporaneamente
 * dal sistema. Corrisponde al metodo generaPaginaReimpostazionePassword individuato in fase di analisi.
 * Se viene trovata una corrispondenza tra i link di ripristino della password attualmente memorizzati sul server rispetto
 * al link a cui si è acceduto, viene inviata la pagina di ripristino della password. In caso contrario, il controllo
 * viene passato al prossimo route (verrà probabilmente generato un 404).
 */
router.get('/ripristino/*', function (req, res, next) {
    var url = req.url.replace('/ripristino/', '');
    // Controllo non solo che l'url esista, ma anche che l'url corrisponda ad una operazione di ripristino e non di attivazione.
    if (urlRipristinoEConferma[url] !== undefined && urlRipristinoEConferma[url].ripristino === true) {
        res.sendFile(appRoot + 'public/ripristino.html');
    } else next();
});

/**
 * Corrisponde al metodo avviaRipristinoPassword identificato in fase di analisi. Tenta di ripristinare la password
 * di un utente sulla base dell'url fornito e della nuova password inserita. Equivalente alla route precedente ma in
 * questo caso il metodo è POST. Questo genere di richiesta viene generata dopo che l'utente ha acceduto alla pagina
 * di ripristino della propria password, inserito la nuova password e premuto conferma.
 */
router.post('/ripristino/*', function (req, res) {
    var url = req.url.replace('/ripristino/', '');
    var password = req.body.pass;
    // Viene nuovamente controllato che l'url sia valido e che corrisponda ad una operazione di ripristino.
    if (urlRipristinoEConferma[url] !== undefined && urlRipristinoEConferma[url].ripristino === true) {
        password = hashPassword(password);
        connessionedb.richiestaModificaPassword(urlRipristinoEConferma[url].nomeUtente, password, function (esitoOperazione) {
            if (esitoOperazione === 'OK') {// Operazione andata a buona fine
                urlRipristinoEConferma[url] = undefined;
            }
            res.send(esitoOperazione);
        });
    } else {
        res.status(404).send('INVALIDURL');
    } // Url di ripristino non valido
});

/**
 * Corrisponde al metodo avviaRegistrazione individuato in fase di analisi. Preleva i parametri della post e li
 * invia a connessionedb per tentare di effettuare la query. Se la query va a buon fine, viene poi invocato il mailer
 * per tentare di inviare la mail di conferma.
 */
router.post('/registrazione/?', function (req, res) {
    var email = req.body.email;
    var password = req.body.pass;
    var nomeUtente = req.body.usr;
    var data = req.body.date;
    var sesso = req.body.s;
    // La password viene hashata per non memorizzarla in chiaro sul database.
    password = hashPassword(password);
    connessionedb.richiestaRegistrazioneNuovoUtente(email, password, nomeUtente, data, sesso, function (esitoQuery) {
        if (esitoQuery === 'OK') {
            avviaConfermaRegistrazione(nomeUtente, email, function (esitoOperazione) {
                res.send(esitoOperazione);
            });
        }
        else res.send('CONNERR');
    });
});

/**
 * Route utilizzato in fase di registrazione per verificare che l'utente non inserisca una mail già esistente.
 */
router.post('/controllamailduplicata/?', function (req, res) {
    var email = req.body.mail;
    if (!email) res.send('EMPTYMAIL');
    else {
        connessionedb.richiestaVerificaDatiUtenteDuplicati(email, 'email', function (esitoOperazione) {
            res.send(esitoOperazione);
        });
    }
});

/**
 * Route utilizzato in fase di registrazione per verificare che l'utente non inserisca una nome utente già esistente.
 */
router.post('/controllanomeutenteduplicato/?', function (req, res) {
    var nomeUtente = req.body.name;
    if (!nomeUtente) res.send('EMPTYNAME');
    else {
        connessionedb.richiestaVerificaDatiUtenteDuplicati(nomeUtente, 'nome_utente', function (esitoOperazione) {
            res.send(esitoOperazione);
        });
    }
});

/**
 * Corrisponde al metodo confermaRegistrazione identificato in fase di analisi. Tenta di attivare un utente sulla base
 * dell'url fornito. Intercetta tutte le richieste il cui url inizia con "/attivazione".
 */
router.get('/attivazione/*', function (req, res, next) {
    var url = req.url.replace('/attivazione/', '');
    // Verifico che esista l'url inserito e che corrisponda ad una operazione di attivazione di un account.
    if (urlRipristinoEConferma[url] !== undefined && urlRipristinoEConferma[url].ripristino === false) {
        var utente = urlRipristinoEConferma[url].nomeUtente;
        connessionedb.richiestaAttivazioneUtente(utente, function (esitoOperazione) {
            if (esitoOperazione === 'OK') {
                urlRipristinoEConferma[url] = undefined;
                res.sendFile(appRoot + 'public/attivazione.html');
            }
            else res.send(esitoOperazione);
        });
    } else next();
});

/**
 * Questa funzione corrisponde al metodo avviaModificaImpostazioni individuato durante la fase di analisi.
 */
router.post('/aggiornaimpostazioni/?', function (req, res) {
    var impostazioni = {};
    /**
     * Scorro i parametri all'interno della POST, e aggiungo tutti quelli validi all'oggetto impostazioni (avendo cura
     * di hashare la nuova password, se presente).
     */
    for (var x in req.body) {
        switch (x) {
            case 'mail':
                impostazioni['email'] = req.body[x];
                break;
            case 'pass':
                impostazioni['password_utente'] = hashPassword(req.body[x]);
                break;
            case 'date':
                impostazioni['data_di_nascita'] = req.body[x];
                break;
            case 's':
                impostazioni['sesso'] = req.body[x];
                break;
            case 'passcheck':
                break;
            default:
                app.log('/webplayer/aggiornaimpostazioni - ricevuto un parametro sconosciuto: ' + x + ' = ' + req[x] + '.');
        }
    }
    /**
     * Invio la richiesta a connessionedb, hashando la verifica della password (perchè sul database è hashata, quindi è
     * l'unico modo per verificarne la corrispondenza.
     */
    connessionedb.richiestaAggiornamentoImpostazioni(req.session.dati_utente.id_utente, hashPassword(req.body.passcheck), impostazioni,
        function (esitoOperazione) {
            if (esitoOperazione === 'OK') {
                // Aggiorna le impostazioni memorizzate nella sessione (cookie) dell'utente
                for (var x in impostazioni) {
                    if (x in req.session.dati_utente) {
                        req.session.dati_utente[x] = impostazioni[x];
                    }
                }
            }
            res.send(esitoOperazione);
        });
});

/**
 * Funzione che redireziona tutte le richieste relative a dati dell'utente autenticato. Se l'utente non è autenticato,
 * viene redirezionato alla pagina di login. Altrimenti, si passa il controllo al prossimo route nello stack.
 */
router.all('/u*', function (req, res, next) {
    if (req.session && req.session.dati_utente) next();
    else res.redirect('/login');
});

/**
 * Metodo tramite il quale lo script lato client puo' ottenere i dati dell'utente loggato.
 */
router.get('/u/datiutente/?', function (req, res) {
    ottieniDatiUtente(req.session, function (dati, esitoOperazione) {
        if (esitoOperazione === 'OK') {
            res.json(dati);
        }
        else res.send(esitoOperazione);
    });
});

/**
 * Route per reinviare la mail di conferma di attivazione di un account.
 */
router.get('/u/reinviamailregistrazione/?', function (req, res) {
    if (req.session.dati_utente.verifica_registrazione) res.send('ALREADYVERIFIED');
    else avviaConfermaRegistrazione(req.session.dati_utente.nome_utente, req.session.dati_utente.email, function (esitoOperazione) {
        res.send(esitoOperazione);
    });
});

/**
 * Route per modificare l'immagine del profilo di un utente.
 */
router.post('/u/nuovaimmagineprofilo/?', upload.single('profpic'), function (req, res) {
    if (req.uploadError) {
        app.log(req.uploadError);
        res.send('UPLERR');
    }
    else if (!req.file) {
        app.log("No file received");
        res.send('EMPTYPROFPIC');

    } else {
        // Il modulo jimp legge i dati del file dalla POST.
        require('jimp').read(req.file.buffer, function (err, file) {
            if (err) {
                app.log(err);
                res.send('IMGERR');
            }
            else {
                /**
                 * Se le dimensioni massime dell'immagine eccedono 512 x 512, o se il fattore di forma dell'immagine
                 * non è 1:1, l'immagine viene ridimensionata e/o tagliata.
                 */
                if (file.bitmap.width > 512 || file.bitmap.height > 512) file.cover(512, 512);
                else if (file.bitmap.width !== file.bitmap.height) {
                    var dim = Math.min(file.bitmap.width, file.bitmap.height);
                    file.cover(dim, dim);
                }

                //Il  nome dell'immagine viene assegnato secondo il suo hash.
                var fileName = file.hash() + '.jpg';
                var publicPath = publicMediaRoot + fileName.substr(0, 1) + '/';
                var realPath = appRoot + 'public' + publicPath;
                mkdirp(realPath, function (err) {
                    if (err) {
                        app.log(err);
                        res.send('FSERR');
                    }
                    else {
                        connessionedb.richiestaModificaImmagineProfilo(publicPath + fileName,
                            req.session.dati_utente.id_utente, function (esitoOperazione) {
                                if (esitoOperazione === 'OK') {

                                    /**
                                     * Il file viene salvato con qualità 75, un buon compromesso tra qualità e
                                     * spazio occupato.
                                     */
                                    file.quality(75).write(realPath + fileName, function (err) {
                                        if (err) {
                                            app.log(err);
                                            res.send('IMGWRERR');
                                        } else {
                                            /**
                                             * I dati vengono fatti scadere per assicurare che alla prossima richiesta
                                             * vengano ricevuti i dati aggiornati a seguito della modifica.
                                             */
                                            req.session.scadenza_dati_utente = Date.now();
                                            res.send(publicPath + fileName);
                                        }
                                    });
                                }
                                else {
                                    res.send(esitoOperazione);
                                }
                            });
                    }
                });
            }
        });
    }
});


////

//FUNZIONI PRIVATE DI UTILITA'

/**
 * Funziona che avvia la conferma di registrazione di un utente, generando l'url della pagina di conferma e chiamando
 * il metodo della mailer per l'invio della mail di conferma.
 * @param {string} nomeUtente - Il nome utente dell'utente al quale si vuole inviare la mail.
 * @param {string} email - L'indirizzo email al quale inviare la mail.
 * @param {function} callback - La funzione da eseguire una volta terminata l'operazione.
 */
function avviaConfermaRegistrazione(nomeUtente, email, callback) {
    var urlPaginaConferma = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    mailer.inviaMailDiConferma(nomeUtente, email, urlPaginaConferma, function (risultatoOperazione) {
        callback(risultatoOperazione);
        if (risultatoOperazione === 'OK') impostaLinkDiConferma(urlPaginaConferma, nomeUtente, false, 8.64e7)//un giorno;
    });
}

/**
 * Semplice funzione che richiama la funzione della libreria di hashing per hashare una password passta come argomento.
 * @param {string} password - La password in chiaro
 * @returns {string} - La password hashata.
 */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
}

/**
 * Funzione che ricerca la corrispondenza di un nome utente o di una email nel database, ai fini del ripristino
 * di una password dimenticata, e in caso di corrispondenza torvata, genera l'url di ripristino e chiama il metodo del
 * mailer per inviare la mail di ripristino all'utente.
 * @param {string} nomeUtente - Il nome dell'utente che vuole ripristinare la sua password.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
function trovaCorrispondenza(nomeUtente, callback) {
    connessionedb.richiestaCorrispondenzaUtente(nomeUtente, function (dati, esitoQuery) {
        if (esitoQuery === 'OK') {
            var email = dati.email;
            var utente = dati.nome_utente;
            var urlPaginaRipristino = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            mailer.inviaMailRipristinoPassword(utente, email, urlPaginaRipristino, function (esitoOperazione) {
                if (esitoOperazione === 'OK') {
                    /* Imposta l'oggetto che permettera' all'utente di ripristinare la password, accedendo al link fornitogli.
                    *  Il link ha una validita' di tre ore, oltre le quali viene distrutto dall'oggetto timer.*/
                    impostaLinkDiConferma(urlPaginaRipristino, utente, true, 1.08e7);
                }
                callback(esitoOperazione);
            });
        }
        else callback(esitoQuery);
    });
}

/**
 * Funzione che imposta come online lo stato di un utente sul database. Si occupa inoltre di gestire il timer
 * associato all'inattività dell'utente (intesa come mancanze di richieste fatte al server).
 * @param {number} idUtente - L'id dell'utente da gestire.
 */
function impostaStatoOnline(idUtente) {
    /**
     * Se non esiste un timer di disconnession per l'utente interessato, vuol dire che l'utente era offline e si è
     * appena collegato. In questo caso, viene impostato lo stato online sul database.
     */
    if (timerDisconnessioneUtenti[idUtente] === undefined) {
        connessionedb.richiestaImpostazioneStatoOnline(idUtente, true);
    }
    /**
     * Se il timetout esisteva già, l'utente è già impostato come online sul database, e il timer viene azzerato.
     */
    else clearTimeout(timerDisconnessioneUtenti[idUtente]);
    /**
     * In entrambi i casi, bisogna far partire (o ripartire) il timer dall'istante attuale. Allo scadere di queto,
     * l'utente verrà impostato come offline.
     */
    timerDisconnessioneUtenti[idUtente] =
        setTimeout(() => {
            connessionedb.richiestaImpostazioneStatoOnline(idUtente, false);
            timerDisconnessioneUtenti[idUtente] = undefined;
        }, timeoutDisconnessione * 60000);
}

/**
 *  Funzione che imposta il link di conferma dell'account o di ripristino della password per un utente.
 */
function impostaLinkDiConferma(url, utente, ripristino, timeout) {
    urlRipristinoEConferma[url] = {
        nomeUtente: utente, ripristino: ripristino, timeout: setTimeout(function () {
            urlRipristinoEConferma[url] = undefined;
        }, timeout)
    };
}

/**
 * Funzione per ottenere i dati dell'utente autenticato. Se i dati memorizzati nella sessione, che funge da cache, non
 * sono ancora scaduti, vengono inviati quelli. In caso contrario, vengono richiesti i dati aggiornati al DBMS.
 * @param {Object} sessione - L'oggetto sessione da cui leggere i dati se non sono scaduti, e su cui scrivere di volta
 *                            in volta i dati aggiornati.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
function ottieniDatiUtente(sessione, callback) {
    if (sessione.scadenza_dati_utente < Date.now()) {
        connessionedb.richiestaDatiPersonali(sessione.dati_utente.id_utente, function (dati, esitoOperazione) {
            console.log("query");
            if (esitoOperazione !== 'OK') callback(undefined, esitoOperazione);
            else {
                var datiRielaborati = {
                    id_utente: dati.id_utente,
                    nome_utente: dati.nome_utente,
                    email: dati.email,
                    sesso: dati.sesso,
                    data_di_nascita: dati.data_di_nascita,
                    ultimo_accesso: dati.ultimo_accesso,
                    ultimo_istante_riproduzione: dati.ultimo_istante_riproduzione,
                    verifica_registrazione: dati.verifica_registrazione,
                    url_immagine_profilo: dati.url_immagine_profilo || publicMediaRoot + 'default.png',
                    ultima_playlist_riprodotta: undefined,
                    ultimo_brano_riprodotto: undefined
                };
                /**
                 * Se esiste una ultima playlist riprodotta, non è necessario inviare nuovamente i dati completi
                 * dell'ultimo brano riprodotto, in quanto questo sarà certamente compreso nella playlist con tutti i
                 * suoi dati.
                 */
                if (dati.ultima_playlist_riprodotta) {
                    datiRielaborati.ultima_playlist_riprodotta = dati.ultima_playlist_riprodotta;
                    datiRielaborati.ultimo_brano_riprodotto = dati.ultimo_brano_riprodotto;
                } else if (dati.ultimo_brano_riprodotto) {
                    datiRielaborati.ultimo_brano_riprodotto = {
                        id_brano: dati.ultimo_brano_riprodotto,
                        titolo: dati.titolo,
                        genere: dati.genere,
                        durata: dati.durata,
                        anno: dati.anno,
                        url_cover_brano: dati.url_cover_brano,
                        id_artista: dati.id_artista,
                        nome_artista: dati.nome_artista
                    }
                }
                sessione.dati_utente = datiRielaborati;
                // Eta' dei dati
                sessione.scadenza_dati_utente = Date.now() + 1000 * scadenzaDatiUtente;
                callback(datiRielaborati, 'OK');
            }
        });
    } else {
        callback(sessione.dati_utente, 'OK');
    }
}

///
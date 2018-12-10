/**
 * Questo modulo gestisce la comunicazione di tutti i moduli del server con il database.
 */
const mysql = require('mysql');

/**
 * Imposta la connessione con il database
 */
const pool = mysql.createPool({
    connectionlimit: 100,
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'SoundWaveDB',
    multipleStatements: true,
    waitForConnections: true,
    queueLimit: 1000,
    /**
     *  Serve a castare il tipo buffer di node.js, in cui viene automaticamente convertito il tipo bit di mysql,
     *  in boolean.
     */
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

//Funzioni di utilità

/**
 * Funzione utile per eseguire query in cui si deve verificare l'esistenza di specifiche tuple sul database,
 * ed eventualmente restituire la prima tupla di dati ottenuta dalla query (ad esempio in fase di login, quando si vuole
 * verificare se l'utente con le credenziali inserite esiste e in caso affermativo restituirne i dati completi).
 * @param {string} query - La query da eseguire.
 * @param {[]} queryData - I parametri da passare alla query.
 * @param {function} callback - La funzione da eseguire una volta terminata la query.
 * @param {Connection || Pool} [connection] - Connessione o pool tramite cui eseguire la query.
 */
function matchQuery(query, queryData, callback, connection = pool) {
    connection.query(query, queryData, function (err, result, fields) {
        if (err) {
            app.log(err);
            callback(undefined, 'CONNERR');
        } else callback(result[0], ((result.length > 0) ? 'OK' : 'NOMATCH'));
    });
}

/**
 * Funzione utile per eseguire query di aggiornamento di specifiche tuple sul database. La callback viene chiamata
 * con la stringa "OK" per segnalare l'esito positivo, nel caso in cui è stata aggiornata almeno una riga, e con
 * "NOMATCH" altrimenti.
 * @param {string} query - La query da eseguire.
 * @param {[]} queryData - I parametri da passare alla query.
 * @param {function} callback - La funzione da eseguire una volta terminata la query.
 * @param {Connection || Pool} [connection] - Connessione o pool tramite con cui eseguire la query.
 */
function updateQuery(query, queryData, callback, connection = pool) {
    connection.query(query, queryData, function (err, result, fields) {
        if (err) {
            console.log(err);
            callback('CONNERR');
        } else callback(((result.affectedRows > 0) ? 'OK' : 'NOMATCH'));
    });
}

/**
 * Funzione utile per richiede insiemi di dati memorizzati sul database. La callback viene chiamata con due parametri.
 * Il primo di questi rappresenti i dati ottenuti dala query, undefined nel caso in cui si verifichino errori, mentre
 * il secondo rappresenta l'esito dell'operazione.
 * @param {string} query - La query da eseguire.
 * @param {[]} queryData - I parametri da passare alla query.
 * @param {function} callback - La funzione da eseguire una volta terminata la query.
 * @param {Connection || Pool} [connection] - Connessione o pool tramite con cui eseguire la query.
 */
function dataRequestQuery(query, queryData, callback, connection = pool) {
    connection.query(query, queryData, function (err, result, fields) {
        if (err) {
            app.log(err);
            callback(undefined, 'CONNERR');
        } else callback(result, 'OK');
    });
}

/**
 * Funzione utile per eseguire inserire una singola tupla nel database. Se l'operazione va a buon fine, alla callback
 * viene passato l'id generato della nuova tupla.
 * @param {string} query - La query da eseguire.
 * @param {[]} queryData - I parametri da passare alla query.
 * @param {function} callback - La funzione da eseguire una volta terminata la query.
 * @param {Connection || Pool} [connection] - Connessione o pool tramite con cui eseguire la query.
 */
function insertQuery(query, queryData, callback, connection = pool) {
    connection.query(query, queryData, function (err, result, fields) {
        if (err) {
            app.log(err);
            callback(undefined, 'CONNERR');
        } else callback(result.insertId, 'OK');
    });
}

/**
 * Funzione utile per eseguire query generiche. Chiama la callback con "OK" se l'operazione va a buon fine, e con
 * "CONNERR" altrimenti.
 * @param {string} query - La query da eseguire.
 * @param {[]} queryData - I parametri da passare alla query.
 * @param {function} callback - La funzione da eseguire una volta terminata la query.
 * @param {Connection || Pool} [connection] - Connessione o pool tramite con cui eseguire la query.
 */
function genericQuery(query, queryData, callback, connection = pool) {
    connection.query(query, queryData, function (err, result, fields) {
        if (err) {
            //app.log(err);
            callback('CONNERR');
        } else callback('OK');
    });
}

/**
 * Funzione utile per eseguire più query e chiamare una callback solamente quando tutte le query sono state completate.
 * @param {string[]} arrayQuery - Contiene tutte le query che si vogliono eseguire.
 * @param {string[]} nomiCampiRisposta - I nomi da assegnare agli eventuali dati che si vogliono ottenere.
 * @param {function} queryFunction - La funzione, tra quelle sopra elencate, per eseguire le query. Se si utilizza una
 *                                   funzione che non passa alcun dato alla callback, ma solamente l'esito dell'operazione,
 *                                   bisogna tenerne conto nell'elaborare i dati della callback "esterna" di questa funzione.
 * @param {[]} queryData - I parametri da passare alle query. Possono essere di vario tipo.
 * @param {function} callback - La funzione da eseguire una volta completate tutte le query, o in caso di errore.
 */
function multipleQuery(arrayQuery, nomiCampiRisposta, queryFunction, queryData, callback) {
    var queryEffettuate = 0;
    var errore = false;
    var datiRisposta = {};
    var queryDaEffettuare = arrayQuery.length;
    /**
     * Generalizzo le query dato che il meccanismo è sempre lo stesso e va ripetuto più volte.
     * La logica è che se non si è ancora verificato un errore, viene effettuata la query. La callback passata alla query,
     * se la query è andata a buon fine e nel frattempo non si è verificato un errore (causato da un'altra query),
     * incrementa il numero di query effettuate e memorizza il risultato nei dati di risposta. Se a questo punto sono già
     * state effettuata tutte le altre query, allora è possibile eseguire la callback ed inviare la risposta al
     * richiedente. Se la query non è andata a buon fine, ma il valore di errore è ancora false, questo viene impostato a
     * true e viene subito eseguita la callback  per comunicare al richiedente che l'operazione non è andata a buon fine.
     * Impostare il valore di errore a true evita che la callback possa essere richiamata più volte a seguito di altre query.
     */
    arrayQuery.forEach(function (query, indice) {
        if (!errore) {
            queryFunction(query, queryData, function (dati, esitoQuery) {
                if (esitoQuery === 'OK' && !errore) {
                    queryEffettuate++;
                    datiRisposta[nomiCampiRisposta[indice]] = dati;
                    if (queryEffettuate === queryDaEffettuare) callback(datiRisposta, 'OK');
                } else if (!errore) {
                    errore = true;
                    callback(undefined, esitoQuery);
                }
            });
        }
    });
}

/**
 * Funzione che verifica che i dati di accesso nomeUtente e password siano corretti in seguito ad una richiesta al DBMS.
 * Tramite la funzione matchQuery, se i dati sono validi verrà passato alla callback anche il resto dei dati dell'utente.
 * @param {string} nomeUtente - Il nome utente dell'utente da controllare.
 * @param {string} password - La password che l'utente ha inserito.
 * @param {function} callback - Funzione da eseguire una volta completate le operazioni.
 */
exports.verificaDatiAccesso = function (nomeUtente, password, callback) {
    var query = "SELECT NomeUtente, Email, Nome, Cognome, Sesso, DataDiNascita " +
        "FROM Account a " +
        "WHERE a.NomeUtente = ? AND a.Password = ?;";
    matchQuery(query, [nomeUtente, password], callback);
};


/**
 * Funzione utile a verificare l'esistenza di un utente a partire dal suo nome utente o dalla sua email.
 * @param {string} nomeUtente - Il nome utente o l'email di cui si vuole verificare l'esistenza.
 * @param {function callback - La funzione da eseguire una volta completate le operazioni.
 */
exports.richiestaCorrispondenzaUtente = function (nomeUtente, callback) {
    var query = "SELECT u.nome_utente, u.email" +
        "FROM Account a " +
        "WHERE a.NomeUtente = ? OR a.Email = ?";
    matchQuery(query, [nomeUtente, nomeUtente], callback);
};

/**
 * Funzione che richiede al DBMS la modifica della password di un utente. Utilizzata nella funzionalità di ripristino.
 * @param {string} utente - Nome utente o email dell'utente di cui si vuole modificare la password.
 * @param {string} password - Nuova password dell'utente.
 * @param {function} callback - Funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaModificaPassword = function (utente, password, callback) {
    var campoUtente;
    if (typeof utente === 'number') campoUtente = 'id_utente';
    else campoUtente = 'nome_utente';
    var query = "UPDATE utente u " +
        "SET password_utente = ? " +
        "WHERE u." + campoUtente + " = ?;";
    updateQuery(query, [password, utente], callback);
};

/**
 * Funzione che richiede al DBMS la registrazione di un nuovo utente.
 * @param {string} email - Email dell'utente da registrare.
 * @param {stirng} password - Password dell'utente da registrare.
 * @param {string} nomeUtente - Nome utente dell'utente da registrare.
 * @param {Date} data - Data di nascita dell'utente da registrare.
 * @param {string} sesso - Sesso dell'utente da registrare.
 * @param {function} callback - Funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaRegistrazioneNuovoUtente = function (email, password, nomeUtente, data, sesso, callback) {
    var query = "INSERT INTO utente (email, password_utente, nome_utente, data_di_nascita, sesso) " +
        "VALUES( ?, ?, ?, ?, ?);";
    genericQuery(query, [email, password, nomeUtente, data, sesso], callback);
}

/**
 * Funzione che imposta a true il campo "verifica_registrazione" di un utente sul database, permettendogli
 * successivamente di accedere alle funzionalità del programma.
 * @param {stirng} utente - Nome utente dell'utente che si vuole attivare.
 * @param {function} callback - Funzione che si vuole eseguire una volta completate le operazioni.
 */
exports.richiestaAttivazioneUtente = function (utente, callback) {
    var query = "UPDATE utente u " +
        "SET u.verifica_registrazione = TRUE " +
        "WHERE u.nome_utente = ?;";
    updateQuery(query, [utente], callback);
};

/**
 * Funzione per richiedere i dati personali di un utente a partire dall'id. Viene utilizzata per ottenere i dati completi
 * di un utente amico.
 * @param {number} idUtente - L'id dell'utente di cui si richiedono i dati.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDatiUtente = function (idUtente, callback) {
    var queryUtente = "SELECT u.id_utente, u.nome_utente, u.stato_online, u.sesso, u.data_di_nascita, " +
        "u.ultimo_accesso, u.ultimo_brano_riprodotto, u.ultimo_istante_riproduzione, u.url_immagine_profilo " +
        "FROM utente u " +
        "WHERE u.id_utente = ?;";
    var queryPlaylist = queryPlaylistUtente;
    var queryUltimoBranoRiprodotto = "SELECT b.id_brano, b.titolo, b.url_cover_brano, a.id_artista, a.nome_artista " +
        "FROM brano b, artista a " +
        "WHERE b.ref_artista_b = a.id_artista AND b.id_brano = ?;";
    multipleQuery([queryUtente, queryPlaylist], ['dati_utente', 'dati_playlist'], dataRequestQuery, idUtente, function (dati, esitoOperazione) {
        if (esitoOperazione === 'OK') {
            dati.dati_utente = dati.dati_utente[0];
            if (dati.dati_utente.ultimo_brano_riprodotto) {
                matchQuery(queryUltimoBranoRiprodotto, dati.dati_utente.ultimo_brano_riprodotto, function (datiBrano, esitoRichiesta) {
                    if (esitoRichiesta === 'OK') {
                        dati.dati_ultimo_brano = datiBrano;
                        callback(dati, 'OK');
                    } else {
                        callback(undefined, esitoRichiesta);
                    }
                });
            }
            else callback(dati, esitoOperazione);
        }
        else callback(undefined, esitoOperazione);
    });
};

/**
 * Aggiorna una tupla di amicizia esistente impostando la colonna "accettata" a "true", di fatto rendendo collegati
 * i due utenti.
 * @param {number} mittente - Id dell'utente che ha inviato originariamente la richiesta.
 * @param {number} ricevente - Id dell'utente che ha ricevuto ed accettato la richiesta.
 * @param {function} callback - Funzione da eseguire una volta terminate le operazioni.
 */
exports.richiestaCollegamentoUtenti = function (mittente, ricevente, callback) {
    var query = "UPDATE amicizia a " +
        "SET a.accettata = TRUE " +
        "WHERE a.ref_utente_1 = ? AND a.ref_utente_2 = ?;";
    updateQuery(query, [mittente, ricevente], callback);
};

/**
 * Questo metodo, per quanto riguarda gli equivalenti trovati in fase di analisi, soddisfa sia "richiestaEliminazioneRichiesta",
 * invocato quando viene rifiutata una richiesta di amiciia, che l'omonimo "richiestaRimozioneAmico", in quanto per
 * l'implementazione del database scelta in una fase successiva le due operazioni richiedono la stessa query.
 * Rimuove una tupla dalla tabella "amicizia", di fatto rifiutando una richiesta, se i due utenti non erano ancora
 * collegati, o eliminando il collegamento se lo erano.
 * @param {number} mittente - Id dell'utente che ha inviato originariamente la richiesta.
 * @param {number} ricevente - Id dell'utente che ha ricevuto la richiesta.
 * @param {function} callback - Funzione da eseguire una volta terminate le operazioni.
 */
exports.richiestaRimozioneAmico = function (mittente, ricevente, callback) {
    var query = "DELETE FROM amicizia " +
        "WHERE (ref_utente_1 = ? AND ref_utente_2 = ?) OR (ref_utente_1 = ? AND ref_utente_2);";
    updateQuery(query, [mittente, ricevente, ricevente, mittente], callback);
};

/**
 * Corrisponde al metodo richiestaRicerca individuato in fase di analisi. Tuttavia, in fase di progettazione si è deciso
 * che la ricerca individua non solo gli utenti, ma anche i brani, le playlist e gli album.
 * @param {string} stringaDaCercare - La stringa tramite il quale effettuare la ricerca.
 * @param {number} idUtente - L'id dell'utente che sta effettuando la ricerca (necessario per non mostrare l'utente
 *                            stesso nei risultati di ricerca relativi agli utenti).
 * @param {function} callback - La funzione da eseguire una volta terminate le operazioni.
 */
exports.richiestaRicerca = function (stringaDaCercare, idUtente, callback) {
    var queryUtenti = "SELECT u.id_utente, u.nome_utente, u.url_immagine_profilo " +
        "FROM utente u " +
        "WHERE u.nome_utente LIKE ? AND u.id_utente != ?;";
    var queryBrani = "SELECT b.id_brano, b.titolo, b.genere, b.durata, b.anno, b.n_riproduzioni, b.url_cover_brano, " +
        "a.id_artista, a.nome_artista " +
        "FROM brano b, artista a " +
        "WHERE b.ref_artista_b = a.id_artista AND b.titolo LIKE ? " +
        "ORDER BY b.n_riproduzioni;";
    var queryPlaylist = "SELECT p.id_playlist, p.nome_playlist, p.genere_playlist, p.url_cover_playlist " +
        "FROM playlist_non_album p WHERE p.pubblica = TRUE AND p.nome_playlist LIKE ?;";
    var queryAlbum = "SELECT al.id_album, ar.id_artista, p.id_playlist, p.nome_playlist, " +
        "ar.nome_artista, p.url_cover_playlist, p.genere_playlist " +
        "FROM album al, artista ar, playlist p " +
        "WHERE al.ref_artista_album = ar.id_artista AND al.ref_playlist_a = p.id_playlist AND " +
        "p.nome_playlist LIKE ?";
    var queryArtisti = "SELECT * FROM artista a " +
        "WHERE a.nome_artista LIKE ?";
    multipleQuery([queryUtenti, queryBrani, queryPlaylist, queryAlbum, queryArtisti], ['utenti', 'brani', 'playlist', 'album', 'artisti'],
        dataRequestQuery, ['%' + stringaDaCercare + '%', idUtente], callback);
};

/**
 * Inserisce una nuova amicizia nel database, che non avendo il valore di "accettata" impostato a true, corrisponde
 * a una richiesta che non ha ancora ricevuto risposta.
 * @param {number} mittente - L'id dell'utente che ha inviato la richiesta.
 * @param {number} ricevente - L'id dell'utente che deve ricevere la richiesta.
 * @param {function} callback - La funzione da eseguire una volta completate le operazioni.
 */
exports.richiestaInvioRichiestaDiAmicizia = function (mittente, ricevente, callback) {
    var query = "INSERT INTO amicizia (ref_utente_1, ref_utente_2) VALUES (?, ?)";
    genericQuery(query, [mittente, ricevente], callback);
};

/**
 * Aggiunge un brano ad una playlist. La posizione del brano all'interno della playlist viene determinata tramite il
 * metodo determinaPrimaPosizioneDisponibileInPlaylist, e l'aggiunta passa ovviamente per il metodo modificaPlaylist,
 * allo scopo di verificare una eventuale condivisione della stessa playlist che richiederebbe la creazione di una copia.
 * @param {number} idUtente - L'id dell'utente che vuole effettuare la modifica.
 * @param {number} idPlaylist - L'id della playlist a cui aggiungere il brano.
 * @param {number} idBrano - L'id del brano che si vuole aggiungere alla playlist.
 * @param {function} callback - La funzione da eseguire una volta terminate le operazioni. Tramite questa viene
 *                              restituito l'id della playlist, che potrebbe essere cambiato a seguito di una copia.
 */
exports.richiestaAggiuntaBranoAPlaylist = function (idUtente, idPlaylist, idBrano, callback) {
    var queryInserimento = "INSERT INTO playlist_contiene_brano(ref_playlist_cb, ref_brano_cb, n_brano) " +
        "VALUES(?, ?, ?);";
    determinaPrimaPosizioneDisponibileInPlaylist(idPlaylist, function (posizioneOttenuta, esitoOperazione) {
        console.log(posizioneOttenuta);
        if (esitoOperazione !== 'OK') callback(undefined, esitoOperazione);
        else {
            modificaPlaylist(idUtente, idPlaylist, queryInserimento,
                {idPlaylist: idPlaylist, idBrano: idBrano, posizione: posizioneOttenuta}, callback);
        }
    });
}

/**
 * Crea una nuova playlist e la assegna all'utente che ne ha richiesto la creazione. L'operazione viene fatta tramite
 * una transazione per evitare di lasciare il database in uno stato inconsistente (playlist non assegnata a nessun utente).
 * @param {number} idUtenteCreatore - L'id dell'utente che vuole creare la playlist, a cui questa verrà assegnata.
 * @param {string} nomePlaylist - Il nome della playlist da creare.
 * @param {function} callback - La funzione da eseguire una volta terminate le operazioni, e tramite la quale verrà
 *                              restituito l'id della nuova playlist.
 */
exports.richiestaCreazionePlaylist = function (idUtenteCreatore, nomePlaylist, callback) {
    var queryCreazione = "INSERT INTO playlist " +
        "(nome_playlist) " +
        "VALUES (?)";
    pool.getConnection(function (err, connection) {
        if (err) {
            app.log(err);
            callback(undefined, 'CONNERR');
        }
        else {
            connection.beginTransaction(function (err) {
                if (err) {
                    app.log(err);
                    connection.rollback();
                    connection.release();
                    callback(undefined, 'CONNERR');
                } else {
                    insertQuery(queryCreazione, [nomePlaylist], function (idGenerato, esitoInserimento) {
                        if (esitoInserimento !== 'OK') {
                            callback(undefined, esitoInserimento);
                            connection.rollback();
                            connection.release();
                        } else {
                            var queryAggiuntaPlaylistAUtente = "INSERT INTO utente_possiede_playlist " +
                                "VALUES (?, ?)";
                            genericQuery(queryAggiuntaPlaylistAUtente, [idUtenteCreatore, idGenerato], function (esitoOperazione) {
                                if (esitoOperazione !== 'OK') {
                                    callback(undefined, esitoOperazione);
                                    connection.rollback();
                                } else {
                                    connection.commit();
                                    callback(idGenerato, 'OK');
                                }
                                connection.release();
                            }, connection);
                        }
                    }, connection);
                }
            });
        }
    });
};

/**
 * Questo metodo rimuove una playlist dalle playlist associate a uno specifico utente.
 * Viene utilizzata una transazione per evitare che il database possa rimanere in uno stato inconsistente dopo aver
 * effettuato una delle query correttamente ed aver riscontrato un errore in una delle query successive.
 * Se l'utente che vuole eliminare la playlist è l'ultimo a cui quella playlist era associata e la playlist non è
 * pubblica, questa viene eliminata definitivamente dal database.
 * @param {number} idUtente - L'id dell'utente che vuole rimuovere la playlist dalle sue playlist personali.
 * @param {number} idPlaylist - L'id della playlist che l'utente vuole rimuovere.
 * @param {function} callback - La funzione da eseguire una volta completate le operazioni.
 */
exports.richiestaEliminazionePlaylist = function (idUtente, idPlaylist, callback) {
    var queryEliminazionePerUtente = "DELETE FROM utente_possiede_playlist " +
        "WHERE ref_utente_pp = ? AND ref_playlist_pp = ?;";
    pool.getConnection(function (err, connection) {
        if (err) callback('CONNERR');
        else {
            connection.beginTransaction(function (err) {
                if (err) {
                    app.log(err);
                    connection.rollback();
                    connection.release();
                    callback('CONNERR');
                } else {
                    updateQuery(queryEliminazionePerUtente, [idUtente, idPlaylist], function (esitoEliminazione) {
                        if (esitoEliminazione !== 'OK') {
                            callback(esitoEliminazione);
                            connection.rollback();
                            connection.release();
                        } else {
                            var queryControllo = "SELECT COUNT(*) as n FROM utente_possiede_playlist " +
                                "WHERE ref_playlist_pp = ?;";
                            matchQuery(queryControllo, [idPlaylist], function (risultatoControllo, esitoOperazione) {
                                if (esitoOperazione !== 'OK') {
                                    callback(esitoOperazione);
                                    connection.rollback();
                                    connection.release();
                                } else if (risultatoControllo.n > 0) {
                                    // Esistono altri utenti che hanno la playlist in questione tra le loro playlist.
                                    callback('OK');
                                    connection.commit();
                                    connection.release();
                                } else {
                                    // Bisogna eliminare globalmente la playlist (se non è pubblica)
                                    var queryEliminazione = "DELETE FROM playlist WHERE id_playlist = ? AND pubblica = false;";
                                    genericQuery(queryEliminazione, [idPlaylist], function (esitoComplessivo) {
                                        if (esitoComplessivo !== 'OK') connection.rollback();
                                        else connection.commit();
                                        callback(esitoComplessivo);
                                        connection.release();
                                    }, connection);
                                }
                            }, connection);
                        }
                    }, connection);
                }
            });
        }
    });
};

/**
 * Metodo per rimuovere un brano dalla playlist di un utente. Viene utilizzato il metodo modificaPlaylist per via della
 * gestione delle transazioni e dell'eventualità di playlist condivise con altri utenti.
 * @param {number} idUtente - L'id dell'utente che vuole rimuovere il brano dalla playlist.
 * @param {number} idPlaylist - L'id della playlist dalla quale si vuole rimuovere il brano.
 * @param {number} idBrano - L'id del brano che si vuole rimuovere dalla playlist.
 * @param {function} callback - La funzione da eseguire una volta terminate le operazioni. Tramite questa viene
 *                              ritornato l'id della playlist, che potrebbe essere cambiato a seguito della copia.
 */
exports.richiestaRimozioneBrano = function (idUtente, idPlaylist, idBrano, callback) {
    var query = "DELETE FROM playlist_contiene_brano " +
        "WHERE ref_playlist_cb = ? AND ref_brano_cb = ?;";
    modificaPlaylist(idUtente, idPlaylist, query, {
        idPlaylist: idPlaylist,
        idBrano: idBrano,
        idUtente: idUtente
    }, callback);
};

/**
 * Richiede l'url del brano, da utilizzare per avviare uno streaming.
 * @param {number} idBrano - L'id del brano di cui si richiede l'url.
 * @param {function} callback - La funzione da eseguire una volta terminate le operazioni.
 */
exports.richiestaUrlBrano = function (idBrano, callback) {
    var query = "SELECT url_brano FROM brano WHERE id_brano = ?";
    matchQuery(query, idBrano, function (dati, esitoOperazione) {
        if (esitoOperazione !== 'OK') callback(undefined, esitoOperazione);
        else {
            callback(dati.url_brano, 'OK');
        }
    });
};


/**
 * Imposta lo stato online di un utente sul database. Questa funzione racchiude la logica del metodo
 * "richiestaDeautenticazione" previsto in fase di analisi. Con questo metodo più flessibile si evita di duplicare
 * del codice, in quanto sia l'impostazione dello stato online a true che quello a false vengono gestite con un unico
 * metodo.
 * @param {number} idUtente - L'id dell'utente di cui si vuole modificare lo stato online.
 * @param {boolean} online - True se l'utente è online, false se l'utente è offline.
 */
exports.richiestaImpostazioneStatoOnline = function (idUtente, online) {
    var query = "UPDATE utente " +
        "SET stato_online = ? " +
        "WHERE id_utente = ? ;";
    pool.query(query, [online, idUtente], function (err, result, fields) {
        if (err) app.log(err);
    });
};

/**
 * Fornisce i dati relativi alle amicizie di uno specifico utente. Per ogni amico, oltre ai dati contenuti direttamente
 * nella tabella utente, si richiedono i dettagli sull'ultimo brano riprodotto.
 * @param {number} idUtente - L'id dell'utente di cui si vogliono ottenere le amicizie.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDatiAmicizie = function (idUtente, callback) {
    /**
     * Il left join nella query è necessario per ottenere anche i dati degli utenti che non hanno un ultimo
     * brano riprodotto.
     */
    var query = "SELECT id_utente, data_aggiunta, nome_utente, data_di_nascita, sesso, " +
        "stato_online, ultimo_accesso, ultimo_brano_riprodotto, url_immagine_profilo, titolo " +
        "FROM amicizia, (utente LEFT JOIN brano ON  ultimo_brano_riprodotto = id_brano) " +
        "WHERE ((ref_utente_1 = ? AND ref_utente_2 = id_utente) OR (ref_utente_2 = ? AND ref_utente_1 = id_utente)) AND accettata = TRUE; ";
    dataRequestQuery(query, [idUtente, idUtente, idUtente, idUtente, idUtente], callback);
};

/**
 * Fornisce i dati relativi alle richieste di amicizia ricevute e non ancora accettate da uno specifico utente
 * @param {number} idUtente - L'id dell'utente di cui si richiedono i dati.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDatiRichiesteRicevute = function (idUtente, callback) {
    var query = "SELECT u.id_utente, u.nome_utente, u.url_immagine_profilo " +
        "FROM utente u, amicizia a " +
        "WHERE u.id_utente = a.ref_utente_1 AND a.accettata = FALSE AND a.ref_utente_2 = ?;";
    dataRequestQuery(query, [idUtente], callback);
};

/**
 * Fornisce i dati relativi alle richieste di amicizia inviate e di cui non si è ancora ricevuta la notifica di
 * amicizia accettata.
 * @param {number} idUtente - L'id dell'utente di cui si vogliono ottenere le richieste inviate.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDatiRichiesteInviate = function (idUtente, callback) {
    var query = "SELECT u.id_utente, u.nome_utente, u.url_immagine_profilo, a.accettata " +
        "FROM utente u, amicizia a " +
        "WHERE u.id_utente = a.ref_utente_2 AND a.ref_utente_1 = ? " +
        "AND (a.accettata = FALSE OR a.notifica_visualizzata = FALSE);";
    dataRequestQuery(query, [idUtente], callback);
}

/**
 * Controlla se due utenti sono amici.
 * @param {number} idUtente1 - L'id del primo utente.
 * @param {number} idUtente2 - L'id del secondo utente.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaSeAmici = function (idUtente1, idUtente2, callback) {
    var query = "SELECT * FROM amicizia a " +
        "WHERE ((a.ref_utente_1 = ? AND a.ref_utente_2 = ?) OR (a.ref_utente_1 = ? AND a.ref_utente_2 = ?)) AND a.accettata = TRUE;";
    matchQuery(query, [idUtente1, idUtente2, idUtente2, idUtente1], function (dati, esitoOperazione) {
        callback(esitoOperazione);
    });
}

/**
 * Richiede i dati delle playlist di uno specifico utente.
 * @param {number} idUtente - L'id dell'utente di cui si vogliono ottenere le playlist.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDatiPlaylistUtente = function (idUtente, callback) {
    dataRequestQuery(queryPlaylistUtente, idUtente, callback);
}

/**
 * Richiede i dettagli sui brani di una playlist.
 * @param {number} idPlaylist - L'id della playlist di cui si vogliono ottenere i brani.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDettagliPlaylist = function (idPlaylist, callback) {
    var query = "SELECT pb.n_brano, b.id_brano, b.titolo, b.genere, b.durata, " +
        "b.anno, b.url_cover_brano, a.id_artista, a.nome_artista " +
        "FROM brano b, playlist_contiene_brano pb, artista a " +
        "WHERE pb.ref_brano_cb = b.id_brano AND b.ref_artista_b = a.id_artista " +
        "AND pb.ref_playlist_cb = ? " +
        "ORDER BY n_brano;";
    dataRequestQuery(query, idPlaylist, callback);
}

/**
 * Funzione che richiede i dati dell'utente attualmente autenticato quando è necessario aggiornarli.
 * @param {number} idUtente - L'id dell'utente del quale si richiedono i dati.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaDatiPersonali = function (idUtente, callback) {
    var query = "SELECT u.id_utente, u.nome_utente, u.email, u.sesso, u.data_di_nascita, u.ultimo_accesso, u.ultimo_brano_riprodotto, " +
        "u.ultimo_istante_riproduzione, p.id_playlist, p.nome_playlist, p.genere_playlist, p.url_cover_playlist, " +
        "u.verifica_registrazione, u.url_immagine_profilo, b.titolo, b.genere, b.durata, " +
        "b.anno, b.url_cover_brano, b.id_artista, b.nome_artista " +
        "FROM utente u LEFT JOIN playlist p ON u.ultima_playlist_riprodotta = p.id_playlist LEFT JOIN ( " +
        "SELECT * FROM brano , artista  WHERE id_artista = ref_artista_b) as b " +
        "ON u.ultimo_brano_riprodotto = b.id_brano " +
        "WHERE u.id_utente = ?; ";
    matchQuery(query, [idUtente], function (dati, esitoOperazione) {
        if (esitoOperazione === 'OK') {
            /**
             * Se esiste un'ultima playlist riprodotta, vengono richiesti i dati anche di quella.
             */
            if (dati.id_playlist) {
                exports.richiestaDettagliPlaylist(dati.id_playlist, function (braniPlaylist, esitoQuery) {
                    if (esitoQuery === 'OK') {
                        dati.ultima_playlist_riprodotta = {
                            id_playlist: dati.id_playlist,
                            genere_playlist: dati.genere_playlist,
                            nome_playlist: dati.nome_playlist,
                            url_cover_playlist: dati.url_cover_playlist,
                            lista_brani: braniPlaylist
                        }
                        callback(dati, 'OK');
                    } else callback(undefined, esitoQuery);
                });
            } else callback(dati, 'OK');
        } else callback(undefined, esitoOperazione);
    });
};

/**
 * Funzione per ottenere i dati consigliati per uno specifico utente. I dati consigliati includono una selezione di
 * brani, playlist e album scelti sulla base dei generi preferiti dell'utente.
 * @param {number} idUtente - L'id dell'utente per il quale si richiedono i dati consigliati.
 * @param {function} callback - La funzione da eseguire una volta terminata l'operazione.
 */
exports.richiestaDatiConsigliati = function (idUtente, callback) {
    var queryGeneri = "SELECT genere " +
        "FROM mv_generi_preferiti_utente " +
        "WHERE id_utente = ?;";
    dataRequestQuery(queryGeneri, idUtente, function (dati, esitoOperazione) {
        /**
         * Ottengo i generi preferiti dell'utente. Se non ne ha (utente appena registrato), gli viene assegnato
         * il genere "pop".
         */
        if (esitoOperazione === 'OK') {
            var generiPreferiti = dati.map(function (valoreCorrente) {
                return valoreCorrente.genere;
            });
            var numeroGeneri = generiPreferiti.length;
            if (generiPreferiti.length === 0) generiPreferiti.push('pop');
            /**
             * Genero la stringa contenente i parametri variabili della query, che potrebbero essere in numero
             * diverso a seconda di quanti generi ascolta l'utente (max 3 preferiti per costruzione delle tabelle)
             */
            var stringaParametriQuery = "genere = ? ";
            for (var i = 1; i < generiPreferiti.length; i++) {
                stringaParametriQuery += "OR genere = ? ";
            }
            // Seguono le query per brani, playlist e album consigliati
            var queryBrani = "SELECT * FROM mv_brani_consigliati_per_genere " +
                "WHERE ( " + stringaParametriQuery + ") AND id_brano NOT IN " +
                "(SELECT ref_brano_cb FROM playlist_contiene_brano, utente_possiede_playlist " +
                "WHERE ref_playlist_cb = ref_playlist_pp AND ref_utente_pp = ?);";
            var queryAlbum = ("SELECT * FROM mv_album_consigliati_per_genere " +
                "WHERE ( " + stringaParametriQuery + ") AND id_playlist NOT IN " +
                "(SELECT ref_playlist_pp FROM utente_possiede_playlist WHERE ref_utente_pp = ?);").replace(
                / genere/g, " genere_playlist");
            var queryPlaylist = queryAlbum.replace("album", "playlist").replace("consigliati", "consigliate");
            multipleQuery([queryBrani, queryPlaylist, queryAlbum], ["brani_consigliati", "playlist_consigliate", "album_consigliati"],
                dataRequestQuery, generiPreferiti.concat(idUtente), callback);
        } else callback(undefined, esitoOperazione);
    });
}

/**
 * Memorizza sul database lo stato di notifica visualizzata per una particolare amicizia formata dalla coppia
 * (idMittente, idRicevente).
 * @param {number} idMittente - L'id dell'utente che ha inviato la richiesta (e ha visualizzato la notifica).
 * @param {number} idRicevente - L'id dell'utente che ha ricevuto e accettato la richiesta.
 * @param {function} callback - La funzione da eseguira una volta completata l'operazione.
 */
exports.richiestaImpostazioneNotificaVisualizzata = function (idMittente, idRicevente, callback) {
    var query = "UPDATE amicizia " +
        "SET notifica_visualizzata = TRUE " +
        "WHERE ref_utente_1 = ? AND ref_utente_2 = ?;";
    updateQuery(query, [idMittente, idRicevente], callback);
}

/**
 * Richiede l'aggiunta di una playlist alle playlist personali di un utente
 * @param {number} idPlaylist - L'id della playlist che si vuole aggiungere a quelle dello specifico utente.
 * @param {number} idUtente - L'utente al quale aggiungere la playlist.
 * @param {function} callback - La funzione da eseguire una volta terminata l'operazione.
 */
exports.richiestaAggiuntaPlaylistAUtente = function (idPlaylist, idUtente, callback) {
    var query = "INSERT INTO utente_possiede_playlist " +
        "VALUES (?, ?)";
    updateQuery(query, [idUtente, idPlaylist], callback);
}

/**
 * Verifica se esiste un utente che ha, nella colonna "tipoDato", il valore "dato". Questa funzione viene utilizzata
 * per verificare, in fase di registrazione, che non esista già un utente con la stessa email o con lo stesso nome
 * utente inserito dal visitatore.
 * @param {string} dato - Il dato di cui si vuole verificare l'esistenza.
 * @param {string} tipoDato - La colonna all'interno della quale si vuole verificare la corrispondenza.
 * @param {function} callback - La funzione da eseguire dopo aver terminato l'operazione. Questa funzione viene chiamata
 *                              con la stringa "EXISTS" se una corrispondenza è stata trovata, con "OK" altrimenti
 *                              (se non si sono verificati errori).
 */
exports.richiestaVerificaDatiUtenteDuplicati = function (dato, tipoDato, callback) {
    var query = "SELECT * FROM utente WHERE " + tipoDato + " = ?;";
    matchQuery(query, dato, function (dati, esitoOperazione) {
        if (esitoOperazione === 'CONNERR') callback(esitoOperazione);
        else if (esitoOperazione === 'OK') callback('EXISTS');
        else callback('OK');
    });
}

/**
 * Richiede la modifica dell'immagine del profilo di un utente (aggiorna l'url sul database).
 * @param {string} urlImmagine - Url della nuova immagine del profilo dell'utente.
 * @param {number} idUtente - L'id dell'utente che ha aggiornato la sua immagine del profilo.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaModificaImmagineProfilo = function (urlImmagine, idUtente, callback) {
    var query = "UPDATE utente SET url_immagine_profilo = ? WHERE id_utente = ?;";
    updateQuery(query, [urlImmagine, idUtente], callback);
}

/**
 * Richiede la modifica della cover di una playlist da parte di un utente(aggiorna l'url sul database.
 * Questa operazione viene effettuata tramite modificaPlaylist, per via delle possibili playlist condivise tra più utenti.
 * @param {string} urlImmagine - Url della nuova cover della playlist.
 * @param {number} idUtente - L'id dell'utente che ha aggiornato la cover della playlist
 * @param {number} idPlaylist - L'id della playlist da modificare.
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaModificaCoverPlaylist = function (urlImmagine, idUtente, idPlaylist, callback) {
    var query = "UPDATE playlist SET url_cover_playlist = ? WHERE id_playlist = ?;";
    modificaPlaylist(idUtente, idPlaylist, query, {
        urlImmagine: urlImmagine,
        idPlaylist: idPlaylist
    }, callback);
}

/**
 * Richiede i dati di un artista. Oltre alle informazioni contenute nella tabella artista, vengono restituiti anche
 * i brani consigliati (quelli con più ascolti) e tutti gli album.
 * @param {number} idArtista - L'id dell'artista di cui si richiedono i dati.
 * @param {function} callback - La funzione da eseguire una volta terminata l'operazione.
 */
exports.richiestaDatiArtista = function (idArtista, callback) {
    var queryArtista = "SELECT id_artista, nome_artista, url_immagine, url_biografia AS biografia FROM artista WHERE id_artista = ?;"
    var queryBraniConsigliati = "SELECT id_brano, titolo, genere, durata, url_cover_brano " +
        "FROM mv_brani_piu_riprodotti_per_artista b " +
        "WHERE id_artista = ?;";
    var queryAlbum = "SELECT id_playlist, nome_playlist, genere_playlist, data_pubblicazione, url_cover_playlist " +
        "FROM album, playlist " +
        "WHERE ref_playlist_a = id_playlist " +
        "AND ref_artista_album = ?;";
    multipleQuery([queryArtista, queryBraniConsigliati, queryAlbum],
        ['dati_artista', 'dati_brani_consigliati_artista', 'dati_album_artista'],
        dataRequestQuery, idArtista, function (dati, esitoOperazione) {
            if (esitoOperazione !== 'OK') callback(undefined, esitoOperazione);
            else {
                var dati_artista = dati.dati_artista[0];
                dati_artista.dati_brani_consigliati = dati.dati_brani_consigliati_artista;
                dati_artista.dati_album = dati.dati_album_artista;
                callback(dati_artista, 'OK');
            }
        });
}

/**
 * Aggiorna il numero di riproduzioni dei brani sul database.
 * @param {number[]} datiRiproduzioni - I dati sulle nuove riproduzioni. L'array deve contenere delle coppie (memorizzate
 *                                      in posizioni adiacenti dell'array) [numero di riproduzioni, id brano].
 * @param {function} callback - La funzione da eseguire una volta completata l'operazione.
 */
exports.richiestaAggiornamentoNumeroRiproduzioni = function (datiRiproduzioni, callback) {
    var query = "";
    for (var i = 0; i < datiRiproduzioni.length / 2; i++) {
        query += "UPDATE brano SET n_riproduzioni = n_riproduzioni + ? WHERE id_brano =?; ";
    }
    genericQuery(query, datiRiproduzioni, callback);
}

/**
 * Aggiorna i dati sulle ultime riproduzioni degli utenti.
 * @param {number[]} datiRiproduzioni - I dati sulle nuove riproduzioni degli utenti. L'array deve contenere dati in pattern
 *                                      da quattri (memorizzati in posizioni adiacenti dell'array):
 *                                      [ultimo brano riprodotto utente x, ultima playlist riprodotta utente x,
 *                                      ultimo istante riproduzione utente x, id utente x].
 * @param {function} callback - La funzione da eseguire una volta terminata l'operazione.
 */
exports.richiestaAggiornamentoUltimiBraniRiprodotti = function (datiRiproduzioni, callback) {
    var query = "";
    for (var i = 0; i < datiRiproduzioni.length / 4; i++) {
        query += "UPDATE utente SET ultimo_brano_riprodotto = ?, ultima_playlist_riprodotta = ?, " +
            "ultimo_istante_riproduzione = ? WHERE id_utente = ?; ";
    }
    genericQuery(query, datiRiproduzioni, callback);
}

/**
 * Richiede i dati di uno specifico brano e dell'artista compositore.
 * @param {number} idBrano - L'id del brano di cui si richiedono i dati.
 * @param {function} callback - La funzione da eseguire una volta terminate le operazioni.
 */
function richiestaDatiBrano(idBrano, callback) {
    var queryDatibrano = "SELECT b.id_brano, b.titolo, b.genere, b.durata, b.anno, b.n_riproduzioni, b.url_cover_brano, " +
        "a.id_artista, a.nome_artista " +
        "FROM brano b, artista a " +
        "WHERE b.ref_artista_b = a.id_artista AND b.id_brano = ?";
    dataRequestQuery(queryDatibrano, idBrano, callback);
}
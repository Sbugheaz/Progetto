/**
 * Modulo per la gestione della pagina del web player (amicizie, brani, playlist, streaming audio).
 */
// Moduli utilizzati
var express = require('express');
var router = express.Router(); //modulo che gestisce il routing nel server
var mysql = require('mysql'); //modulo che gestisce l'interazione col database MySQL
var crypto = require('crypto'); //modulo che permette la criptografia delle password
var mediaserver = require('mediaserver'); //modulo che gestisce lo streaming della musica

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

/**
 * Funzione che richiama la funzione della libreria di hashing per criptare laa password passata come argomento.
 * @param {string} password - La password in chiaro
 * @returns {string} - La password criptata.
 */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
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
 * Funzione che controlla che il nome e il cognome rispettino la formattazione richiesta.
 * @param nome - Stringa da controllare.
 * @returns {boolean} ritorna vero o falso a seconda che la stringa sia formattata correttamente o meno.
 */
function validateName(nome) {
    var testo = /^[A-Z][a-z]{1,12}(\s[A-Z][a-z]{1,12})*$/;
    return testo.test(String(nome));
}

/**
 * Funzione che controlla che il nome di una playlist rispetti la formattazione richiesta.
 * @param nomePlaylist - Nome della playlist da controllare.
 * @returns {boolean} ritorna vero o falso a seconda che il formato del nome della playlist sia corretto  o meno.
 */
function validatePlaylist(nomePlaylist) {
    var testo = /^[A-Za-z][A-Za-z0-9]{1,25}$/;
    return testo.test(String(nomePlaylist));
}

/**
 * Chiamata che rende statiche le risorse del server, a partire dalla cartella 'public' per poterle inviare insieme alle
 * pagine.
 */
router.use(express.static('public'));


/**
 * Gestisce l'accesso alle funzionalità della pagina del webPlyaer, mandandola in seguito ad una richiesta di un utente
 * che ha già effettuato l'accesso al sito. Se l'utente non si è collegato rimanda la pagina di login.
 */

router.get('/', function (req, res) {
    if (req.session.idUtente != undefined) {
        res.sendFile('public/webPlayer.html', {root: '/var/www/html/'});
        console.log("Pagina del web player inviata a " + req.ip.substr(7) + "\n");
    }
    else {
        res.redirect('/');
    }
});

/**
 * Restituisce i dati dell'utente che ha eseguito il login al caricamento della pagina del web player.
 */
router.get('/utente', function (req, res) {
        var query1 = "SELECT NomeUtente, Nome, Cognome, DataDiNascita, Email " +
            "FROM Account " +
            "WHERE IDUtente = '" + req.session.idUtente + "'";
        con.query(query1, function (err, result, fields) {
            if (err) throw err;
            var query2 = "UPDATE Account SET Ascolta = '-' WHERE IDUtente=" + req.session.idUtente;
            con.query(query2, function (err, result, fields) {
                if (err) throw err;
            });
            if(result.length != 0) res.send(JSON.stringify(result));
            //Se la query non trova alcun utente il server manda un errore
            else res.send("ERR");
        });
});

/**
 * Aggiorna la password dell'utente a seguito di una sua modifica.
 */
router.post('/modificaPassword', function (req, res) {
    var password = req.body.vecchiaPassword;
    var nuovaPassword = req.body.nuovaPassword;
    var confermaNuovaPassword = req.body.confermaNuovaPassword;
    var query1 = "SELECT IDUtente, NomeUtente " +
        "FROM Account " +
        "WHERE IDUtente = '" + req.session.idUtente + "' AND Password = '" + hashPassword(password) + "'";
    con.query(query1, function (err, result, fields) {
        if (err) throw err;
        if(result == 0) // La vecchia password non coincide con quella utilizzata dall'utente
            res.send("ERR_1");
        else {
            if(password == nuovaPassword)
                res.send("ERR_2");
            else if (!validatePassword(nuovaPassword)) { // La password non rispetta il formato richiesto
                res.send("ERR_3");
            }
            else if (nuovaPassword != confermaNuovaPassword) { // Le password non coincidono
                res.send("ERR_4");
            }
            else {
                var query2 = "UPDATE Account SET Password = '" + hashPassword(nuovaPassword) + "' WHERE IDUtente= '" + result[0].IDUtente +" '";
                con.query(query2, function (err, result, fields) {
                    if (err) throw err;
                });
                res.send("OK");
                console.log("L'utente " + result[0].NomeUtente + " ha aggiornato la sua password.\n");
            }
        }
    });
});

/**
 * Aggiorna i dati dell'account a seguito di una modifica dell'utente.
 */
router.post('/modificaAccount', function (req, res) {
    var nome = req.body.nome;
    var cognome = req.body.cognome;
    var dataNascita = req.body.dataNascita;
    var query1 = "SELECT IDUtente, NomeUtente " +
        "FROM Account " +
        "WHERE IDUtente = '" + req.session.idUtente + "'";
    con.query(query1, function (err, result, fields) {
        if (err) throw err;
        if(result == 0)
            res.send("ERR_1");
        else if (!validateName(nome)) { // Il nome non rispetta il formato corretto
            res.send("ERR_2");
        }
        else if (!validateName(cognome)) { // Il cognome non rispetta il formato corretto
            res.send("ERR_3");
        }
        else {
            var query2 = "UPDATE Account SET Nome = '" + nome + "', Cognome = '" + cognome +  "', DataDiNascita = '" +
                dataNascita + "' WHERE IDUtente= '" + result[0].IDUtente +" '";
            con.query(query2, function (err, result, fields) {
                if (err) throw err;
            });
            res.send("OK");
            console.log("L'utente " + result[0].NomeUtente + " ha aggiornato dati del suo account.\n");
            }
    });
});

/**
 * Restituisce i dati degli amici dell'utente che ha eseguito il login al caricamento della pagina del web player.
 */
router.get('/amici', function (req, res) {
    var query = "SELECT IDUtente, Nome, Cognome, NomeUtente " +
        "FROM Amicizia, Account " +
        "WHERE Ref2_IDUtente = IDUtente AND Ref1_IDUtente = " + req.session.idUtente +
        " ORDER BY Nome";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        //Se la query restituisce gli amici dell'utente li manda al client
        if(result.length != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});

/**
 * Elimina un amico dalla lista amici dell'utente.
 */
router.post('/amici/eliminaAmico', function (req, res) {
    var idAmico = req.body.idAmico; //Da completare
    var query = "DELETE FROM Amicizia WHERE Ref1_IDUtente = " + req.session.idUtente + " AND Ref2_IDUtente = " + idAmico;
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        else res.send("OK");
    });
});

/**
 * Aggiunge un amico alla lista amici dell'utente.
 */
router.post('/amici/aggiungiAmico', function (req, res) {
    var idAmico = req.body.idAmico;
    var query = "INSERT INTO Amicizia VALUES(" + req.session.idUtente + ", " + idAmico + ")";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        else res.send("OK");
    });
});

/**
 * Restituisce gli utenti che soddisfano i criteri di ricerca a seguito di una ricerca da parte dell'utente.
 */
router.post('/amici/cercaUtenti', function (req, res) {
    var utenteCercato = req.body.utenteCercato;
    if(utenteCercato != "") {
        var query = "SELECT IDUtente, Nome, Cognome, NomeUtente " +
                    "FROM Account " +
                    "WHERE (NomeUtente LIKE '" + utenteCercato + "%' OR " +
            "CONCAT(Nome, ' ', Cognome) LIKE '" + utenteCercato + "%' OR " +
            "CONCAT(Cognome, ' ', Nome) LIKE '" + utenteCercato + "%') " +
            "AND IDUtente<>" + req.session.idUtente + " AND IDUtente NOT IN (" +
                                                "SELECT IDUtente " +
                                                "FROM Account, Amicizia " +
                                                "WHERE IDUtente = Ref2_IDUtente AND Ref1_IDUtente = " + req.session.idUtente + ") " +
            "ORDER BY NomeUtente";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result == 0) res.send("ERR"); //Se nessun utente soddisfa i criteri di ricerca il server manda un errore
            else res.send(JSON.stringify(result));
        });
    }
});

/**
 * Restituisce i dati degli amici dell'utente attualmente online al caricamento della pagina del web player. Questa
 * richiesta viene ricevuta ogni 30 secondi per permettere l'aggiornamento in tempo reale dello stato online degli
 * amici.
 */
router.get('/amiciOnline', function (req, res) {
    if(req.session.idUtente != undefined) {
        var query = "SELECT IDUtente, Nome, Cognome, NomeUtente, Ascolta " +
            "FROM Amicizia, Account " +
            "WHERE Ref2_IDUtente = IDUtente AND Ref1_IDUtente = " + req.session.idUtente + " AND StatoOnline = 1 " +
            "ORDER BY Nome";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            //Se la query restituisce gli amici online li manda al client
            if (result.length != 0) res.send(JSON.stringify(result));
            else res.send("ERR");
        });
    }
});

/**
 * Aggiorna il brano che l'utente sta ascoltando attualmente. Il brano in ascolto verrà visualizzato nella sezione
 * "Amici online" degli altri utenti che lo hanno aggiunto alla loro lista amici.
 */

router.post('/ascolta', function (req, res) {
    var branoInAscolto = req.body.branoInAscolto;
            var query = "UPDATE Account SET Ascolta = '" + branoInAscolto + "' WHERE IDUtente = " + req.session.idUtente;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
            });
});


/**
 * Restituisce i brani relativi al genere scelto dall'utente.
 */
router.post('/musica/genere', function (req, res) {
    var genere = req.body.genere;
    var query = "SELECT IDBrano, Titolo, Artista, Durata, Url_cover, Url_brano " +
        "FROM Brano " +
        "WHERE Genere = '" + genere + "' " +
        "ORDER BY Titolo";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        //Se la query restituisce i brani li manda al client
        if(result.length != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});

/**
 * Restituisce i brani che soddisfano i criteri di ricerca a seguito di una ricerca da parte dell'utente.
 */
router.post('/musica/cercaBrani', function (req, res) {
    var braniCercati = req.body.braniCercati;
    if(braniCercati != "") {
        var query = "SELECT IDBrano, Titolo, Artista, Durata, Url_cover, Url_brano " +
                    "FROM Brano " +
                    "WHERE CONCAT(Titolo, ' ', Artista) LIKE '" + braniCercati + "%' OR " +
                          "CONCAT(Artista, ' ', Titolo) LIKE '" + braniCercati + "%' OR " +
                          "Artista LIKE '%" + braniCercati + "%' " +
            "OR IDBrano IN (SELECT IDBrano " +
                            "FROM Brano, Appartenenza, Album " +
                            "WHERE IDBrano = Ref_IDBrano AND IDAlbum = Ref_IDAlbum AND Album.Nome LIKE '" + braniCercati + "%') " +
            "ORDER BY Titolo";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result == 0) res.send("ERR"); //Se nessun brano soddisfa i criteri di ricerca il server manda un errore
            else res.send(JSON.stringify(result)); //Manda tutti gli album che soddisfano i criteri di ricerca
        });
    }
});

/**
 * Restituisce gli album che soddisfano i criteri di ricerca a seguito di una ricerca da parte dell'utente.
 */
router.post('/musica/cercaAlbum', function (req, res) {
    var albumCercati = req.body.albumCercati;
    if(albumCercati != "") {
        var query = "SELECT DISTINCT IDAlbum, Nome, Artista, NumeroBrani, Url_cover " +
                    "FROM Album " +
                    "WHERE (CONCAT(Nome, ' ', Artista) LIKE '" + albumCercati + "%' OR " +
                                    "CONCAT(Artista, ' ', Nome) LIKE '" + albumCercati + "%') " +
                    "ORDER BY Nome";
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result == 0) res.send("ERR"); //Se nessun album soddisfa i criteri di ricerca il server manda un errore
            else res.send(JSON.stringify(result)); //Manda tutti gli album che soddisfano i criteri di ricerca
        });
    }
});

/**
 * Effettua lo streaming di un brano.
 */
router.get('/riproduciBrano/musica/' + '((\\d+){1,2}' + '/(\\w+))' + '.mp3', function (req, res) {
    var brano = '/var/www/html/private/media/' + req.url.slice(16);
    mediaserver.pipe(req, res, brano);
    console.log("Richiesto lo streaming di un brano.\n");
});

/**
 * Restituisce i dati delle playlist dell'utente che ha eseguito il login al caricamento della pagina del web player.
 */
router.get('/playlist', function (req, res) {
    var query = "SELECT IDPlaylist, Playlist.Nome " +
        "FROM Playlist, Possiede, Account " +
        "WHERE Ref_IDUtente = IDUtente AND Ref_IDPlaylist = IDPlaylist AND IDUtente = " + req.session.idUtente +
        " ORDER BY Playlist.Nome";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        //Se la query restituisce gli amici dell'utente li manda al client
        if(result.length != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});

/**
 * Crea una playlist il cui nome non sia già stato utilizzato da altre playlist di quell'utente.
 */
router.post('/playlist/creaPlaylist', function (req, res) {
    var nomePlaylist = req.body.nomePlaylist;
    if(nomePlaylist == "")
        res.send("ERR_1"); //Se il nome della playlist è una stringa vuota o non rispetta il formato corretto manda un errore
        else if(!validatePlaylist(nomePlaylist))
            res.send("ERR_2"); //Se il nome della playlist non rispetta il formato corretto manda un errore
    else {
        var query1 = "SELECT Playlist.Nome " +
            "FROM Playlist, Possiede, Account " +
            "WHERE IDPlaylist = Ref_IDPlaylist AND IDUtente = Ref_IDUtente AND IDUtente = " + req.session.idUtente +
            " AND Playlist.Nome = '" + nomePlaylist + "'";
        con.query(query1, function (err, result, fields) {
            if (err) throw err;
            if (result.length != 0)
                res.send("ERR_3"); //L'utente ha già creato una playlist con lo stesso nome
            else {
                var query2 = "INSERT INTO Playlist (Nome) VALUES ('" + nomePlaylist + "')";
                con.query(query2, function (err, result, fields) {
                    if (err) throw err;
                    var query3 = "SELECT MAX(IDPlaylist) AS Max " +
                        "FROM Playlist ";
                    con.query(query3, function (err, result, fields) {
                        if(err) throw (err);
                        var idPlaylist = result[0].Max;
                        var query4 = "INSERT INTO Possiede VALUES (" + req.session.idUtente + ", " + idPlaylist + ")";
                        con.query(query4, function (err, result, fields) {
                            if (err) throw err;
                            var query5 = "SELECT * " +
                                "FROM Playlist " +
                                "WHERE IDPlaylist = " + idPlaylist;
                            con.query(query5, function (err, result, fields) {
                                if (err) throw err;
                                res.send(JSON.stringify(result));
                            });
                        });
                    });
                });
            }
        });
    }
});

/**
 * Elimina la playlist selezionata dall'utente.
 */
router.post('/playlist/eliminaPlaylist', function (req, res) {
        var idPlaylist = req.body.idPlaylist;
        var query = "DELETE FROM Playlist WHERE IDPlaylist = " + idPlaylist;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            else res.send("OK");
        });
});

/**
 * Restituisce tutti i brani contenuti in una playlist utilizzando una vista creata nella fase di riempimento del
 * database.
 */
router.post('/playlist/mostraBrani', function (req, res) {
    var idPlaylist = req.body.idPlaylist;
    var query = "SELECT IDBrano, Titolo, Artista, Durata, Url_cover, Url_brano " +
                "FROM Brani_Playlist " +
                "WHERE IDUtente = " + req.session.idUtente + " AND IDPlaylist = " + idPlaylist;
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        if(result != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});

/**
 * Aggiunge un brano in coda alla playlist selezionata dall'utente.
 */
router.post('/playlist/aggiungiBrano', function (req, res) {
    var idPlaylist = req.body.idPlaylist;
    var idBrano = req.body.idBrano;
    var query1 = "SELECT IDBrano " +
        "FROM Brani_Playlist " +
        "WHERE IDPlaylist = " + idPlaylist + " AND IDUtente = " + req.session.idUtente + " AND IDBrano = " + idBrano;
    con.query(query1, function (err, result, fields) {
        if (err) throw err;
        if (result.length != 0)
            res.send("ERR"); //L'utente ha già aggiunto il brano alla playlist selezionata
        else {
            var query2 = "SELECT MAX(OrdineBrano)+1  AS Max " +
                "FROM Composizione " +
                "WHERE Ref_IDPlaylist = " + idPlaylist;
            con.query(query2, function (err, result, fields) {
                if (err) throw err;
                var ordineBranoDaInserire = result[0].Max;
                var query3 = "INSERT INTO Composizione VALUES " +
                    "(" + ordineBranoDaInserire + ", " + idPlaylist + ", " + idBrano + ")";
                con.query(query3, function (err, result, fields) {
                    if (err) throw err;
                });
            });
            res.send("OK");
        }
    });
});

/**
 * Elimina un brano all'interno della playlist selezionata dall'utente.
 */
router.post('/playlist/eliminaBrano', function (req, res) {
    var idPlaylist = req.body.idPlaylist;
    var idBrano = req.body.idBrano;
    var query = "DELETE FROM Composizione WHERE Ref_IDPlaylist = " + idPlaylist +" AND Ref_IDBrano = " + idBrano;
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        else res.send("OK");
    });
});

/**
 * Restituisce i dati di tutti gli album presenti al caricamento della pagina.
 */
router.get('/album', function (req, res) {
    var query = "SELECT * " +
                "FROM Album " +
                "ORDER BY Nome ";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        //Se la query restituisce gli amici dell'utente li manda al client
        if(result.length != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});

/**
 * Restituisce tutti i brani contenuti in un album.
 */
router.post('/album/mostraBrani', function (req, res) {
    var idAlbum = req.body.idAlbum;
    var query = "SELECT IDBrano, Titolo, B.Artista, Durata, B.Url_cover, Url_brano " +
        "FROM Album A, Appartenenza Ap, Brano B " +
        "WHERE A.IDAlbum = Ap.Ref_IDAlbum AND B.IDBrano = Ap.Ref_IDBrano AND IDAlbum = " + idAlbum +
        " ORDER BY OrdineBrano";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        if(result != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});

/**
 * Restituisce tutti i singoli (i brani che non appartengono a nessun album).
 */
router.get('/album/mostraSingoli', function (req, res) {
    var query = "SELECT IDBrano, Titolo, Artista, Durata, Url_cover, Url_brano " +
        "FROM Brano " +
        "WHERE IDBrano NOT IN (SELECT IDBrano " +
                              "FROM Album, Appartenenza, Brano " +
                              "WHERE IDAlbum = Ref_IDAlbum AND IDBrano = Ref_IDBrano)";
    con.query(query, function (err, result, fields) {
        if (err) throw err;
        if(result != 0) res.send(JSON.stringify(result));
        else res.send("ERR");
    });
});


module.exports = router; //esporta il router cosicchè possa essere chiamato dal file main.js del server
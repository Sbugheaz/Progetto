/**
 * Questo file js contiene tutti i costruttori degli oggetti che verrano utilizzati all'interno della pagina del web
 * player. Essi permettono di inizializzare e settare i parametri degli oggetti JSON ricevuti dal server.
 */

//Costruttore dell'oggetto brano che contiene tutte le informazioni di ogni brano
function Brano(brano) {
    this.idBrano = brano.IDBrano; //ID del brano
    this.titolo = brano.Titolo; //Titolo del brano
    this.artista = brano.Artista; //Artista o artisti del brano
    this.genere = brano.Genere; //Genere del brano
    this.dataUscita = brano.DataUscita; //Data in cui è uscito il brano
    this.durata = brano.Durata; //Durata in secondi del brano
    this.url_cover = brano.Url_cover; //Indirizzo della cover del brano
    this.url_brano = brano.Url_brano; //Indirizzo del file audio del brano, necessario per richiedere lo streaming al server
}

//Costruttore dell'oggetto Account che contiene tutti i dati dell'utente che ha effettuato l'accesso
function Account(account) {
    this.idUtente = account.IDUtente; //ID dell'utente
    this.nomeUtente = account.NomeUtente; //Nome utente con cui è possibile effettuare l'accesso
    this.password = account.Password; //Password con cui è possibile effettuare l'accesso
    this.email = account.Email; /*Email alla quale il server può comunicare informazioni riguardanti la registrazione
                                  dell'account e il recupero della password */
    this.nome = account.Nome; //Nome dell'utente
    this.cognome = account.Cognome; //Cognome dell'utente
    this.sesso = account.Sesso; //Sesso dell'utente
    this.dataDiNascita = account.DataDiNascita; //Data di nascita dell'utente
    this.statoOnline = account.StatoOnline; //Variabile booleana che vale 1 se l'utente è online oppure 0 se offline
    this.attivazione = account.Attivazione; /*Variabile booleana che vale 1 se l'account è stato attivato mediante il link
                                              di conferma ricevuto tramite email oppure 0 se l'account non è ancora attivo*/
    this.ascolta=account.Ascolta; /*Informazione che contiene il titolo del brano attualmente in ascolto da parte dell'utente,
                                    utile per permettere agli altri utenti che lo hanno aggiunto alla lista amici di vedere il
                                    brano attualmente in ascolto */
}

//Costruttore dell'oggetto Playlist che contiene l'id e il nome di ogni playlist dell'utente che ha effettuato l'accesso
function Playlist(playlist) {
    this.idPlaylist = playlist.IDPlaylist; //ID della playlist
    this.nome = playlist.Nome; //Nome della playlist, unico all'interno di uno stesso utente
}

//Costruttore dell'oggetto Album che contiene tutte le informazioni di ogni album
function Album(album) {
    this.idAlbum = album.IDAlbum; //ID dell'album
    this.nome = album.Nome; //Titolo dell'album
    this.artista = album.Artista; //Artista dell'album
    this.numeroBrani = album.NumeroBrani; //Numero dei brani che l'album contiene
    this.url_cover = album.Url_cover; //Indirizzo della cover dell'album
}
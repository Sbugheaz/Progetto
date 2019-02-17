/*Costruttore dell'oggetto canzone*/
function Brano(brano){
    this.idBrano = brano.IDBrano;
    this.titolo = brano.Titolo;
    this.artista = brano.Artista;
    this.genere = brano.Genere;
    this.dataUscita = brano.DataUscita;
    this.durata = brano.Durata;
    this.url_cover = brano.Url_cover;
    this.url_brano = brano.Url_brano;
}

/*Costruttore dell'oggetto Utente*/
function Account(account){
    this.idUtente = account.IDUtente;
    this.nomeUtente = account.NomeUtente;
    this.password = account.Password;
    this.email = account.Email;
    this.nome = account.Nome;
    this.cognome = account.Cognome;
    this.sesso = account.Sesso;
    this.dataDiNascita = account.DataDiNascita;
    this.statoOnline = account.StatoOnline;
    this.attivazione = account.Attivazione;
    this.ascolta=account.Ascolta;
}

/*Costruttore dell'oggetto Playlist*/
function Playlist(playlist){
    this.idPlaylist = playlist.IDPlaylist;
    this.nome = playlist.Nome;
    this.numeroBrani = playlist.NumeroBrani;
}

/*Costruttore dell'oggetto Album*/
function Album(album){
    this.idAlbum = album.IDAlbum;
    this.nome = album.Nome;
    this.artista = album.Artista;
    this.numeroBrani = album.NumeroBrani;
    this.url_cover = album.url_cover;
}



/*costruttore dell'oggetto canzone*/
function Brano(brano){
    this.idBrano = brano.IDBrano;
    this.titolo = brano.Titolo;
    this.artista = brano.Artista;
    this.genere = brano.Genere;
    this.anno = brano.Anno;
    this.durata = brano.Durata;
    this.url_cover = brano.Url_cover;
    this.url_brano = brano.Url_brano;
}

/*costruttore dell'oggetto Utente*/
function Account(account){
    this.idUtente = account[0].IDUtente;
    this.nomeUtente = account[0].NomeUtente;
    this.password = account[0].Password;
    this.email = account[0].Email;
    this.nome = account[0].Nome;
    this.cognome = account[0].Cognome;
    this.sesso = account[0].Sesso;
    this.dataDiNascita = account[0].DataDiNascita;
    this.statoOnline = account[0].StatoOnline;
    this.attivazione = account[0].Attivazione;
}

/*costruttore dell'oggetto Playlist*/
function Playlist(playlist){
    this.idPlaylist = playlist.IDPlaylist;
    this.nome = playlist.Nome;
    this.numeroBrani = playlist.NumeroBrani;
}
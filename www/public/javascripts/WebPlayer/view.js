/**
 * Questo file js contiene tutte le funzioni di stampa degli oggetti ricevuti lato server per mostrarli correttamente
 * all'interno del file HTML.
 */

//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa i dati dell'account nell'apposito form
function stampaDatiAccount(utente) {
    $(".nomeUtente").html("<br>" + utente.nomeUtente);
    $('#nome').attr("value", utente.nome);
    $('#cognome').attr("value", utente.cognome);
    $('#dataNascita').attr("value", utente.dataDiNascita.substring(0, 10));
    $('#email').attr("value", utente.email);
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli amici di un utente nell'apposita lista
function stampaListaAmici(listaAmici){
    var content="";
    $("#contenitore-lista-amici").append('<ul class="demo listaAmici" style="color:cornsilk;">');
    for(i=0; i<listaAmici.length; i++) {
        content += '<li class="amico" id="amico' + listaAmici[i].idUtente + '">' +
            '<div class="datiAmico nomeAmico">' + listaAmici[i].nome + '</div>' +
            '<div class="datiAmico cognomeAmico">' + listaAmici[i].cognome + '</div>' +
            '<div class="datiAmico nomeUtenteAmico">' + listaAmici[i].nomeUtente + '</div>' +
            '<div class="datiAmico container-icona-rimuovi-amico">' +
            '<i class="fa fa-user-times icona-rimuovi-amico" id="rimuovi-amico' + listaAmici[i].idUtente +'"'+
            'data-toggle="modal" data-target="#modal-conferma-rimAmico" title="Rimuovi amico"></i> </div>' +
            '</li>' ;
        $(".listaAmici").append(content);
        content = "";
    }
    $(".icona-rimuovi-amico").click(function(evento) { //intercetto l'evento di click di rimozione amico
            recuperaIDElimina(evento); //funzione che recupera l'id dell'amico da eliminare
            $("#tastoConfermaRim").click(function () {
                eliminaAmico();        //sul click di conferma, rimuove l'amico
            });
        }
    );
}


/*Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli utenti che non sono già
tra gli amici e corrispondono ai criteri di ricerca */
function stampaAmiciDaAggiungere(lu){
        var content = "";
        $(".container-listaUtenti").append('<ul class="demo listaUtenti">');
        for (i = 0; i < lu.length; i++) {
            listaUtenti[i] = new Account(lu[i]);    //salva tutti gli utenti trovati nell'apposito vettore
            content += '<li class="p_listaUtenti">' +
                '<div class="nomeUtente_da_aggiugere">' + listaUtenti[i].nomeUtente + ' (' + listaUtenti[i].nome + " " + listaUtenti[i].cognome + ') </div>' +
                '<div class="cont-pulsante-aggiungi-utente"> <i class="fa fa-user-plus pulsante-aggiungi-utente" ' +
                'id="aggiungi-amico' + listaUtenti[i].idUtente +'" title="Aggiungi amico"></i> </div>' +
                '</li>';
            $(".listaUtenti").append(content);
            content = "";
        }
        $(".pulsante-aggiungi-utente").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
            recuperaIDAggiungi(evento); //funzione che recupera l'id dell'amico da aggiungere
            aggiungiAmico();
        }
    );
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli amici di un utente
function stampaAmiciOnline(listaAmiciOnline){
    $(".listaAmiciOnline").remove();
    //riempie la colonna destra contenente gli amici online
    var content1="";
    $(".container-listaAmici").append('<ul class="demo listaAmiciOnline">');
    for(i=0; i<listaAmiciOnline.length; i++) {
        content1 += '<li class="p_listaAmici"><i class="fa fa-circle pallino" style="padding-right:5%"> </i>' +
            listaAmiciOnline[i].nome +' '+ listaAmiciOnline[i].cognome  +'<br> <p class="sta-ascoltando">' +
            '<i class="fa fa-music icona-musica"></i> "'+ listaAmiciOnline[i].ascolta + '" </p> </li>' ;
        $(".listaAmiciOnline").append(content1);
        content1 = "";
    }
    //riempie la lista di amici online in modalità mobile
    $(".demo-mobile").remove();
    var content2= "";
    $(".container-listaAmici-mobile").append('<ul class="demo demo-mobile">');
    for(i=0; i<listaAmiciOnline.length; i++) {
        content2 += '<li class="p_listaAmici">' +
            '<div class="nomeUtente_online"> <i class="fa fa-circle pallino" style="padding-right:5%"> </i>' +
            listaAmiciOnline[i].nome + ' '+ listaAmiciOnline[i].cognome +' ('+ listaAmiciOnline[i].nomeUtente +')' +'</div>' +
            '<div class="branoAscoltato"> <p class="sta-ascoltando"><i class="fa fa-music icona-musica"></i> " '+ listaAmiciOnline[i].ascolta + ' " </p>' +
            '</div> </li>' ;
        $(".demo-mobile").append(content2);
        content2 = "";
    }
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa nell'apposita lista i brani relativi al genere selezionato
function stampaListaBraniPerGenere(listaBrani){
    $(".listaGenere").remove(); //svuota la lista contenente i brani
    $("#contenitore-listaBrani-genere").scrollTop(); //riporta la scrollbar in alto
    var content="";
    $("#contenitore-listaBrani-genere").append('<ul class="demo listaGenere">');
    for(i=0; i<listaBrani.length; i++) {
        content += '<li class="genere">' +
            ' <div class="datiCanzoni nomeCanzone_genere">' + listaBrani[i].titolo + '</div>' +
            ' <div class="datiCanzoni nomeArtista_genere">' + listaBrani[i].artista + '</div>' +
            ' <div class="datiCanzoni imgCover"><img src="' + listaBrani[i].url_cover + '" class="cover"></div>' +
            ' <div class="datiCanzoni container-icona-play-gen"><i class="fa fa-play icona-play-gen"id="icona-play'+
            listaBrani[i].idBrano + '" style="cursor:pointer;" title="Riproduci brano"></i> </div> <div class="datiCanzoni container-icona-aggiungi-playlist-gen">' +
            '<i class="fa fa-plus-circle icona-aggiungi-Aplaylist-gen" id="agg-a_play' + listaBrani[i].idBrano + '"' +
            'data-toggle="modal" data-target="#modal-aggiungi-APlaylist" style="cursor:pointer;" title="Aggiungi ad una playlist"></i></div>' +
        ' </li>' ;
        $(".listaGenere").append(content);
        content = "";
    }
    $(".icona-play-gen").click(function(evento) {  //funzione che intercetta l'evento di click riproduci brano
        recuperaIDBrano(evento);  //ricava l'id del brano selezionato per riprodurlo
        playListAvviata=false;
        riproduciBrano();  //permette la riproduzione del brano
            if(shuffleB==true){  //gestisce la sequenza di brani in modalità riproduzione casuale
                percorsi=shuffle(percorsi);
            }
    }
    );
    $(".icona-aggiungi-Aplaylist-gen").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta a playlist
            recuperaIDBrano(evento);    //ricava l'id del brano selezionato per riprodurlo
            stampaListaPlaylistAggiungi();
        }
    );
}


/*Funzione che viene invocata una volta ricevuti i dati dal server e che stampa i brani che corrispondono ai criteri di
ricerca nell'apposita lista*/
function stampalistaBraniRicerca(lb){
    var content = "";
    $("#contenitore-lista-ricerca-brani").append('<ul class="demo listaRicerca" style="color:cornsilk;">');
    for (i = 0; i < lb.length; i++) {
        listaBrani[i] = new Brano(lb[i]);
        content += '<li class="li-lista-brani">' +
            '<div class="datiCanzoni contenitore-imgBrano-esterno"> ' +
            '<div class="contenitore-imgBrano-interno">' +
            '<img src="' + listaBrani[i].url_cover + '" class="coverBrano" id="coverBrano'+ listaBrani[i].idBrano+ '" title="Riproduci brano">' +
            '<i class="fa fa-play play-brano"></i></div></div>'+
            '<div class="datiCanzoni contenitore-nomeCanzone-Artista"> "'+ listaBrani[i].titolo + '" - '+ listaBrani[i].artista +'</div>' +
            '<div class="datiCanzoni contenitore-icona-aggiungi-playlist">' +
            '<i class="fa fa-plus-circle icona-aggiungi-Aplaylist" data-toggle="modal" data-target="#modal-aggiungi-APlaylist"' +
            'id="agg-a-play'+ listaBrani[i].idBrano +'" title="Aggiungi ad una playlist"></i> </div>'+
        '</li>';
        $(".listaRicerca").append(content);
        content = "";
    }
    $(".coverBrano").click(function (evento) { //funzione che intercetta l'evento di click riproduci
        recuperaIDBrano(evento);    //recupera l'id del brano che si vuole riprodurre
        abilitaPlayer();        //abilita i tasti del player una volta caricato un brano
        playListAvviata=false;
        riproduciBranoSingolo();  //manda in riproduzione soltanto il brano selezionato

        }
    );

    $(".icona-aggiungi-Aplaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta a playlist
           recuperaIDBrano(evento);     //recupera l'id del brano che si vuole aggiungere ad una playlist
           stampaListaPlaylistAggiungi();
        }
    );
}


/*Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli album che corrispondono
ai criteri di ricerca*/
function stampalistaAlbumRicerca(la){
    var content = "";
    var listaAlbumRicerca = JSON.parse(JSON.stringify(listaAlbum));
    for (i = 0; i < la.length; i++) {
        listaAlbumRicerca[i] = new Album(la[i]);
        content += '<div class="flex-item-Album">' +
            '<img src="' + listaAlbumRicerca[i].url_cover + '" class="flex-item-img img_album" id="album-r'+ listaAlbumRicerca[i].idAlbum +'">' +
            '<div class="contenitore-nomeAlbum">' +
            '<p class="nomeAlbum nomeAlbumRicerca">"' + listaAlbumRicerca[i].nome+ '" <br>'  + listaAlbumRicerca[i].artista +'<br> </p></div></div>';
        $("#contenitore-lista-ricerca-album").append(content);
        content = "";
    }

    $(".img_album").click(function(evento) {  //funzione che intercetta l'evento di click sull'album ricercato
             recuperaIDAlbum(evento);       //recupera l'id dell'album selezionato
             mostraPannelloAlbum();         //mostra nel Pannello "In Riproduzione" la lista dei brani appartenti all'album selezionato
             $("#album_n" + idAlbum).click();
        }
    );

}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa tutte le playlist di un utente nell'apposita lista
function stampaListaPlaylist(listaPlaylist){
    $("#contenitore-playlist").empty();

    //stampa il flex-item "Crea playlist" che permette la creazione di nuove playlist
    $("#contenitore-playlist").append('<div class="flex-item container-addPlaylist" data-toggle="modal" data-target="#modal-crea-playlist">\n' +
                                            '<div class="flex-item-conteiner">\n' +
                                                '<div class="flex-item-conteiner-icon">\n' +
                                                    '<a class="icona-aggiungi-playlist"><i class="fa fa-plus"></i></a>\n' +
                                                '</div>\n' +
                                                '<div class="contenitore-nomePlaylist"><p class="nomePlaylist">Crea playlist</p></div>\n' +
                                            '</div>\n' +
                                        '</div>');
    var content="";

    //stampa tutti i flex-item contenenti le playlist possedute dall'utente
    for(i=0; i<listaPlaylist.length; i++) {
        content += '<div class="flex-item container-playlist" id="playlist'+ listaPlaylist[i].idPlaylist +'">' +
                       '<div class="flex-item-conteiner" style="pointer-events: none;">' +
                            '<div class="flex-item-conteiner-icon" style="pointer-events: none;"><a class="icona-playlist"><i class="fa fa-music"></i></a></div>' +
                            '<div class="contenitore-nomePlaylist" style="pointer-events: none;"><p class="nomePlaylist">'+ listaPlaylist[i].nome +'</p></div>' +
                        '</div>' +
                    '</div>' ;
        $("#contenitore-playlist").append(content);
        content = "";
        }

    $(".container-playlist").click(function(evento) { //intercetta l'evento di click di selezione di una playlist
            recuperaIDPlaylist(evento);     //recupera l'id della playlist selezionata
            richiediBraniPlaylist();        //richiede al database tutti i brani appartenenti alla playlist selezionata
            idPlaylistSelezionato=idPlaylist;
            cambiaDimensioniConteinerPlaylist();    //adatta le dimensioni dei container
        }
    );
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa tutti gli album nell'apposita lista
function stampaListaAlbum(listaAlbum){
    $(".flex-container-Album").empty();

    //Stampa il flex-item-container contenente tutti i singoli
    $(".flex-container-Album").append('<div class="flex-item-Album"><img src="images/cover/default-album.png" class="flex-item-img" id="singoli">' +
                                        '<div class="contenitore-nomeAlbum"><p class="nomeAlbum">Singoli</p></div></div>');
    $("#singoli").click(function(evento) {
            richiediBraniSingoli();
            cambiaDimensioniConteinerAlbum();
        }
    );

    //Stampo i flex-item che contengono tutti gli altri album
    var content="";
    for(i=0; i<listaAlbum.length; i++) {
        content += '<div class="flex-item-Album">' +
            '<img src="'+ listaAlbum[i].url_cover +'" class="flex-item-img coverAlbum" id="album_n'+ listaAlbum[i].idAlbum +'">' +
            '<div class="contenitore-nomeAlbum"><p class="nomeAlbum">'+ listaAlbum[i].nome +'</p></div></div>' ;
        $(".flex-container-Album").append(content);
        content = "";
    }
    $(".coverAlbum").click(function(evento) { //intercetta l'evento di click di selezione di un album
            recuperaIDAlbum(evento);        //recupera l'id dell'album selezionato
            cambiaDimensioniConteinerAlbum();   // adatta le dimensioni dei container
            richiediBraniAlbum();       //richiede al database i brani appartenenti all'album selezionato
        }
    );
}


/*Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista dei brani
appartenenti alla playlist scelta dall'utente */
function stampaBraniPlaylist(){

    //se la playlist selezionata non contiene nessun brano stampa a video che la playlist è vuota e dà la possibilità di cancellarla
    if(listaBrani.length==0){
        $("#contenitore-canzoni-playlist").empty();
        for(i=0; i<listaPlaylist.length; i++){
            if(listaPlaylist[i].idPlaylist==idPlaylist){
                $("#contenitore-canzoni-playlist").append('<p class="paragrafo-playlist" style="font-size: calc(1rem + 1vw)">' +
                    'La playlist "'+ listaPlaylist[i].nome +'" è vuota. ' +
                    '<i class="fa fa-trash icona-eliminaPlaylist" title="Elimina playlist"' +
                    'id="elimPlay'+ listaPlaylist[i].idPlaylist +'" data-toggle="modal" data-target="#modal-conferma-rimPlaylist"></i></p>');
            }
        }
        $(".icona-eliminaPlaylist").click(function(evento) { //intercetta l'evento di click di eliminazione di una playlist
            recuperaIDPlaylist(evento);     //recupera l'id della playlist selezionata
            $("#tastoConfermaRimPlaylist").click(function () {
                eliminaPlaylist();      //al click di conferma rimuove la playlist selezionata
            });
        });
    }

    //se la playlist selezionata non è vuota, stampa tutti i brani ad essa appartenenti e l'icona per cancellarla
    else {
        $("#contenitore-lista-playlist").remove();
        var content = "";
        $("#contenitore-canzoni-playlist").append('<div id="contenitore-lista-playlist">\n' +
            '<ul  class="demo demo-playlist"></ul></div>');
        for (i = 0; i < listaBrani.length; i++) {
            content += '<li class="li_listaPlaylist" id="brano-playlist' + listaBrani[i].idBrano + '">' +
                '<div class="ordine-playlist">' +
                '<p class="p_playList">' + (i + 1) + '</p>' +
                '</div>' +
                '<div class="canzone">' +
                '<p class="p_playList" style="color:cornsilk">' + listaBrani[i].titolo + '</p>' +
                '</div>' +
                '<div class="autore">' +
                '<p class="p_playList">' + listaBrani[i].artista + '</p>' +
                '</div>' +
                '<div class="btn-group-orizontal-justified btn-playlist" >' +
                '<button type="button" class="btn btn-default btn-canzoni-playlist play" id="play-brano' + listaBrani[i].idBrano + '" title="Riproduci brano">' +
                '<i class="fa fa-caret-square-o-right" style="pointer-events: none;"></i></button>' +
                '<button type="button" class="btn btn-default btn-canzoni-playlist rimuovi" id="rimu-brano' + listaBrani[i].idBrano + '" title="Rimuovi brano">' +
                '<i class="fa fa-close" style="pointer-events:none;"></i></button>' +
                '</div>' +
                '</li>';
            $(".demo-playlist").append(content);
            content = "";
        }
    }
    $(".play").click(function(evento) { //intercetta l'evento di clik riproduci brano
            recuperaIDBrano(evento);        //recupera l'id del brano selezionato
            playListAvviata=true;
            idPlaylistAvviata=idPlaylist;
            riproduciBrano();       //manda in riproduzione il brano selezionato
            if(shuffleB==true){
               percorsi=shuffle(percorsi); //gestisce la riproduzione casuale
            }
        }
    );
    $(".rimuovi").click(function(evento) {    //intercetta l'evento di click rimozione del brano dalla playlist
            recuperaIDBrano(evento);        //recupera l'id del brano selezionato
            rimuoviBrano();         //rimuove il brano selezionato dalla playlist
        }
    );
}


/*Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista dei brani appartenenti all'album
scelto dall'utente*/
function stampaBraniAlbum(){

        $("#contenitore-lista-album").remove();
        var content = "";
        $("#contenitore-canzoni-album").append('<div id="contenitore-lista-Album">' +
            '<ul  class="demo demo-Album"></ul></div>');
    for (i = 0; i < listaBrani.length; i++) {
        content += '<li class="li_listaAlbum">' +
            '<div class="ordine-Album">' +
            '<p class="p_Album">' + (i+1) + '</p>' +
            '</div>' +
            '<div class="canzone-album">' +
            '<p class="p_Album" style="color: cornsilk">'+ listaBrani[i].titolo +'</p>' +
            '</div>' +
            '<div class="autore-album">' +
            '<p class="p_Album">'+ listaBrani[i].artista +'</p>' +
            '</div>' +
            '<div class="btn-group-orizontal-justified btn-album">' +
            '<button type="button" class="btn btn-default btn-canzoni-album riproduci" id="riproduci-'+ listaBrani[i].idBrano +'" title="Riproduci brano">' +
            '<i class="fa fa-caret-square-o-right" style="pointer-events:none;" ></i></button>' +
            '<button type="button" class="btn btn-default btn-canzoni-album aggiungiAPlaylist" data-toggle="modal" data-target="#modal-aggiungi-APlaylist"' +
            ' id="agg_a_play'+ listaBrani[i].idBrano+'" title="Aggiungi ad una playlist">' +
            '<i class="fa fa-plus-circle" style="pointer-events:none;"></i></button>' +
            '</div>' +
            '</li>';
        $(".demo-Album").append(content);
        content = "";
    }

    $(".riproduci").click(function(evento) {    //intercetta l'evento di click riproduzione brano
            recuperaIDBrano(evento);        //recupera l'id del brano selezionato
            riproduciBrano();         //manda in riproduzione il brano selezionato
            if(shuffleB==true){
                percorsi=shuffle(percorsi);     //gestisce la riproduzione casuale
            }
        }
    );
    $(".aggiungiAPlaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta a playlist
            recuperaIDBrano(evento);        //recupera l'id del brano selezionato
            stampaListaPlaylistAggiungi();
        }
    );
}


//Funzione che stampa nel Pannello In Riproduzione i brani, gli album o le playlist in riproduzione
function stampaBraniInRiproduzione() {

    //se non c'è nessun brano in riproduzione stampa il messaggio a video
    if(percorsi == null){
        $("#contenitore-listaBrani-produzione").empty();
                $("#contenitore-listaBrani-produzione").append('<p class="messaggio-riproduzione">' +
                    'Nessun brano in riproduzione. </p>');
        }

    //se invece ci sono dei brani in riproduzione, li stampa nell'apposita lista
    else {
    $("#contenitore-listaBrani-produzione").empty(); //svuota la lista contenente i brani in riproduzione
    var content = "";
    $("#contenitore-listaBrani-produzione").append('<ul class="demo listaRiproduzione">');
    for (i = 0; i < listaOrigine.length; i++) {
        content += '<li class="InRiproduzione">\n' +
                        '<div class="datiCanzoni nomeCanzone_prod">'+ listaOrigine[i].titolo +'</div>\n' +
                            '<div class="datiCanzoni nomeArtista_prod">'+ listaOrigine[i].artista + '</div>\n' +
                            '<div class="datiCanzoni nomeStato_prod">'+ toMinutes(listaOrigine[i].durata) +'</div>\n' +
                            '<div class="datiCanzoni container-icona-play"><i class="fa fa-play icona-play-prod" ' +
                            'id="brano-ripr'+ (i) +'" style="cursor:pointer;" title="Riproduci brano"></i> </div>\n' +
                    '</li>';
        $(".listaRiproduzione").append(content);
        content = "";
    }

    //rileva il brano in riproduzione al caricamento della pagina
    if(seeking==true && shuffleB==true) {
        $('#brano-ripr' +calcolaIndiceShuffleOrigine()).removeClass('fa-play').addClass('fa-pause');
    }else if(seeking==true && shuffleB==false){
        $('#brano-ripr' + indiceCorrente).removeClass('fa-play').addClass('fa-pause');
    }
}

    $(".icona-play-prod").click(function(evento) {//funzione che intercetta l'evento di click di riproduzione del brano dell lista di brani in riproduzione
            recuperaIDBrano(evento);    //recupera l'id del brano selezionato

        //gestisce le icone dei brani in riproduzione
            if(seeking==true && calcolaIndiceShuffleOrigine()==idBrano) {
                $('#brano-ripr' + idBrano).removeClass('fa-pause').addClass('fa-play');
                stoppaBrano();
            }else if( calcolaIndiceShuffleOrigine()!=idBrano){
                $('#brano-ripr' +idBrano).removeClass('fa-play').addClass('fa-pause');
                if(shuffleB==false){
                    indiceCorrente =idBrano;
                }else{
                    indiceCorrente=calcolaIndiceShufflePercorsi();
                }
                $('#brano-ripr' + calcolaIndiceShuffleOrigine()).removeClass('fa-pause').addClass('fa-play');
                streamingBrano(percorsi[indiceCorrente].url_brano);

            }else if (seeking==false && calcolaIndiceShuffleOrigine()==idBrano){
                $('#brano-ripr' + id).removeClass('fa-pause').addClass('fa-play');
                avviaBrano();
            }
            stampaBraniInRiproduzione();
        }
    );
}


/*Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista delle playlist possedute
dall'utente per permettere l'aggiunzione di un brano ad una di esse */
function stampaListaPlaylistAggiungi(){

    //se l'utente non ha ancora nessuna playlist, stampa a video il messaggio
    if(listaPlaylist.length==0){
        $(".tab-agg-brano").empty;
        $(".container-listaPlaylist").empty();
        $(".tab-agg-brano").html("Non hai ancora nessuna playlist.<br>Creane una per aggiungere questo brano.");
    }

    //altimenti stampa nell'apposita lista tutte le playlist dell'utente
    else {
        $(".tab-agg-brano").empty;
        $(".tab-agg-brano").html("Seleziona la playlist alla quale vuoi aggiungere il brano:");
        var content = "";
        $(".container-listaPlaylist").empty();
        $(".container-listaPlaylist").append('<ul class="demo listaPlaylist">');
        for (i = 0; i < listaPlaylist.length; i++) {
            content += '<li class="p_listaPlaylist">' +
                '<div class="nome_playlist">' + listaPlaylist[i].nome + '</div>' +
                '<div class="cont-pulsante-aggiungi-brano"> <i class="fa fa-plus-square pulsante-aggiungi-brano" ' +
                'id="play_num' + listaPlaylist[i].idPlaylist + '" title="Aggiungi a playlist"></i> </div>' +
                '</li>';
            $(".listaPlaylist").append(content);
            content = "";
        }
    }
    $(".pulsante-aggiungi-brano").click(function(evento) {  //funzione che intercetta l'evento di selezione della playlist
            recuperaIDPlaylist(evento);     //recupera l'id della playlist selezionata
            aggiungiBranoAPlaylist();       //aggiunge il brano selezionato alla playlist desiderata
            idPlaystTarget=idPlaylist;
        }
    );
}
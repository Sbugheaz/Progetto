
//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa i dati dell'account nell'apposito form
function stampaDatiAccount(utente) {
    $(".nomeUtente").html("<br>" + utente.nomeUtente);
    $('#nome').attr("value", utente.nome);
    $('#cognome').attr("value", utente.cognome);
    $('#dataNascita').attr("value", utente.dataDiNascita.substring(0, 10));
    $('#email').attr("value", utente.email);
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli amici di un utente
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
    $(".icona-rimuovi-amico").click(function(evento) {
            recuperaIDElimina(evento);
            $("#tastoConfermaRim").click(function () {
                eliminaAmico();
            });
        }
    );
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli utenti
//che non sono tra gli amici e corrispondono ai criteri di ricerca
function stampaAmiciDaAggiungere(lu){
        var content = "";
        $(".container-listaUtenti").append('<ul class="demo listaUtenti">');
        for (i = 0; i < lu.length; i++) {
            listaUtenti[i] = new Account(lu[i]);
            content += '<li class="p_listaUtenti">' +
                '<div class="nomeUtente_da_aggiugere">' + listaUtenti[i].nomeUtente + ' (' + listaUtenti[i].nome + " " + listaUtenti[i].cognome + ') </div>' +
                '<div class="cont-pulsante-aggiungi-utente"> <i class="fa fa-user-plus pulsante-aggiungi-utente" ' +
                'id="aggiungi-amico' + listaUtenti[i].idUtente +'" title="Aggiungi amico"></i> </div>' +
                '</li>';
            $(".listaUtenti").append(content);
            content = "";
        }
        $(".pulsante-aggiungi-utente").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
            recuperaIDAggiungi(evento);
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

//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista dei brani relativi al genere selezionato
function stampaListaBraniPerGenere(listaBrani){
    $(".listaGenere").remove(); //svuota la lista contenente i brani
    var content="";
    $("#contenitore-listaBrani-genere").append('<ul class="demo listaGenere">');
    for(i=0; i<listaBrani.length; i++) {
        content += '<li class="genere">' +
            ' <div class="datiCanzoni nomeCanzone_genere">' + listaBrani[i].titolo + '</div>' +
            ' <div class="datiCanzoni nomeArtista_genere">' + listaBrani[i].artista + '</div>' +
            ' <div class="datiCanzoni imgCover"><img src="' + listaBrani[i].url_cover + '" class="cover"></div>' +
            ' <div class="datiCanzoni container-icona-play-gen"><i class="fa fa-play icona-play-gen"id="icona-play'+
            listaBrani[i].idBrano + '" style="cursor:pointer;"></i> </div> <div class="datiCanzoni container-icona-aggiungi-playlist-gen">' +
            '<i class="fa fa-plus-circle icona-aggiungi-Aplaylist-gen" id="agg-a_play' + listaBrani[i].idBrano + '"' +
            'data-toggle="modal" data-target="#modal-aggiungi-APlaylist" style="cursor:pointer;"></i></div>' +
        ' </li>' ;
        $(".listaGenere").append(content);
        content = "";
    }
    $(".icona-play-gen").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
        recuperaIDBrano(evento);
        playListAvviata=false;
        disabilitaShuffle();
        riproduciBrano();
    }
    );
    $(".icona-aggiungi-Aplaylist-gen").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta a playlist
            recuperaIDBrano(evento);
            stampaListaPlaylistAggiungi();
        }
    );
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista dei brani
//che corrispondono ai criteri di ricerca
function stampalistaBraniRicerca(lb){
    var content = "";
    $("#contenitore-lista-ricerca-brani").append('<ul class="demo listaRicerca" style="color:cornsilk;">');
    for (i = 0; i < lb.length; i++) {
        listaBrani[i] = new Brano(lb[i]);
        content += '<li class="li-lista-brani">' +
            '<div class="datiCanzoni contenitore-imgBrano"> ' +
            '<img src="' + listaBrani[i].url_cover + '" class="coverBrano">' +
            '<div class="contenitore-icona-hover" id="coverBrano'+ listaBrani[i].idBrano+ '" title="Riproduci brano">' +
            '<i class="fa fa-play play-brano"></i></div></div>'+
            '<div class="datiCanzoni contenitore-nomeCanzone-Artista"> "'+ listaBrani[i].titolo + '" - '+ listaBrani[i].artista +'</div>' +
            '<div class="datiCanzoni contenitore-icona-aggiungi-playlist">' +
            '<i class="fa fa-plus-circle icona-aggiungi-Aplaylist" data-toggle="modal" data-target="#modal-aggiungi-APlaylist"' +
            'id="agg-a-play'+ listaBrani[i].idBrano +'" title="Aggiungi ad una playlist"></i> </div>'+
        '</li>';
        $(".listaRicerca").append(content);
        content = "";
    }
    $(".contenitore-icona-hover").click(function (evento) {
        recuperaIDBrano(evento);
        abilitaPlayer();
        playListAvviata=false;
        riproduciBranoSingolo();

        }
    );

    $(".icona-aggiungi-Aplaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta a playlist
           recuperaIDBrano(evento);
           stampaListaPlaylistAggiungi();
        }
    );
}

//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli
//album che corrispondono ai criteri di ricerca
function stampalistaAlbumRicerca(la){
    var content = "";
    for (i = 0; i < la.length; i++) {
        listaAlbum[i] = new Album(la[i]);
        content += '<div class="flex-item-Album"><img src="' + listaAlbum[i].url_cover + '" class="flex-item-img">' +
            '<div class="contenitore-nomeAlbum">\n' +
            '<p class="nomeAlbum nomeAlbumRicerca">"' + listaAlbum[i].nome+ '" <br>'  + listaAlbum[i].artista +'<br>'+ listaAlbum[i].numeroBrani + ' brani </p></div></div>';
        $("#contenitore-lista-ricerca-album").append(content);
        content = "";
    }
    $(".icona-aggiungi-Aplaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
            // recuperaIDAggiungi(evento);
        }
    );
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa tutte le playlist di un utente
function stampaListaPlaylist(listaPlaylist){
    $("#contenitore-playlist").empty();
    $("#contenitore-playlist").append('<div class="flex-item container-addPlaylist" data-toggle="modal" data-target="#modal-crea-playlist">\n' +
                                            '<div class="flex-item-conteiner">\n' +
                                                '<div class="flex-item-conteiner-icon">\n' +
                                                    '<a class="icona-aggiungi-playlist"><i class="fa fa-plus"></i></a>\n' +
                                                '</div>\n' +
                                                '<div class="contenitore-nomePlaylist"><p class="nomePlaylist">Crea playlist</p></div>\n' +
                                            '</div>\n' +
                                        '</div>');
    var content="";
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
    $(".container-playlist").click(function(evento) {
            recuperaIDPlaylist(evento);
            richiediBraniPlaylist();
            cambiaDimensioniConteinerPlaylist();
        }
    );
}

//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa tutti gli album nell'apposita lista
function stampaListaAlbum(listaAlbum){
    $(".flex-container-Album").empty();
    //Stampo il flex-item-container contenente tutti i singoli
    $(".flex-container-Album").append('<div class="flex-item-Album"><img src="images/cover/default-album.png" class="flex-item-img" id="singoli">' +
                                        '<div class="contenitore-nomeAlbum"><p class="nomeAlbum">Singoli</p></div></div>');
    $("#singoli").click(function(evento) {
            richiediBraniSingoli();
        }
    );

    var content="";
    for(i=0; i<listaAlbum.length; i++) {
        content += '<div class="flex-item-Album">' +
            '<img src="'+ listaAlbum[i].url_cover +'" class="flex-item-img coverAlbum" id="album_n'+ listaAlbum[i].idAlbum +'">' +
            '<div class="contenitore-nomeAlbum"><p class="nomeAlbum">'+ listaAlbum[i].nome +'</p></div></div>' ;
        $(".flex-container-Album").append(content);
        content = "";
    }
    $(".coverAlbum").click(function(evento) {
            recuperaIDAlbum(evento);
            cambiaDimensioniConteinerAlbum();
            richiediBraniAlbum();

        }
    );
}

//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista dei brani
//appartenenti alla playlist scelta dall'utente
function stampaBraniPlaylist(){
    if(listaBrani.length==0){
        $("#contenitore-canzoni-playlist").empty();
        for(i=0; i<listaPlaylist.length; i++){
            if(listaPlaylist[i].idPlaylist==idPlaylist){
                $("#contenitore-canzoni-playlist").append('<p class="paragrafo-playlist" style="font-size: calc(1rem + 1vw)">' +
                    'La playlist "'+ listaPlaylist[i].nome +'" è vuota. ' +
                    '<i class="fa fa-trash icona-eliminaPlaylist" ' +
                    'id="elimPlay'+ listaPlaylist[i].idPlaylist +'" data-toggle="modal" data-target="#modal-conferma-rimPlaylist"></i></p>');
            }
        }
        $(".icona-eliminaPlaylist").click(function(evento) {
            recuperaIDPlaylist(evento);
            $("#tastoConfermaRimPlaylist").click(function () {
                eliminaPlaylist();
            });
        });
    }
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
                '<button type="button" class="btn btn-default btn-canzoni-playlist play" id="play-brano' + listaBrani[i].idBrano + '">' +
                '<i class="fa fa-caret-square-o-right" style="pointer-events: none;"></i></button>' +
                '<button type="button" class="btn btn-default btn-canzoni-playlist rimuovi" id="rimu-brano' + listaBrani[i].idBrano + '">' +
                '<i class="fa fa-close" style="pointer-events:none;"></i></button>' +
                '</div>' +
                '</li>';
            $(".demo-playlist").append(content);
            content = "";
        }
    }
    $(".play").click(function(evento) {
            recuperaIDBrano(evento);
            playListAvviata=true;
            riproduciBrano();


        }
    );
    $(".rimuovi").click(function(evento) {
            recuperaIDBrano(evento);
            rimuoviBrano();
        }
    );
    //$(".icona-aggiungi-Aplaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta playlist
            // recuperaIDAggiungi(evento);
        //}
    //);
}


//Funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista dei brani
//appartenenti all'album scelto dall'utente
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
            '<button type="button" class="btn btn-default btn-canzoni-album riproduci" id="riproduci-'+ listaBrani[i].idBrano +'">' +
            '<i class="fa fa-caret-square-o-right" style="pointer-events:none;"></i></button>' +
            '<button type="button" class="btn btn-default btn-canzoni-album aggiungiAPlaylist" data-toggle="modal" data-target="#modal-aggiungi-APlaylist"' +
            ' id="agg_a_play'+ listaBrani[i].idBrano+'">' +
            '<i class="fa fa-plus-circle" style="pointer-events:none;"></i></button>' +
            '</div>' +
            '</li>';
        $(".demo-Album").append(content);
        content = "";
    }

    $(".riproduci").click(function(evento) {
            recuperaIDBrano(evento);
            riproduciBrano();

        }
    );
    $(".aggiungiAPlaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta a playlist
            recuperaIDBrano(evento);
            stampaListaPlaylistAggiungi();
        }
    );
}

//Funzione che stampa nel Pannello In Riproduzione i brani, gli album o le playlist in riproduzione
function stampaBraniInRiproduzione() {
    if(percorsi == null){
        $("#contenitore-listaBrani-produzione").empty();
                $("#contenitore-listaBrani-produzione").append('<p class="messaggio-riproduzione">' +
                    'Nessun brano in riproduzione. </p>');
        }

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
                            'id="brano-ripr'+ (i) +'" style="cursor:pointer;"></i> </div>\n' +
                    '</li>';
        $(".listaRiproduzione").append(content);
        content = "";
    }
    if(seeking==true && shuffleB==true) {
        $('#brano-ripr' +idBrano).removeClass('fa-play').addClass('fa-pause');
    }else{
        $('#brano-ripr' + indiceCorrente).removeClass('fa-play').addClass('fa-pause');
    }
}

    $(".icona-play-prod").click(function(evento) {//funzione che intercetta l'evento di click di riproduzione del brano dell lista di brani in riproduzione
            recuperaIDBrano(evento);
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

function stampaListaPlaylistAggiungi(){
    var content = "";
    $(".container-listaPlaylist").empty();
    $(".container-listaPlaylist").append('<ul class="demo listaPlaylist">');
    for (i = 0; i < listaPlaylist.length; i++) {
        content += '<li class="p_listaPlaylist">' +
            '<div class="nome_playlist">' + listaPlaylist[i].nome + '</div>' +
            '<div class="cont-pulsante-aggiungi-brano"> <i class="fa fa-plus-square pulsante-aggiungi-brano" ' +
            'id="play_num' + listaPlaylist[i].idPlaylist +'" title="Aggiungi a playlist"></i> </div>' +
            '</li>';
        $(".listaPlaylist").append(content);
        content = "";
    }
    $(".pulsante-aggiungi-brano").click(function(evento) {  //funzione che intercetta l'evento di selezione della playlist
            recuperaIDPlaylist(evento);
            aggiungiBranoAPlaylist();
        }
    );
}
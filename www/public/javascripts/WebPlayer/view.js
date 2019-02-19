
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
            ' <div class="datiCanzoni container-icona-play-gen"><i class="fa fa-play icona-play-gen"id="icona-play'+ listaBrani[i].idBrano + '"></i> </div>' +
        ' <div class="datiCanzoni container-icona-aggiungi-playlist-gen"><i class="fa fa-plus-circle icona-aggiungi-Aplaylist-gen"></i></div>' +
        ' </li>' ;
        $(".listaGenere").append(content);
        content = "";
    }
    $(".icona-play-gen").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
        recuperaIDBrano(evento);
        riproduciBrano();
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
            '<div class="datiCanzoni contenitore-imgBrano">  ' +
            '<img src="' + listaBrani[i].url_cover + '" class="coverBrano" >' +
            '<div class="contenitore-icona-hover" id="coverBrano'+ listaBrani[i].idBrano+ '"><i class="fa fa-play play-brano"></i></div></div>'+
            '<div class="datiCanzoni contenitore-nomeCanzone-Artista">'+ listaBrani[i].titolo + ' - '+ listaBrani[i].artista +'</div>' +
            '<div class="datiCanzoni contenitore-icona-aggiungi-playlist"><i class="fa fa-plus-circle icona-aggiungi-Aplaylist"></i> </div>'+
        '</li>';
        $(".listaRicerca").append(content);
        content = "";
    }
    $(".contenitore-icona-hover").click(function (evento) {
        recuperaIDBrano(evento);
        abilitaPlayer();
        riproduciBranoSingolo();

        }
    );

    $(".icona-aggiungi-Aplaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
           // recuperaIDAggiungi(evento);
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
            riproduciBrano();

        }
    );
    $(".rimuovi").click(function(evento) {
            recuperaIDBrano(evento);
            rimuoviBrano();
        }
    );
    //$(".icona-aggiungi-Aplaylist").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
            // recuperaIDAggiungi(evento);
        //}
    //);
}



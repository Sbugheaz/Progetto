


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
            eliminaAmico();
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
            '<i class="fa fa-music icona-musica"></i> " '+ listaAmiciOnline[i].ascolta + ' " </p> </li>' ;
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
            '<div class="branoAscoltato"> <p class="sta-ascoltando"><i class="fa fa-music icona-musica"></i> " \'+ listaAmiciOnline[i].ascolta + \' " </p>' +
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
            ' <div class="datiCanzoni container-icona-play-gen"><i class="fa fa-play icona-play-gen"id="'+ listaBrani[i].url_brano + '"></i> </div>' +
        ' <div class="datiCanzoni container-icona-aggiungi-playlist-gen"><i class="fa fa-plus-circle icona-aggiungi-Aplaylist-gen"></i></div>' +
        ' </li>' ;
        $(".listaGenere").append(content);
        content = "";
    }
    $(".icona-play-gen").click(function(evento) {  //funzione che intercetta l'evento di click aggiunta amico
        recuperaUrlBrano(evento);
        inizializzaPlayer(evento);
        //riproduciBrano();
    }
    );
}

//Funzione che inizializza i parametri del player
function inizializzaPlayer(evento){
    var url=evento.target.id;
    for(i=0;i<listaBrani.length;i++){
        if(listaBrani[i].url_brano==url){
            var dur=toMinutes(listaBrani[i].durata);
            $("#labelDurataTotaleBrano").text(dur);
            $("#titolo-brano-in-riproduzione").text(listaBrani[i].titolo);
            $("#album2").attr("src",listaBrani[i].url_cover);
        }
    }
   
    audioElement.load();
    audioElement.play();

}
//funzione che converte i secondi in formato mm:ss
function toMinutes(secondi) {
    var minutes = "0" + Math.floor(secondi/ 60);
    var seconds = "0" + Math.floor(secondi % 60);
    var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
     return dur;
}


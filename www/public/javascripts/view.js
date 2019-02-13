
//funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli amici di un utente
function stampaListaAmici(la){
    $(".listaUtenti").remove();
    var content="";
    $("#contenitore-lista-amici").append('<ul class="demo listaAmici" style="color:cornsilk;">');
    for(i=0; i<la.length; i++) {
        listaAmici[i] = new Account(la[i]);
        content += '<li class="amico" id="amico' + listaAmici[i].idUtente + '">' +
            '<div class="datiAmico nomeAmico">' + listaAmici[i].nome + '</div>' +
            '<div class="datiAmico cognomeAmico">' + listaAmici[i].cognome + '</div>' +
            '<div class="datiAmico nomeUtenteAmico">' + listaAmici[i].nomeUtente + '</div>' +
            '<div class="datiAmico container-icona-rimuovi-amico">' +
            '<i class="fa fa-user-times icona-rimuovi-amico" id="rimuovi-amico' + listaAmici[i].idUtente +'"'+
            'data-toggle="modal" data-target="#modal-conferma-rimAmico"></i> </div>' +
            '</li>' ;
        $(".listaAmici").append(content);

        content = "";
    }
    $(".icona-rimuovi-amico").click(function(evento) {
            recuperaID(evento);
        }
    );
}


//funzione che viene invocata una volta ricevuti i dati dal server e che stampa la lista degli utenti
// aggiungibili che corrispondono ai criteri di ricerca
function stampaAmiciDaAggiungere(lu){
        var content = "";
        $(".container-listaUtenti").append('<ul class="demo listaUtenti">');
        for (i = 0; i < lu.length; i++) {
            listaUtenti[i] = new Account(lu[i]);
            content += '<li class="p_listaUtenti">' +
                '<div class="nomeUtente_da_aggiugere">' + listaUtenti[i].nomeUtente + ' (' + listaUtenti[i].nome + " " + listaUtenti[i].cognome + ') </div>' +
                '<div class="cont-pulsante-aggiungi-utente"> <i class="fa fa-user-plus pulsante-aggiungi-utente"></i> </div>' +
                '</li>';
            $(".listaUtenti").append(content);
            content = "";
    }
}






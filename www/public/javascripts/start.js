//dichiarazione degli oggetti
var utente, listaAmici = [];

//funzione eseguita al caricamento della pagina
$(document).ready(function () {

    //funzione che inizializza i dati dell'account estrapolandoli dall'oggetto JSON ricevuto dal server e li stampa nel form
    $.get('/WebPlayer/utente', function(result){
        utente = new Account(JSON.parse(result)[0]);
        $(".nomeUtente").html("<br>" + utente.nomeUtente);
        $('#nome').attr("value",utente.nome);
        $('#cognome').attr("value",utente.cognome);
        $('#dataNascita').attr("value", utente.dataDiNascita.substring(0,10));
        $('#email').attr("value",utente.email);
    });

    //funzione che riceve dal database i dati relativi agli amici di un utente e li stampa nell'apposita lista
    $.get('/WebPlayer/amici', function(result){
        var la = JSON.parse(result);
        var content="";
        $(".contenitore-lista-amici").append('<ul class="demo listaAmici" style="color:cornsilk;">');
        for(i=0; i<la.length; i++) {
            listaAmici[i] = new Account(la[i]);
            content += '<li class="amico">' +
                '<div class="datiAmico nomeAmico">' + listaAmici[i].nome + '</div>' +
                '<div class="datiAmico cognomeAmico">' + listaAmici[i].cognome + '</div>' +
                '<div class="datiAmico nomeUtenteAmico">' + listaAmici[i].nomeUtente + '</div>' +
                '<div class="datiAmico container-icona-rimuovi-amico">' +
                '<i class="fa fa-user-times icona-rimuovi-amico" id="rimuovi-amico' + listaAmici[i].idUtente +'"></i> </div>' +
                '</li>' ;
            $(".listaAmici").append(content);
            content = "";

        }



        /*
        $(".nomeAmico").html(listaAmici[0].nome);
        $(".cognomeAmico").html(listaAmici[0].cognome);
        $(".nomeUtenteAmico").html(listaAmici[0].nomeUtente);
        */
    });

});


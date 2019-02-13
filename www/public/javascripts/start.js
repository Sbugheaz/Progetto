//dichiarazione degli oggetti
var utente, listaAmici = [], listaUtenti = [];

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
    });
    //Funzione che riceve dal database i nomi degli utenti che corrispondono ai criteri di ricerca
    $("#inserisci-nomeUtente").on("keyup", function(){
        $.post("/WebPlayer/amici/cercaUtenti",
            {
                nomeUtente: $('input[name=nome-utente]').val(),
            },
            function (result) {
                var lu = JSON.parse(result);
                $(".listaUtenti").remove();
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
            });
    });
});
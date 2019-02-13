//Dichiarazione degli oggetti
var utente, listaAmici = [], listaUtenti = [];

//Funzione eseguita al caricamento della pagina
$(document).ready(function () {

    //Funzione che inizializza i dati dell'account estrapolandoli dall'oggetto JSON ricevuto dal server e li stampa nel form
    $.get('/WebPlayer/utente', function(result){
        utente = new Account(JSON.parse(result)[0]);
        $(".nomeUtente").html("<br>" + utente.nomeUtente);
        $('#nome').attr("value",utente.nome);
        $('#cognome').attr("value",utente.cognome);
        $('#dataNascita').attr("value", utente.dataDiNascita.substring(0,10));
        $('#email').attr("value",utente.email);
    });

    //Funzione che riceve dal database i dati relativi agli amici di un utente e invoca la funzione stampaListaAmici() per stamparli nell'apposita lista
    $.get('/WebPlayer/amici', function(result){
        var la = JSON.parse(result);
        stampaListaAmici(la);
    });


    //Funzione che riceve dal database i nomi degli utenti che corrispondono ai criteri di ricerca e invoca la
    // funzione stampaAmiciDaAggiungere() per stamparli nell'apposita lista
    var timer = 500; //Intervallo di tempo tra l'inserimento di due caratteri da tastiera (per evitare il flooding di richieste al database)
    $("#inserisci-nomeUtente").on("keyup", function(){
        clearTimeout(timer);
        timer = setTimeout(function() {
            $.post("/WebPlayer/amici/cercaUtenti",
                {
                    utenteCercato: $('input[name=nome-utente]').val(),
                },
                function (result) {
                    var lu = JSON.parse(result);
                    stampaAmiciDaAggiungere(lu,result);
                });
        }, 500);
    });


});
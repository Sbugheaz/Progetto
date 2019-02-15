//Dichiarazione degli oggetti
var utente, listaAmici = [], listaUtenti = [], listaAmiciOnline = [];

//Funzione eseguita al caricamento della pagina
$(document).ready(function () {
    richiediDatiAccount(); //Funzione che ottiene i dati dell'utente che ha effettuato l'accesso
    richiediListaAmici(); //Funzione che ottiene la lista amici dell'utente che ha effettuato l'accesso
    ricercaUtenti(); //Funzione che permette la ricerca degli utenti per l'amicizia
    richiediAmiciOnline(); //Funzione che ottiene la lista degli amici online dell'utente che ha effettuato l'accesso
    setInterval(richiediAmiciOnline,30000); //Funzione che aggiorna la lista degli amici online ogni 30 secondi
});

//Funzione che inizializza i dati dell'account estrapolandoli dall'oggetto JSON ricevuto dal server e li stampa nel form
function richiediDatiAccount() {
    $.get('/WebPlayer/utente', function (result) {
        if (result != "ERR") {
            utente = new Account(JSON.parse(result)[0]);
            $(".nomeUtente").html("<br>" + utente.nomeUtente);
            $('#nome').attr("value", utente.nome);
            $('#cognome').attr("value", utente.cognome);
            $('#dataNascita').attr("value", utente.dataDiNascita.substring(0, 10));
            $('#email').attr("value", utente.email);
        }
    });
}

//Funzione che riceve dal database i dati relativi agli amici di un utente e invoca la funzione stampaListaAmici() per stamparli nell'apposita lista
function richiediListaAmici() {
    $.get('/WebPlayer/amici', function (result) {
        if (result != "ERR") {
            var la = JSON.parse(result);
            for (i = 0; i < la.length; i++) //Aggiungiamo gli amici dell'utente che ha loggato nel vettore che contiene tutti i suoi amici
                listaAmici[i] = new Account(la[i]);
            stampaListaAmici(listaAmici);
        }
    });
}

//Funzione che riceve dal database i nomi degli utenti che corrispondono ai criteri di ricerca e invoca la
// funzione stampaAmiciDaAggiungere() per stamparli nell'apposita lista
function ricercaUtenti() {
    var timer = 500; //Intervallo di tempo tra l'inserimento di due caratteri da tastiera (per evitare il flooding di richieste al database)
    $("#inserisci-nomeUtente").on("keyup", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $.post("/WebPlayer/amici/cercaUtenti",
                {
                    utenteCercato: $('input[name=nome-utente]').val(),
                },
                function (result) {
                if (result == "ERR") {
                    $(".container-listaUtenti").empty();
                    var messaggio = "Nussun utente corrisponde ai criteri di ricerca";
                    $(".container-listaUtenti").html(messaggio).css({
                        'font-size': '1rem',
                        'padding': '20px 0',
                    });
                } else {
                    $(".container-listaUtenti").css("padding", "0");
                    $(".container-listaUtenti").empty();
                    var lu = JSON.parse(result);
                    stampaAmiciDaAggiungere(lu);
                }
            });
            }, 500);
    });
}

//Funzione che riceve dal database i dati degli amici attualmente online ogni 30 secondi e invoca la funzione
//stampaAmiciOnline() per stamparli nell'apposita lista
function richiediAmiciOnline(){
    $.get('/WebPlayer/amiciOnline', function(result){
        if(result != "ERR") {
            listaAmiciOnline.remove(0, listaAmiciOnline.length-1)
            var lo = JSON.parse(result);
            for(i=0; i<lo.length; i++) //Aggiungiamo gli amici online dell'utente che ha loggato nel vettore apposito
                listaAmiciOnline[i] = new Account(lo[i]);
            stampaAmiciOnline(listaAmiciOnline);
        }
        else {
            if(listaAmiciOnline.length != 0) listaAmiciOnline.remove(0, listaAmiciOnline.length-1);
            $(".listaAmiciOnline").remove();
            $(".demo-mobile").remove();
        }
    });
}

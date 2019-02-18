//Dichiarazione degli oggetti
var utente, listaPlaylist = [], listaAmici= [], listaUtenti= [], listaAmiciOnline= [], listaBrani= [], listaAlbum=[];

//Funzione eseguita al caricamento della pagina
$(document).ready(function () {
    richiediDatiAccount(); //Funzione che ottiene i dati dell'utente che ha effettuato l'accesso
    richiediPlaylist(); //Funzione che ottiene i dati delle playlist dell'utente che ha effettuato l'accesso
    richiediListaAmici(); //Funzione che ottiene la lista amici dell'utente che ha effettuato l'accesso
    ricercaUtenti(); //Funzione che permette la ricerca degli utenti per l'amicizia
    richiediAmiciOnline(); //Funzione che ottiene la lista degli amici online dell'utente che ha effettuato l'accesso
    setInterval(richiediAmiciOnline,30000); //Funzione che aggiorna la lista degli amici online ogni 30 secondi
    richiediBraniPerGenere(); //Funzione per ottenere tutti i brani di un determinato genere
    ricercaBrani(); //Funzione che permette la ricerca dei brani
    ricercaAlbum(); //Funzione che permette la ricerca degli album


    //Eventi che riguardano il player e tutte le sue funzionalità
    $('#play').click(avviaBrano); //Evento che invoca la funzione per riprodurre il brano
    $('#pause').click(stoppaBrano); //Evento che invoca la funzione per mettere in pausa il brano
    audioElement.addEventListener("ended", verificaBranoSuccessivo);//Listener che viene invocato quando una canzone finisce
    $(audioElement).on("timeupdate", refresh);//Evento che permette di aggiornare la barra di avanzamento
    $('#step-forward').click(branoSuccessivo);//Evento che permette di passare al brano successivo
    $('#step-backward').click(branoPrecedente);//Evento che permette di passare al brano precedente
    $('#random').click(shuffleBrani);//Evento che permette fare lo shuffle delle canzoni
    $('#repeat').click(ripetizione);//Evento che permette la ripetizione delle canzoni
    //Evento che permette lo slide della barra del volume*/
    $("#volume-range").on("slide", function (slideEvt) { //Evento che permette lo slide della barra di avanzamento
        audioElement.volume = slideEvt.value / 100;
    });
    $("#barraDiAvanzamento").on("change", function (slideEvt) {
        var slideVal = $("#barraDiAvanzamento").slider('getValue');
        var valoreattuale2 = ($("#barraDiAvanzamento").slider('getValue') * (audioElement.duration)) / 100;
        audioElement.currentTime = valoreattuale2;
    });
    $(window).on('load',loadPagina);//Evento che carica le informazioni della pagina
    $(window).resize(setDivVisibility);//Evento che permmette di cambiare le propietà della pagina in base alla dimensioni della pagina
    $("#pulsante-Logout").mouseleave(nascondiTastologout);//Evento che permette di far scomparire il pulsante logout
    $("#pulsante-Logout").mouseenter(mostraTastoLogout);//Evento che permette di far comparire il pulsante logout
    $("#barra-ricerca").on('input',mostraPannelloRicerca);//Evento che permette di far comparire il pannello di ricerca
    $(".pulsanteA-brani,.btn-mobile-brani").click(mostraPannelloBrani);//Evento che permette di far comparire il pannello dei brani in riproduzione
    $(".pulsanteGestioneAmicizie,#gest-amicizie").click(mostraPannelloAmicizie);//Evento che permette di far comparire il pannello amicizie
    $(".pulsanteA-album,.btn-mobile-album").click(mostraPannelloAlbum);//Evento che permette di far comparire il pannello album
    $("#amici-online").click(mostraPannelloAmicizieMobile);//Evento che permette di far comparire il pannello delle amicizie lato mobile
    $("#altro").click(mostraPannelloMobile);//Evento che permette di far comparire una tendina lateralmente a destra lato mobile
    $(".pulsanteA-playlist,.btn-mobile-playlist").click(mostraPannelloPlaylist);//Evento che permette di far comparire il pannello playlist
    $("#tasto-Pop,#tasto-Classico,#tasto-Rock,#tasto-Pop-mobile,#tasto-mobile-Pop,#tasto-mobile-Rock,#tasto-mobile-Classico").click(mostraPannelloGenere);//Evento che permette di far comparire il pannello del genere selezionato

});

//Funzione che inizializza i dati dell'account estrapolandoli dall'oggetto JSON ricevuto dal server
// e invoca la funzione stampa  stampaDatiAccount per inserirli nell'apposito form
function richiediDatiAccount() {
    $.get('/WebPlayer/utente', function (result) {
        if (result != "ERR") {
            utente = new Account(JSON.parse(result)[0]);
            stampaDatiAccount(utente);
        }
    });
}

//Funzione che riceve i dati delle playlist dell'utente e invoca la funzione stampaPlaylist per stamparli nell'apposita lista
function richiediPlaylist() {
    $.get('/WebPlayer/playlist', function (result) {
        if (result != "ERR") {
            var lp = JSON.parse(result);
            for (i = 0; i < lp.length; i++) //Aggiungiamo le playlist dell'utente che ha loggato nel vettore che contiene tutte le playlist
                listaPlaylist[i] = new Playlist(lp[i]);
                stampaListaPlaylist(listaPlaylist);
        }
        else {
            //L'utente non ha ancora creato alcuna playlist
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
    var timer = 700; //Intervallo di tempo tra l'inserimento di due caratteri da tastiera (per evitare il flooding di richieste al database)
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
            }, 700);
    });
}

//Funzione che riceve dal database i dati degli amici attualmente online ogni 30 secondi e invoca la funzione
//stampaAmiciOnline() per stamparli nell'apposita lista
function richiediAmiciOnline(){
    $.get('/WebPlayer/amiciOnline', function(result){
        if(result != "ERR") {
            listaAmiciOnline.remove(0, listaAmiciOnline.length-1);
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

//Funzione che permette di ricercare i brani
function ricercaBrani() {
    var timer = 700; //Intervallo di tempo tra l'inserimento di due caratteri da tastiera (per evitare il flooding di richieste al database)
    $("#barra-ricerca").on("keyup", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $.post("/WebPlayer/musica/cercaBrani",
                {
                    braniCercati: $('#barra-ricerca').val(),
                },
                function (result) {
                    if (result == "ERR") {
                        $("#contenitore-lista-ricerca-brani").empty();
                        var messaggio = '<p class="messaggio"> Nessun brano corrisponde ai criteri di ricerca </p>';
                        $("#contenitore-lista-ricerca-brani").append(messaggio);
                    } else {
                        $("#contenitore-lista-ricerca-brani").css("padding", "0");
                        $("#contenitore-lista-ricerca-brani").empty();
                        var lb = JSON.parse(result);
                        stampalistaBraniRicerca(lb);
                    }
                });
        }, 700);
    });
}

//Funzione che permette di ricercare i brani
function ricercaAlbum() {
    var timer = 700; //Intervallo di tempo tra l'inserimento di due caratteri da tastiera (per evitare il flooding di richieste al database)
    $("#barra-ricerca").on("keyup", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $.post("/WebPlayer/musica/cercaAlbum",
                {
                    albumCercati: $('#barra-ricerca').val(),
                },
                function (result) {
                    if (result == "ERR") {
                        $("#contenitore-lista-ricerca-album").empty();
                        var messaggio = '<p class="messaggio"> Nessun album corrisponde ai criteri di ricerca </p>';
                        $("#contenitore-lista-ricerca-album").append(messaggio);
                        $("#contenitore-lista-ricerca-album").css({
                            'font-size': '1rem',
                            'padding': '20px 0',
                            'color': 'cornsilk',
                        });
                    } else {
                        $("#contenitore-lista-ricerca-album").css("padding", "0");
                        $("#contenitore-lista-ricerca-album").empty();
                        var la = JSON.parse(result);
                        stampalistaAlbumRicerca(la);
                    }
                });
        }, 700);
    });
}
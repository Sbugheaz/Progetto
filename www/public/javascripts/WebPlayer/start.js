/**
 * Questo file js contiene tutti gli oggetti e i vettori utilizzati dalla pagina del web player che contengono i dati
 * dell'utente, dei brani, degli album, delle playlsit, ecc. Inoltre contiene tutte le chiamate alle funzioni che devono
 * essere eseguite al caricamento della pagina del web player.
 */

//Dichiarazione degli oggetti o vettori di oggetti usati
var utente; //Oggetto che contiene tutti i dati dell'account utente che ha eseguito l'accesso
var listaPlaylist = []; //Vettore di oggetti playlist che contiene tutte le playlist dell'utente loggato
var listaAmici = []; //Vettore di oggetti account che contiene i dati principali degli utenti presenti nella lista amici dell'utente loggato
var listaUtenti = []; //Vettore di oggetti account che contiene i dati principali degli utenti che soddisfano i criteri di ricerca
var listaAmiciOnline = []; //Vettore di oggetti account che contiene i dati principali degli amici attualmente online
var listaBrani = []; //Vettore di oggetti brano che contiene tutti i brani restituiti dal server
var listaAlbum = []; //Vettore di oggetti album che contiene tutti gli album restituiti dal server

/*Funzione che contiene tutte le chiamate alle funzioni e le catture degli eventi che devono essere eseguiti al
  caricamento della pagina*/
$(document).ready(function () {
    richiediDatiAccount(); //Funzione che ottiene i dati dell'utente che ha effettuato l'accesso
    richiediPlaylist(); //Funzione che ottiene i dati delle playlist dell'utente che ha effettuato l'accesso
    richiediAlbum();//Funzione che ottiene i dati di tutti gli album
    richiediListaAmici(); //Funzione che ottiene la lista amici dell'utente che ha effettuato l'accesso
    ricercaUtenti(); //Funzione che permette la ricerca degli utenti per l'amicizia
    richiediAmiciOnline(); //Funzione che ottiene la lista degli amici online dell'utente che ha effettuato l'accesso
    setInterval(richiediAmiciOnline,30000); //Funzione che aggiorna la lista degli amici online ogni 30 secondi
    richiediBraniPerGenere(); //Funzione per ottenere tutti i brani di un determinato genere
    ricercaBrani(); //Funzione che permette la ricerca dei brani
    ricercaAlbum(); //Funzione che permette la ricerca degli album


    //Eventi che riguardano i pannelli della pagina
    loadPagina();//Evento che carica le informazioni della pagina
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
    $("#tasto-Pop,#tasto-Country,#tasto-Funky,#tasto-Jazz,#tasto-Rock,#tasto-mobile-Pop,#tasto-mobile-Rock,#tasto-mobile-Country," +
        "#tasto-mobile-Funky,#tasto-mobile-Jazz, #tasto-Rap, #tasto-mobile-Rap").click(mostraPannelloGenere);/* Evento che permette
        di far comparire il pannello del genere selezionato*/


    //Eventi che riguardano il player e tutte le sue funzionalità
    $('#random').click(shuffleBrani);//Evento che permette fare lo shuffle delle canzoni
    $('#repeat').click(ripetizione);//Evento che permette la ripetizione delle canzoni
    audioElement.addEventListener("ended", verificaBranoSuccessivo);//Listener che viene invocato quando una canzone finisce
    $(audioElement).on("timeupdate", refresh);//Evento che permette di aggiornare la barra di avanzamento
    audioElement.addEventListener("canplay",aggiornaPlayer);
    $('#step-forward').click(branoSuccessivo);//Evento che permette di passare al brano successivo
    $('#step-backward').click(branoPrecedente);//Evento che permette di passare al brano precedente
    //Evento che permette lo slide della barra del volume*/
    $("#volume-range").on("slide", function (slideEvt) { //Evento che permette lo slide della barra di avanzamento
        audioElement.volume = slideEvt.value / 100;
    });
    //Evento che permette lo slide della barra di avanzamento della canzone in riproduzione
    $("#barraDiAvanzamento").on("change", function (slideEvt) {
        var slideVal = $("#barraDiAvanzamento").slider('getValue');
        var valoreattuale2 = ($("#barraDiAvanzamento").slider('getValue') * (audioElement.duration)) / 100;
        audioElement.currentTime = valoreattuale2;
    });


    //Eventi che riguardano i modal e gestiscono lo svuotamento dei campi, dei messaggi di errore e altro

    //Evento che mostra il footer del modal profilo quando un campo viene modificato
    $(".campi").on('input',function() {
        $(".modal-footer").show("display");
    });
    //Evento che mostra il div contenente gli utenti da aggiungere che corrispondono ai dati inseriti nel form
    $(".campoNomeUtente").on('input',function(){
        $(".container-listaUtenti").show();
    });
    //Eventi per la gestione della sovrapposizione dei modal
    $('#openBtn').click(function () {
        $('#myModal').modal({
            show: true
        })
    });
    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    /*Evento che cambia il colore del bordo inferiore e nasconde il paragrafo di errore quando viene modificato un campo
     all'interno del modal per la modifica dei dati dell'account in presenza di errore*/
    $(".campi").on('input',function(){
        $(".campi").removeClass("invalid");
        $(".pd").css("display", "none");
    });
    //Evento che resetta tutti i campi e il paragrafo di errore alla chiusura del modal per la modifica dei dati utente
    $('#myModal').on('hidden.bs.modal', function () {
        $(".campi").removeClass("invalid");
        $(this).find('form').trigger('reset');
        $("#err_account").text("").css("display", "none");
        disabilitaScrittura('nome');
        disabilitaScrittura('cognome');
        disabilitaScrittura('dataNascita');
        $(".footerProfilo").hide();
    });
    /*Evento che cambia il colore del bordo inferiore e nasconde il paragrafo di errore quando viene modificato un campo
      all'interno del modal per la modifica della password in presenza di errore*/
    $(".campiPass").on('input',function(){
        $(".campiPass").removeClass("invalid");
        $(".pd").css("display", "none");
    });
    //Evento che resetta tutti i campi, le icone e il paragrafo di errore alla chiusura del modal per la modifica della password
    $('#myModalPass').on('hidden.bs.modal', function () {
        $(".campiPass").removeClass("invalid");
        $(this).find('form').trigger('reset');
        $("#err_password").text("").css("display", "none");
        //Reimposta le icone per mostrare e nascondere la password
        document.getElementById("vecchiaPass").type = "password";
        document.getElementById("eye1").className = "fa fa-eye iconaPassword";
        document.getElementById("nuovaPass").type = "password";
        document.getElementById("eye2").className = "fa fa-eye iconaPassword";
        document.getElementById("confNuovaPass").type = "password";
        document.getElementById("eye3").className = "fa fa-eye iconaPassword";
    });
    //Evento che resetta tutti i campi alla chiusura del modal per la ricerca degli utenti
    $('#modal-aggiungi-amico').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $(".listaUtenti").remove();
    });
    //Evento che rimuove il paragrafo di errore non appena viene modificato il campo alla creazione di una nuova playlist
    $("#inserisci-nomePlaylist").on('input',function(){
        $(".pd").css("display", "none");
    });
    //Evento che resetta tutti i campi e il paragrafo di errore alla chiusura del modal per la creazione di una nuova playlist
    $('#modal-crea-playlist').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $("#err_playlist").text("").css("display", "none");
    });
    //Evento che resetta il paragrafo di errore alla chiusura del modal per l'aggiunta di un brano ad una playlist
    $('#modal-aggiungi-APlaylist').on('hidden.bs.modal', function () {
        $("#err_aggiungiBrano").text("").css("display", "none");
    });
    //Evento che cancella le ricerche precedenti degli utenti quando viene svuotato il campo ricerca
    $("#inserisci-nomeUtente").on('input',function(){
        $(".listaUtenti").remove();
    });
    //Evento che cancella le ricerche precedenti dei brani quando viene svuotato il campo ricerca
    $("#barra-ricerca").on('input',function(){
        $(".listaRicerca").remove();
        $("#contenitore-lista-ricerca-brani").empty();
    });
    //Evento che cancella le ricerche precedenti degli album quando viene svuotato il campo ricerca
    $("#barra-ricerca").on('input',function(){
        $("#contenitore-lista-ricerca-album").empty();
    });
});
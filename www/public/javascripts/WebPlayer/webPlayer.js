var pannelloAttivo;//variabile che indica il pannello attualmente in riproduzione.
var nome=$("#pulsante-Logout").text();
var pannelloSecondario;//variabile dedicata a un pannello secondario da aprire
var seeking=false;//variabile che indica se una canzone è in riproduzione;
var listaOrigine;//vettore che contiene una copia della lista dei brani da riprodurre
var shuffleB=false;//variabile booleana che imposta la modalità di riproduzione "random"
var repeat=false;//variabile booleana che imposta la modalità di riproduzione "ripeti"
var audioElement = new Audio();// create the audio object// assign the audio file to its src
var indiceCorrente=0;//Indica la posizione del brano da riprodurre .L'indice verrà utilizzato nel vettore percorsi
var id; //Variabile che gestisce l'ID degli amici
var idBrano; //variabile che contiene l'id' del brano da riprodurre
var idPlaylist; //variabile che contiene l'id' della playlist selezionata
var idAlbum; //variabile che contiene l'id' dell'album selezionato
var playListAvviata=false;//variabile che idica la riproduzione di una playlist
var idPlaylistAvviata;//variabile che indica l'id della playlist in ascolto
var idPlaystTarget// variabile che indica la playlist a cui vogliamo aggiungere la canzone selezionata;
var block = false;
var percorsi;//vettore che contiene una copia della lista dei brani da riprodurre soggetta a shuffle
var tastoAttivo;//tasto che indica il pulsante attivo
var idPlaylistSelezionato;//indica l'id della playlist selezionata

//Funzione che mostra le password nascoste
function mostraPass(id, id2){
    var x = document.getElementById(id);
    var y = document.getElementById(id2);
    if (x.type === "password") {
        x.type = "text";
        y.className = "fa fa-eye-slash iconaPassword";
    } else {
        x.type = "password";
        y.className = "fa fa-eye iconaPassword";
    }
}

//Funzione che rende modificabili i campi del form
function abilitaScrittura(id){
    document.getElementById(id).readOnly = false;
}

//Funzione che disabilita la modifica dei campi del form
function disabilitaScrittura(id){
    document.getElementById(id).readOnly = true;
}

//Funzione che mostra il footer del modal profilo quando un campo viene modificato
$(document).ready(function() {
$(".campi").on('input',function() {
    $(".modal-footer").show("display");
    });
});


//Funzione che mostra il div contenente gli utenti da aggiungere che corrispondono ai dati inseriti nel form
$(document).ready(function(){
    $(".campoNomeUtente").on('input',function(){
        $(".container-listaUtenti").show();
    });
});


//Funzione che gestisce la sovrapposizione dei modal
$(document).ready(function () {
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
});


//Funzione che permette di aprire il pannello-Ricerca
function mostraPannelloRicerca(){
    if(pannelloAttivo!=null){
        pannelloAttivo.hide();
    }
    $("#pannello-Ricerca").show();
    tastoAttivo.removeClass("activeButton");
    pannelloAttivo= $("#pannello-Ricerca");

    //Evento che svuota la ricerca quando clicchiamo fuori dalla barra di ricerca o dal pannello ricerca
    $(document).mouseup(function (e) {
        try {
            if (( !($(".navbar-dark").is(e.target) || $("#pannello-Ricerca").is(e.target))) // if the target of the click isn't the container...
                && ($(".navbar-dark").has(e.target).length === 0) && ($("#pannello-Ricerca").has(e.target).length === 0))// ... nor a descendant of the container
            {
                $("#barra-ricerca").val("");
            }
        }catch(ex){
            console.log();
        }
    });
//Evento che permette di svuotare la barra di ricerca quando si clicca un album ricercato
    $(document).mouseup(function (e) {
        try {
            if ( $(".flex-item-img").is(e.target))  // if the target of the click isn't the container...
            {
                $("#barra-ricerca").val("");
            }
        }catch(ex){
            console.log();
        }
    });

}


//Funzione che permette di aprire il pannello-Brani in riproduzione{
function mostraPannelloBrani(){
    if(pannelloAttivo!=null){
        pannelloAttivo.hide();
    }
    $("#pannello-BraniRiproduzione").show();
    pannelloAttivo= $("#pannello-BraniRiproduzione");
    tastoAttivo.removeClass("activeButton");
    tastoAttivo=$(".pulsanteA-brani");
    tastoAttivo.addClass("activeButton");
    stampaBraniInRiproduzione();
}



//Funzione che permette di aprire il pannello-amicizie
function mostraPannelloAmicizie(){
    if(pannelloAttivo!=null){
        pannelloAttivo.hide();
    }
    $("#pannello-Amicizie").show();
    pannelloAttivo= $("#pannello-Amicizie");
    tastoAttivo.removeClass("activeButton");
    tastoAttivo=$(".pulsanteGestioneAmicizie");
    tastoAttivo.addClass("activeButton");

}


//Funzione che permette di aprire il pannello-Album
function mostraPannelloAlbum(){
    if(pannelloAttivo!=null){
        pannelloAttivo.hide();
    }
    $("#pannello-Album").show();
    $("#contenitore-canzoni-album").hide();
    $(".flex-container-Album").css("height", "100%");
    pannelloAttivo= $("#pannello-Album");
    tastoAttivo.removeClass("activeButton");
    tastoAttivo=$(".pulsanteA-album");
    tastoAttivo.addClass("activeButton");

}

//Funzione che permette di aprire il pannello degli amici online
function mostraPannelloAmicizieMobile(){
    if(pannelloAttivo!=null){
        pannelloAttivo.hide();
    }
    $("#pannello-Amicizie-mobile").show();
    tastoAttivo.removeClass("activeButton");
    pannelloAttivo= $("#pannello-Amicizie-mobile");

}

//Funzione che permette di aprire e chiudere il pannello mobile
function mostraPannelloMobile(){
    if(pannelloSecondario==null) {
        $("#pannello-mobile").show(500);
        pannelloSecondario = $('#pannello-mobile');
    }else{
        pannelloSecondario.hide(500);
        pannelloSecondario=null;
    }
    //Evento che chiude il pannello-mobile quando si clicca fuori dal pannello secondario  o sul tasto altro oppure guando si clicca il bottone generi
    $(document).mouseup(function (e) {
        try {
            if ((!(pannelloSecondario.is(e.target)|| $("#altro").is(e.target)) && !$('.btn-mobile-generi').is(e.target) ) // if the target of the click isn't the container...
                && ( $("#altro").has(e.target).length === 0)) // ... nor a descendant of the container
            {
                pannelloSecondario.hide(500);
                pannelloSecondario=null;
            }
        }catch(ex){
            console.log();
        }
    });
}







//Funzione che permentte di aprire il pannello-playlist
function mostraPannelloPlaylist() {
    if (pannelloAttivo != null) {
        pannelloAttivo.hide();
    }
    $("#pannello-Playlist").show();
    $("#contenitore-canzoni-playlist").hide();
    $(".flex-container").css("height", "100%");
    tastoAttivo.removeClass("activeButton");
    tastoAttivo=$(".pulsanteA-playlist");
    tastoAttivo.addClass("activeButton");
    pannelloAttivo = $("#pannello-Playlist");
}



//Funzione che permentte di aprire il pannello-Genere
function mostraPannelloGenere(){
    if(pannelloAttivo!=null){
        pannelloAttivo.hide();
    }
    $("#pannello-Generi").show();
    pannelloAttivo=$("#pannello-Generi");
    tastoAttivo.removeClass("activeButton");
    tastoAttivo=$(".pulsanteA-generi");
    tastoAttivo.addClass("activeButton");

}

/*funzione che fa comparire il pulsante logout*/
function mostraTastoLogout() {
    if (!block) {
        block = true;
        $(this).html("<i class=\'fa fa-sign-out\'></i> Logout");
        $(this).stop(true, true).animate({
            width: '100%'
        });
        block = false;
    }
}
/*funzione che fa scomparire il pulsante logout*/
function nascondiTastologout() {
    if (!block) {
        block = true;
        $(this).html("<i class=\'fa fa-sign-out\'></i>");
        $(this).stop(true, true).animate({
            width: '35%'
        });
        block = false;
    }
}
/*funzione che contralla i pannelli da aprire in base alla dimensione della pagina*/
function setDivVisibility(){
    if (($(window).width()) > '768'){
        try {
            if (pannelloSecondario.is(":visible")) {
                pannelloSecondario.hide();
            }
        }catch (e) {

        }
        $('#menu-orizzontale').css('display','none');
        if( $(pannelloAttivo).attr("id") === "pannello-Amicizie-mobile") mostraPannelloAlbum();
        $('#colonna-destra,#colonna-sinistra').css('display','block');


    } else {
        $('#menu-orizzontale').css('display','block');
        $('#colonna-destra,#colonna-sinistra').css('display','none');

    }
}

/*funzione che inizializza la pagina al caricamento*/
    function loadPagina() {
        pannelloAttivo = $("#pannello-Album");
        $("#pannello-Album").show();
        $("#contenitore-canzoni-album").hide();
        tastoAttivo=$(".pulsanteA-album");
        tastoAttivo.addClass("activeButton");
        if (($(window).width()) > '768') {
            $('#colonna-destra').css('display', 'block');
            $('#colonna-sinistra').css('display', 'block');

        } else {
            $('#menu-orizzontale').css('display', 'block');
        }
        $("#volume-range").slider({value: 50});
        disabilitaPlayer();
    }
//Funzione che disabilita lo slider del player e del volume
    function disabilitaPlayer(){
        $("#barraDiAvanzamento").slider('disable');
        $("#volume-range").slider("disable");
    }
    //Funzione che abilita i tasti play pause e gli slider del player e del volume
    function abilitaPlayer(){
        $("#barraDiAvanzamento").slider('enable');
        $("#volume-range").slider("enable");
        $("#play").click(avviaBrano); //Evento che invoca la funzione per riprodurre il brano
        $('#pause').click(stoppaBrano); //Evento che invoca la funzione per mettere in pausa il brano
    }
    //funzione che disabilita lo shuffle quando è attivo
    function disabilitaShuffle(){
        if(shuffleB==true){
            shuffleBrani();
        }
    }
//Funzione che ritorna l'indice del brano in riproduzione del vettore Percorsi(Copia dei brani in riproduzione soggetta a shuffle)
    function calcolaIndiceShufflePercorsi(){
        var ind=0;
        for(i=0;i<percorsi.length;i++){
            if(listaOrigine[idBrano].idBrano==percorsi[i].idBrano){
                ind=i;
                break;
            }
        }
        return ind;
    }
//Funzione che ritorna l'indice del brano in riproduzione del vettore ListaOrigine(Copia dei brani in riproduzione non soggetta a shuffle)
function calcolaIndiceShuffleOrigine(){
    var ind=0;
    for(i=0;i<percorsi.length;i++){
        if(listaOrigine[i].idBrano==percorsi[indiceCorrente].idBrano){
            ind=i;
            break;
        }
    }
    return ind;
}



$(document).ready(function(){
    //Funzione che cambia il colore del bordo inferiore quando viene modificato un campo all'interno del modal per la
    // modifica dei dati dell'account
    $(".campi").on('input',function(){
        $(".campi").removeClass("invalid");
        $(".pd").css("display", "none");
    });
    //Funzione che resetta tutti i campi alla chiusura del modal per la modifica dei dati utente
    $('#myModal').on('hidden.bs.modal', function () {
        $(".campi").removeClass("invalid");
        $(this).find('form').trigger('reset');
        $("#err_account").text("").css("display", "none");
        disabilitaScrittura('nome');
        disabilitaScrittura('cognome');
        disabilitaScrittura('dataNascita');
        $(".footerProfilo").hide();
    });
    //Funzione che cambia il colore del bordo inferiore quando viene modificato un campo all'interno del modal per la
    // modifica della password
    $(".campiPass").on('input',function(){
        $(".campiPass").removeClass("invalid");
        $(".pd").css("display", "none");
    });
    //Funzione che resetta tutti i campi alla chiusura del modal per la modifica della password
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
    //Funzione che resetta tutti i campi alla chiusura del modal per la ricerca degli utenti
    $('#modal-aggiungi-amico').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $(".listaUtenti").remove();
    });
    //Funzione che rimuove il paragrafo di errore alla creazione di una nuova playlist
    $("#inserisci-nomePlaylist").on('input',function(){
        $(".pd").css("display", "none");
    });
    //Funzione che resetta tutti i campi e il paragrafo di errore alla chiusura del modal per la creazione di una nuova playlist
    $('#modal-crea-playlist').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $("#err_playlist").text("").css("display", "none");
    });
    //Funzione che resetta il paragrafo di errore alla chiusura del modal per l'aggiunta di un brano ad una playlist
    $('#modal-aggiungi-APlaylist').on('hidden.bs.modal', function () {
        $("#err_aggiungiBrano").text("").css("display", "none");
    });
});

//Funzione che recupera l'ID utente dalla lista degli amici per poter effettuare l'eliminazione e comunicarla al database
function recuperaIDElimina(evento) {
    id = evento.target.id.substring(13);
};
//Funzione che recupera l'ID utente dalla lista degli amici per poter effettuare l'aggiunta e comunicarla al database
function recuperaIDAggiungi(evento) {
    id = evento.target.id.substring(14);
};

//Funzione che recupera l'id del brano della lista per comunicarlo al server e riprodurlo o rimuoverlo dalla playlist
function recuperaIDBrano(evento) {
    idBrano = evento.target.id.substring(10);
};

//Funzione che recupera l'id della playlist per richiedere i brani ad essa appartenenti
function recuperaIDPlaylist(evento) {
    idPlaylist = evento.target.id.substring(8);
}
//Funzione che recupera l'id della playlist per richiedere i brani ad essa appartenenti
function recuperaIDAlbum(evento) {
    idAlbum = evento.target.id.substring(7);
}

//Funzione che cancella le ricerche precedenti degli utenti quando viene svuotato il campo ricerca
$(document).ready(function(){
    $("#inserisci-nomeUtente").on('input',function(){
        $(".listaUtenti").remove();
    });
});
//Funzione che cancella le ricerche precedenti dei brani quando viene svuotato il campo ricerca
$(document).ready(function(){
    $("#barra-ricerca").on('input',function(){
        $(".listaRicerca").remove();
        $("#contenitore-lista-ricerca-brani").empty();
    });
});
//Funzione che cancella le ricerche precedenti degli album quando viene svuotato il campo ricerca
$(document).ready(function(){
    $("#barra-ricerca").on('input',function(){
        $("#contenitore-lista-ricerca-album").empty();
    });
});

//Funzione che rimuove un elemento da un array e ne elimina la cella
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/*funzione che ritorna il vettore passato con gli elementi disordinati;
*@param array
*@returns array disordinato
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }


    return array;
}


//Funzione che converte i secondi in formato mm:ss
function toMinutes(secondi) {
    var minutes = "0" + Math.floor(secondi/ 60);
    var seconds = "0" + Math.floor(secondi % 60);
    var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
    return dur;
}

//Funzione che permette di avviare riproduzione del brano
function avviaBrano() {
        seeking = true;
        audioElement.play();
        $('#play').hide();
        $('#pause').show();
        $('#brano-ripr'+calcolaIndiceShuffleOrigine()).removeClass('fa-play').addClass('fa-pause');
}

//Funzione che permette di mettere in pausa il brano
function stoppaBrano() {
    seeking = false;
    audioElement.pause();
    $('#pause').hide();
    $('#play').show();
    $('#brano-ripr'+calcolaIndiceShuffleOrigine()).removeClass('fa-pause').addClass('fa-play');
}

//Funzione che determina il brano successivo in base alla modalità di riproduzione
function verificaBranoSuccessivo() {
    if (repeat == false && indiceCorrente == (percorsi.length - 1)) {
        seeking = false;
        stoppaBrano();
    } else {
        stoppaBrano();
        indiceCorrente=(++indiceCorrente) % percorsi.length;
        streamingBrano(percorsi[indiceCorrente].url_brano);
    }
}
//Funzione che aggiorna il campo secondo attualmente in riproduzione e aggiorna la barra di avanzamento del player
function refresh() {
    var avanzamento = ((audioElement.currentTime / audioElement.duration) * 100);
    var minutes = "0" + Math.floor(audioElement.currentTime / 60);
    var seconds = "0" + Math.floor(audioElement.currentTime - minutes * 60);
    var dur2 = minutes.substr(-2) + ":" + seconds.substr(-2);
    $("#labelSecondoAttuale").text(dur2);
    $("#barraDiAvanzamento").slider("setValue", avanzamento);
}
//Funzione che determina il brano successivo da riprodurre
function branoSuccessivo() {
    if(percorsi!=null) {
        if ((indiceCorrente != percorsi.length - 1 && repeat == false) || repeat == true) {
            stampaBraniInRiproduzione();
            $('#brano-ripr'+calcolaIndiceShuffleOrigine()).removeClass('fa-pause').addClass('fa-play');
            indiceCorrente = ((++indiceCorrente) + percorsi.length) % percorsi.length;
            if (seeking == true) {
                streamingBrano(percorsi[indiceCorrente].url_brano);
            } else {
                streamingBrano(percorsi[indiceCorrente].url_brano);
                stoppaBrano();
            }
        }
    }
}
//Funzione che determina il brano precedente da riprodurre
function branoPrecedente() {
    if(percorsi!=null) {
        if (audioElement.currentTime < 3) {//se il brano è stato avviato da più di tre secondi
            if ((indiceCorrente > 0 && repeat == false) || repeat == true) {
                stoppaBrano();
                $('#brano-ripr'+indiceCorrente).removeClass('fa-pause').addClass('fa-play');
                indiceCorrente = ((--indiceCorrente) + percorsi.length) % percorsi.length;//prendo il valore assoluto
                streamingBrano(percorsi[indiceCorrente].url_brano);
                $('#brano-ripr'+indiceCorrente).removeClass('fa-play').addClass('fa-pause');
            }
        } else {
            audioElement.currentTime = 0;
        }
    }
}
//Funzione che effettua lo shuffle del vettore lista brani
function shuffleBrani() {
    if(percorsi!=null) {
        if (shuffleB == false) {
            jQuery('#random').addClass('active');
            shuffleB = true;
            percorsi = shuffle(percorsi);
        } else {
            shuffleB = false;
            jQuery('#random').removeClass('active');
            percorsi = JSON.parse(JSON.stringify(listaOrigine));

        }

    }
}
//Funzione che permette di riprodurre i brani in loop
function ripetizione() {
    if(percorsi!=null) {
        if (repeat == false) {
            jQuery('#repeat').addClass('active');
            repeat = true;
        } else {
            repeat = false;
            jQuery('#repeat').removeClass('active');
        }
    }
}
//Funzione che aggiorna i dati(titolo, durata totale)della conza in riproduzione
function aggiornaPlayer() {
    var durata = toMinutes(percorsi[indiceCorrente].durata);
    $("#labelDurataTotaleBrano").text(durata);
    $("#titolo-brano-in-riproduzione").text(percorsi[indiceCorrente].titolo +" - "+percorsi[indiceCorrente].artista );
    $("#album2").attr("src", percorsi[indiceCorrente].url_cover);
}

//Funzione che inizializza il vettore dei percorsi e gestisce i dati del brano attualmente in riproduzione
function riproduciBrano() {
    if(listaOrigine != null && listaOrigine.length != 0) listaOrigine.remove(0, listaOrigine.length-1);//svuoto il vettore se è pieno
    if(percorsi != null && percorsi.length != 0) percorsi.remove(0, percorsi.length-1);//svuoto il vettore se è pieno
    listaOrigine = JSON.parse(JSON.stringify(listaBrani));//faccio una copia di lista brani in lista origine
    percorsi=JSON.parse(JSON.stringify(listaOrigine));//faccio una copia di lista origine in percorsi
    for (i = 0; i < listaBrani.length; i++) {// cerco l'id del brano da riprodurre
        if (listaBrani[i].idBrano == idBrano) {
            indiceCorrente=i;
        }
    }
    abilitaPlayer();//abilito il player
    streamingBrano(percorsi[indiceCorrente].url_brano);// mando in esecuzione la canzone



}
//Funzione che permette la riproduzione di un singlo brano;
function riproduciBranoSingolo() {
    if(listaOrigine != null && listaOrigine.length != 0) listaOrigine.remove(0, listaOrigine.length-1);// svuoto il vettore se è pieno
    if(percorsi != null && percorsi.length != 0) percorsi.remove(0, percorsi.length-1);// svuoto il vettore se è pieno
    percorsi=[];
    listaOrigine=[];

    for (i = 0; i < listaBrani.length; i++) {// cerco l'id del brano da riprodurre
        if (listaBrani[i].idBrano == idBrano) {
            listaOrigine.push(listaBrani[i]);// carico il brano nel vettore
            percorsi.push(listaBrani[i]);// carico il brano nel vettore
            break;
        }
    }
    indiceCorrente=0;
    abilitaPlayer();// abilito il player
    streamingBrano(percorsi[indiceCorrente].url_brano);//mando in esecuzione il brano
}

function cambiaDimensioniConteinerAlbum(){
    $(".flex-container-Album").css("height", "35%");//setto le nuove dimensioni del conteiner degli album
    $("#contenitore-canzoni-album").slideDown("slow");//faccio comparire la lista dei brani associati a quel album

}
function cambiaDimensioniConteinerPlaylist(){
    $(".flex-container").css("height", "35%");// setto le nuove dimensioni del conteiner delle playlist
    $("#contenitore-canzoni-playlist").slideDown("slow");// faccio comparire la lista dei brani associati alla playlist

}












//Funzioni che gestiscono la comunicazione con il server

/*Viene chiamata quando l'utente clicca su logout. La funzione avverte il server della richiesta e carica la
pagina di login*/
function logout(){
    $.get("/Logout", function(){
        window.location.href = '/';
    });
}


// Funzione che gestisce la modifica della password da parte dell'utente
function modificaPassword() {
    var password1 = $("input[name=pass1]");
    var password2 = $("input[name=pass2]");
    var password3 = $("input[name=pass3]");
    if(password1.val() == "") {
        $("#err_password").text("Inserisci la tua password attuale.").css("display", "block");
        password1.addClass("invalid");
    }
    else if(password2.val() == "") {
        $("#err_password").text("Inserisci la nuova password.").css("display", "block");
        password2.addClass("invalid");
    }
    else if(password3.val() == "") {
        $("#err_password").text("Conferma la nuova password.").css("display", "block");
        password3.addClass("invalid");
    }
    else {
        $.post("/WebPlayer/modificaPassword",
            {
                vecchiaPassword: password1.val(),
                nuovaPassword: password2.val(),
                confermaNuovaPassword: password3.val(),
            },
            function (result) {
                if (result == "ERR_1") {
                    $("#err_password").text("La password inserita non coincide con quella attualmente utilizzata.")
                        .css("display", "block");
                    password1.addClass("invalid");
                } else if (result == "ERR_2") {
                    $("#err_password").text("Inserisci una password diversa da quella attuale.").css("display", "block");
                    password2.addClass("invalid");
                } else if (result == "ERR_3") {
                    $("#err_password").text("La password deve rispettare il formato richiesto.").css("display", "block");
                    password2.addClass("invalid");
                } else if (result == "ERR_4") {
                    $("#err_password").text("Le password non coincidono.").css("display", "block");
                    password3.addClass("invalid");
                } else if (result == "OK") {
                    $("#err_password").text("").css("display", "none");
                    $("#modal-successoModPass").modal();
                    $('#myModalPass').modal('hide');
                }
            });
    }
}

// Funzione che gestisce la modifica dei dati dell'account
function modificaAccount() {
    var nome = $("input[name=nome]");
    var cognome = $("input[name=cognome]");
    var dataNascita = $("input[name=dataNascita]");
    if (nome.val() == "") {
        $("#err_account").text("Inserisci il tuo nome.").css("display", "block");
        nome.addClass("invalid");
    } else if (cognome.val() == "") {
        $("#err_account").text("Inserisci il tuo cognome.").css("display", "block");
        cognome.addClass("invalid");
    } else if (dataNascita.val() == "") {
        $("#err_account").text("Inserisci la tua data di nascita.").css("display", "block");
        dataNascita.addClass("invalid");
    } else {
        $.post("/WebPlayer/modificaAccount",
            {
                nome: nome.val(),
                cognome: cognome.val(),
                dataNascita: dataNascita.val(),
            },
            function (result) {
                if (result == "ERR_1") {
                    $("#err_account").text("Errore nella comunicazione con il database.").css("display", "block");
                } else if (result == "ERR_2") { // La password non rispetta il formato richiesto
                    $("#err_account").text("Il nome deve contenere da due a quindici caratteri, iniziare con una lettera maiuscola" +
                        " ed essere seguito da lettere minuscole. Non può contenere numeri o simboli.").css("display", "block");
                    nome.addClass("invalid");
                } else if (result == "ERR_3") { // La password non rispetta il formato richiesto
                    $("#err_account").text("Il cognome deve contenere da due a quindici caratteri, iniziare con una lettera maiuscola" +
                        " ed essere seguito da lettere minuscole. Non può contenere numeri o simboli.").css("display", "block");
                    cognome.addClass("invalid");
                } else if (result == "OK") {
                    $("#err_account").text("").css("display", "none");
                    $("#footerModalAccount").css("display", "none");
                    disabilitaScrittura('nome');
                    disabilitaScrittura('cognome');
                    disabilitaScrittura('dataNascita');
                    $("#modal-successoModDatiAccount").modal();
                    $('#myModal').modal('hide');
                }
            });
    }
}

//Funzione che gestisce l'eliminazione di un amico da parte dell'utente
function eliminaAmico() {
    $.post("/WebPlayer/amici/eliminaAmico",
        {
            idAmico: id
        }, function(result) {
            if(result == "OK") {
                    var idListItem = "amico" + id;
                    $("#" + idListItem).remove(); //Elimina la riga della lista amici
                    for(i=0; i<listaAmici.length; i++) {
                        if(listaAmici[i].idUtente == id) {
                            listaAmici.remove(i);
                        }
                    }
            }
        });
}

//Funzione che gestisce l'aggiunta di un amico da parte dell'utente
function aggiungiAmico() {
    $.post("/WebPlayer/amici/aggiungiAmico",
        {
            idAmico: id
        });
    $(".listaAmici").remove();
    for(i=0; i<listaUtenti.length; i++) {
        if(listaUtenti[i].idUtente == id) {
            listaAmici.push(listaUtenti[i]);
        }
    }
    listaUtenti.remove(0, listaUtenti.length-1);
    stampaListaAmici(listaAmici);
    $("#modal-aggiungi-amico").find('form').trigger('reset');
    $(".listaUtenti").remove();
}

//Funzione che gestisce la ricerca dei brani in base al genere da parte dell'utente
function richiediBraniPerGenere() {
    //Cattura l'evento dei tasti Genere in modalità desktop
    $(".dropdown-item-desktop").click(function(evento) {
        var genere=evento.target.id.substring(6);
        $.post("/WebPlayer/musica/genere",
            {
                genere: genere
            }, function(result) {
                $("#nomeGenere").html("Genere: " + genere);
                if(result != "ERR") {
                    listaBrani.remove(0, listaBrani.length-1);
                    $(".listaGenere").remove();
                    var lb = JSON.parse(result);
                    for(i=0; i<lb.length; i++) //Aggiungiamo gli amici online dell'utente che ha loggato nel vettore apposito
                        listaBrani[i] = new Brano(lb[i]);
                    stampaListaBraniPerGenere(listaBrani);
                }
                else {
                    if(listaBrani.length != 0) listaBrani.remove(0, listaBrani.length-1);
                    $(".listaGenere").remove();
                }
        });
    });

    //Cattura l'evento dei tasti Genere in modalità mobile
    $(".dropdown-item-mobile").click(function(evento) {
        var genere=evento.target.id.substring(13);
        $.post("/WebPlayer/musica/genere",
            {
                genere: genere
            }, function(result) {
                $("#nomeGenere").html("Genere: " + genere);
                if(result != "ERR") {
                    listaBrani.remove(0, listaAmiciOnline.length-1);
                    $(".listaGenere").remove();
                    var lb = JSON.parse(result);
                    for(i=0; i<lb.length; i++) //Aggiungiamo gli amici online dell'utente che ha loggato nel vettore apposito
                        listaBrani[i] = new Brano(lb[i]);
                    stampaListaBraniPerGenere(listaBrani);
                }
                else {
                    if(listaBrani.length != 0) listaBrani.remove(0, listaBrani.length-1);
                    $(".listaGenere").remove();
                }
            });
    });
}

//Funzione che richiede lo streaming del brano e lo carica
function streamingBrano(urlBrano) {
    audioElement.src = "riproduciBrano/" + urlBrano; //Richiesta al server per lo streaming di un brano
    audioElement.load();
    avviaBrano(); //Mette in riproduzione il brano richiesto
    comunicaBranoInAscolto();
}

//Funzione che imposta la canzone in ascolto dall'utente per mostrarla agli amici
function comunicaBranoInAscolto() {
    $.post("/WebPlayer/ascolta",
        {
            branoInAscolto: percorsi[indiceCorrente].titolo
        }, function(result){
        });
}

//Funzione che gestisce la creazione di una nuova playlist da parte dell'utente
function creaPlaylist() {
    var nomePlaylist = $("input[name=nome-playlist]");
    if(nomePlaylist.val() == "") {
        $("#err_playlist").text("Inserisci il nome della playlist che desideri creare.").css("display", "block");
        nomePlaylist.addClass("invalid");
        console.log(nomePlaylist.className());
    }
    else {
        $.post("/WebPlayer/playlist/creaPlaylist",
            {
                nomePlaylist: nomePlaylist.val(),
            },
            function (result) {
                if (result == "ERR_1") {
                    $("#err_playlist").text("Inserisci il nome della playlist che desideri creare.").css("display", "block");
                    nomePlaylist.addClass("invalid");
                } else if (result == "ERR_2") {
                    $("#err_playlist").text("Il nome della playlist può contenere da due a trenta caratteri, iniziare con una lettera " +
                    "e non può contenere spazi o simboli.").css("display", "block");
                    nomePlaylist.addClass("invalid");
                } else if (result == "ERR_3") {
                    $("#err_playlist").text("Hai già creato una playlist con lo stesso nome, inserisci un nome diverso.")
                        .css("display", "block");
                    nomePlaylist.addClass("invalid");
                } else {
                    $("#err_playlist").text("").css("display", "none");
                    var nuovaPlaylist = new Playlist(JSON.parse(result)[0]);
                    listaPlaylist.push(nuovaPlaylist);
                    $('#modal-crea-playlist').modal('hide');
                    stampaListaPlaylist(listaPlaylist);
                }
            });
    }
}

//Funzione che gestisce l'eliminazione di una playlist da parte dell'utente
function eliminaPlaylist() {
    $.post("/WebPlayer/playlist/eliminaPlaylist",
        {
            idPlaylist: idPlaylist
        }, function(result) {
            if(result == "OK") {
                    var idPlay = "playlist" + idPlaylist;
                    $("#" + idPlay).remove(); //Elimina il flex-item contenente la playlist da eliminare
                    $("#contenitore-canzoni-playlist").empty();
                    for(i=0; i<listaPlaylist.length; i++) {
                        if(listaPlaylist[i].idPlaylist == idPlaylist) {
                            listaPlaylist.remove(i);
                        }
                    }

            }

        });
}

//Funzione che richiede i brani di una specifica playlist
function richiediBraniPlaylist() {
    $.post("/WebPlayer/playlist/mostraBrani",
        {
            idPlaylist: idPlaylist
        }, function(result) {
        if (result != "ERR") {
            $("#contenitore-canzoni-playlist").empty();
            listaBrani.remove(0, listaBrani.length-1);
            var lb = JSON.parse(result);
            for (i = 0; i < lb.length; i++)
            listaBrani[i] = new Brano(lb[i]);
            for(i=0; i<listaPlaylist.length; i++){
                if(listaPlaylist[i].idPlaylist==idPlaylist){
                    $("#contenitore-canzoni-playlist").append('<div id="contenitore-paragrafo">' +
                        '<p class="paragrafo-playlist" style="font-size: calc(1rem + 1vw)">' +
                        'Playlist: '+ listaPlaylist[i].nome +'<i class="fa fa-trash icona-eliminaPlaylist" title="Elimina playlist"' +
                        'id="elimPlay'+ listaPlaylist[i].idPlaylist +'"data-toggle="modal" data-target="#modal-conferma-rimPlaylist"></i></p> </div>');
                }
            }
            stampaBraniPlaylist();
        }
        else{
            if(listaBrani.length != 0)
                listaBrani.remove(0, listaBrani.length-1);
            $("#contenitore-canzoni-playlist").empty();
            for(i=0; i<listaPlaylist.length; i++){
                if(listaPlaylist[i].idPlaylist==idPlaylist){
                    $("#contenitore-canzoni-playlist").append('<p class="paragrafo-playlist" style="font-size: calc(1rem + 1vw)">' +
                        'La playlist "'+ listaPlaylist[i].nome +'" è vuota. ' +
                        '<i class="fa fa-trash icona-eliminaPlaylist" ' +
                        'id="elimPlay'+ listaPlaylist[i].idPlaylist +'" data-toggle="modal" data-target="#modal-conferma-rimPlaylist"></i></p>');
                }
            }
        }
            $(".icona-eliminaPlaylist").click(function(evento) {
                    recuperaIDPlaylist(evento);
                    $("#tastoConfermaRimPlaylist").click(function () {
                        eliminaPlaylist();
                    });
            });
    });
}

//Funzione che richiede i brani di uno specifico album
function richiediBraniAlbum() {
    $.post("/WebPlayer/album/mostraBrani",
        {
            idAlbum: idAlbum
        }, function(result) {
            if (result != "ERR") {
                $("#contenitore-canzoni-album").empty();
                listaBrani.remove(0, listaBrani.length-1);
                var lb = JSON.parse(result);
                for (i = 0; i < lb.length; i++)
                    listaBrani[i] = new Brano(lb[i]);
                for(i=0; i<listaAlbum.length; i++){
                    if(listaAlbum[i].idAlbum==idAlbum){
                        $("#contenitore-canzoni-album").append('<div id="contenitore-paragrafo-Album">' +
                            '<p class="paragrafo-album">' +
                            '"' + listaAlbum[i].nome + '" - ' + listaAlbum[i].artista +'  ,  '+ listaAlbum[i].numeroBrani + ' brani</p>' +
                            '</div>');
                    }
                }
                stampaBraniAlbum();
            }
        });
}

//Funzione che richiede tutti i brani singoli
function richiediBraniSingoli() {
    $.get("/WebPlayer/album/mostraSingoli",
         function(result) {
            if (result != "ERR") {
                console.log("cio");
                $("#contenitore-canzoni-album").empty();
                listaBrani.remove(0, listaBrani.length-1);
                var lb = JSON.parse(result);
                for (i = 0; i < lb.length; i++)
                    listaBrani[i] = new Brano(lb[i]);
                $("#contenitore-canzoni-album").append('<div id="contenitore-paragrafo-Album">' +
                            '<p class="paragrafo-album"> Singoli </p>' +
                            '</div>');
                stampaBraniAlbum();
            }
        });
}

//Funzione che gestisce la rimozione di un brano da una playlist da parte dell'utente
function rimuoviBrano() {
    $.post("/WebPlayer/playlist/eliminaBrano",
        {
            idBrano: idBrano,
            idPlaylist: idPlaylist
        }, function(result) {
            if(result == "OK") {
                for(i=0; i<listaBrani.length; i++) {
                    if(listaBrani[i].idBrano == idBrano) {//cerco l'id del brano per rimuoverlo
                        listaBrani.remove(i);
                        //verifico che ci sia una playlist avviata e controllo se il brano da rimuovere è di quella playlist(Avviata)
                        if(percorsi!=null && playListAvviata==true && idPlaylistSelezionato==idPlaylistAvviata){
                            if(shuffleB==true){//verifico se la modalità shuffle è attiva
                                listaOrigine.remove(i);//rimuovo il brano da una copia dei brani in riproduzione non soggetta a shuffle
                                percorsi=JSON.parse(JSON.stringify(listaOrigine));// copio la copia dei brani nel vettore dei percorsi in riproduzione
                                percorsi=shuffle(percorsi);//effettuo lo shuffle
                            }else {//se la modalità shuffle non è attiva allora
                                percorsi.remove(i);//rimuovo da percorsi(lista dei brani in riproduzione che è soggetta a shuffle)
                                listaOrigine.remove(i);//rimuovo da lista origine(copia dei brani in riproduzione non soggetta a shuffle)
                            }
                        }
                    }
                }
                stampaBraniPlaylist();//aggiorno la lista dei brani delle playlist
            }
        });
}

//Funzione che gestisce l'aggiunta di un brano ad una playlist da parte dell'utente
function aggiungiBranoAPlaylist() {
    $.post("/WebPlayer/playlist/aggiungiBrano",
        {
            idBrano: idBrano,
            idPlaylist: idPlaylist
        }, function(result) {
            if(result == "ERR")
                $("#err_aggiungiBrano").text("La playlist selezionata contiene già questo brano.").css("display", "block");
            else if(result == "OK") {
                //verifico se è presente una playlist in esecuzione e verifico se il brano da aggiungere debba essere inserito nella playlist in esecuzione
                if(percorsi!=null && playListAvviata==true && idPlaylistAvviata==idPlaystTarget ){
                       for(i=0;i<listaBrani.length;i++){
                           if(listaBrani[i].idBrano==idBrano){//cerco l'id del brano
                               percorsi.push(listaBrani[i]);//inserisco il brano in coda
                               listaOrigine.push(listaBrani[i]);
                               break;
                           }

                       }
                }
                $("#err_aggiungiBrano").text("").css("display", "none");
                $('#modal-aggiungi-APlaylist').modal('hide');
            }
        });
}
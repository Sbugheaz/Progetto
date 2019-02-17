var pannelloAttivo;
var nome=$("#pulsante-Logout").text();
var pannelloSecondario;
var seeking=false;
var listaOrigine;
var shuffleB=false;
var repeat=false;
var audioElement = new Audio();// create the audio object// assign the audio file to its src
var percorsi;
var indiceCorrente=0;


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
$(document).ready(function(){
    $("#barra-ricerca").on('input',function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Ricerca").show();
        pannelloAttivo= $("#pannello-Ricerca");

    });
});
//Funzione che permette di aprire il pannello-Brani in riproduzione{
$(document).ready(function(){
    $(".pulsanteA-brani,.btn-mobile-brani").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-BraniRiproduzione").show();
        pannelloAttivo= $("#pannello-BraniRiproduzione");

    });
});

//Funzione che permette di aprire il pannello-amicizie
$(document).ready(function(){
    $(".pulsanteGestioneAmicizie,#gest-amicizie").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Amicizie").show();
        pannelloAttivo= $("#pannello-Amicizie");

    });
});
//Funzione che permette di aprire il pannello-Album
$(document).ready(function(){
    $(".pulsanteA-album,.btn-mobile-album").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Album").show();
        pannelloAttivo= $("#pannello-Album");

    });
});

//Funzione che permette di aprire il pannello degli amici online
$(document).ready(function(){
    $("#amici-online").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Amicizie-mobile").show();
        pannelloAttivo= $("#pannello-Amicizie-mobile");

    });
});

//Funzione che permette di aprire il pannello mobile
$(document).ready(function(){
    $("#altro").click(function(){
        $("#pannello-mobile").show(500);
        pannelloSecondario=$('#pannello-mobile');

    });
});



//Funzione che chiude il pannello-mobile
$(document).mouseup(function (e) {
    try {
        if (!pannelloSecondario.is(e.target) // if the target of the click isn't the container...
            && pannelloSecondario.has(e.target).length === 0) // ... nor a descendant of the container
        {
            pannelloSecondario.hide(500);
        }
    }catch(ex){
           console.log();
        }
});

//Funzione che permentte di aprire il pannello-playlist
$(document).ready(function(){
    $(".pulsanteA-playlist,.btn-mobile-playlist").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Playlist").show();
        pannelloAttivo=$("#pannello-Playlist");

    });
});
//Funzione che permentte di aprire il pannello-Genere
$(document).ready(function(){
    $("#tasto-Pop,#tasto-Classico,#tasto-Rock").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Generi").show();
        pannelloAttivo=$("#pannello-Generi");

    });
});

/*funzione che fa comparire e scomparire il pulsante logout*/
$(document).ready(function(){
    var block = false;
    $("#pulsante-Logout").mouseenter(function(){
    if(!block) {
        block = true;
        $(this).html("<i class=\'fa fa-sign-out\'></i> Logout");
        $(this).stop(true, true).animate({
            width: '100%'
        });
        block=false;
        }
    });

    $("#pulsante-Logout").mouseleave(function(){
        if(!block) {
            block = true;
            $(this).html("<i class=\'fa fa-sign-out\'></i>");
            $(this).stop(true,true).animate({
                width: '35%'
            });
            block = false;
        }

    });
});
/*funzione che contralla i pannelli da aprire in base alla dimensione della pagina*/
$(window).resize(setDivVisibility);
function setDivVisibility(){
    if (($(window).width()) > '768'){
        try {
            if (pannelloSecondario.is(":visible")) {
                pannelloSecondario.hide();
            }
        }catch (e) {

        }
        $('#menu-orizzontale,#pannello-Amicizie-mobile').css('display','none');
        $('#colonna-destra,#colonna-sinistra').css('display','block');


    } else {
        $('#menu-orizzontale').css('display','block');
        $('#colonna-destra,#colonna-sinistra').css('display','none');

    }
}

/*funzione che inizializza la pagina al caricamento*/
$(window).on('load', function () {
    pannelloAttivo=$("#pannello-BraniRiproduzione");
    $("#pannello-BraniRiproduzione").show();
    if (($(window).width()) > '768'){
        $('#colonna-destra').css('display','block');
        $('#colonna-sinistra').css('display','block');

    } else {
        $('#menu-orizzontale').css('display','block');
    }

        $("#volume-range").slider({
            value: 50
        });



});
/*funzioni del player*/
$(document).ready(function() {
    percorsi = ["songs/AC_DC_Back_In_Black.mp3", "songs/Luna-Los_Angeles.mp3", "songs/Horse-fart-sounds.mp3", "songs/IL_CIELO_NELLA_STANZA.mp3", "songs/90MIN.mp3"];
    listaOrigine = JSON.parse(JSON.stringify(percorsi));
    //$("#volume-range").slider();
    //$("#barraDiAvanzamento").slider();
    //audio.attr("src","songs/AC_DC_Back_In_Black.mp3");
    //audioElement.src = percorsi[indiceCorrente];

    /*audioElement.addEventListener('ended', function() {
         this.play();
     }, false);*/


    /*funzione che viene invocata quando una canzone finisce*/
    audioElement.addEventListener("ended", function () {
        if (repeat == false && indiceCorrente == (percorsi.length - 1)) {
            seeking = false;
            this.pause;
        } else {
            this.pause();
            audioElement.src = percorsi[(++indiceCorrente) % percorsi.length];
            this.play();
        }
    });
    /*
    funzione che calcola i minuti e secondi e titolo del brano
    audioElement.addEventListener("canplay",function(){
        var minutes = "0" + Math.floor(audioElement.duration / 60);
        var seconds = "0" + Math.floor(audioElement.duration % 60);
        var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
        $("#labelDurataTotaleBrano").text(dur);
        $("#titolo-brano-in-riproduzione").text(audioElement.src.substr(42));

    });
    */

    /* funzione che permette di aggiornare la barra di avanzamento */
    $(audioElement).on("timeupdate", refresh);

    /*funzione che permette di avviare la musica*/
    $('#play').click(avviaBrano);
    /*funzione che permette di stoppare la musica*/

    $('#pause').click(stoppaBrano);
    /*funzione che permette di passare al brano successivo*/
    $('#step-forward').click(branoSuccessivo);
    /*funzione che permette di passare al brano precedente*/
    $('#step-backward').click(branoPrecedente);
    /*funzione che permette fare lo shuffle delle canzoni*/
    $('#random').click(function () {
        if (shuffleB == false) {
            $("#random").css('color', '#5CA5FF');
            shuffleB = true;
            percorsi = shuffle(percorsi);
        } else {
            shuffleB = false;
            $("#random").css('color', 'cornsilk');
            percorsi = JSON.parse(JSON.stringify(listaOrigine));

        }
    });
    /*funzione che permette la ripetizione delle canzoni*/
    $('#repeat').click(function () {
        if (repeat == false) {
            $("#repeat").css('color', '#5CA5FF');
            repeat = true;
        } else {
            repeat = false;
            $("#repeat").css('color', 'cornsilk');


        }
    });
    /* funzione che permette di regolare il volume*/
    $("#volume-range").on("slide", function (slideEvt) {
        audioElement.volume = slideEvt.value / 100;
    });

    /* funzione che permette lo slide della barra di avanzamento*/
    $("#barraDiAvanzamento").on("change", function (slideEvt) {
        var slideVal = $("#barraDiAvanzamento").slider('getValue');
        var valoreattuale2 = ($("#barraDiAvanzamento").slider('getValue') * (audioElement.duration)) / 100;
        audioElement.currentTime = valoreattuale2;
    });

    function refresh() {
        var avanzamento = ((audioElement.currentTime / audioElement.duration) * 100);
        var minutes = "0" + Math.floor(audioElement.currentTime / 60);
        var seconds = "0" + Math.floor(audioElement.currentTime - minutes * 60);
        var dur2 = minutes.substr(-2) + ":" + seconds.substr(-2);
        $("#labelSecondoAttuale").text(dur2);
        $("#barraDiAvanzamento").slider("setValue", avanzamento);
    }

    function avviaBrano() {
        seeking = true;
        audioElement.play();
        $('#play').hide();
        $('#pause').show();
    }

    function stoppaBrano() {
        seeking = false;
        audioElement.pause()
        $('#pause').hide();
        $('#play').show();
    }

    function branoSuccessivo() {
        audioElement.src = percorsi[((++indiceCorrente) + percorsi.length) % percorsi.length];
        if (seeking == true) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    }

    function branoPrecedente() {
        if (audioElement.currentTime < 3) {
            indiceCorrente = ((--indiceCorrente) + percorsi.length) % percorsi.length;
            audioElement.src = percorsi[indiceCorrente];
            $('#pause').hide();
            $('#play').show();
        } else {
            audioElement.currentTime = 0;
        }
    }


});

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
    });
    $('#modal-aggiungi-amico').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $(".listaUtenti").remove();
    });
});

//Variabile che gestisce l'ID degli amici
var id;
//Funzione che recupera l'ID utente dalla lista degli amici per poter effettuare l'eliminazione e comunicarla al database
function recuperaIDElimina(evento) {
    id = evento.target.id.substring(13);
};
//Funzione che recupera l'ID utente dalla lista degli amici per poter effettuare l'aggiunta e comunicarla al database
function recuperaIDAggiungi(evento) {
    id = evento.target.id.substring(14);
};

var idBrano; //variabile che contiene l'id' del brano da riprodurre
//Funzione che recupera l'id del brano della lista per comunicarlo al server e riprodurlo
function recuperaIDBrano(evento) {
    idBrano = evento.target.id.substring(10);
};

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
                $("#tastoConfermaRim").click(function () {
                    var idListItem = "amico" + id;
                    $("#" + idListItem).remove(); //Elimina la riga della lista amici
                    for(i=0; i<listaAmici.length; i++) {
                        if(listaAmici[i].idUtente == id) {
                            listaAmici.remove(i);
                        }
                    }
                });
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
    $(".dropdown-item").click(function(evento) {
        var genere=evento.target.id.substring(6)
        $.post("/WebPlayer/musica/genere",
            {
                genere: genere
            }, function(result) {
                $("#nomeGenere").html("Genere: " + genere);
                if(result != "ERR") {
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

//Funzione che gestisce lo streaming del brano attualmente in riproduzione
function riproduciBrano() {
    var urlBrano;
    for (i = 0; i < listaBrani.length; i++) {
        if (listaBrani[i].idBrano == idBrano) {
            var durata = toMinutes(listaBrani[i].durata);
            $("#labelDurataTotaleBrano").text(durata);
            $("#titolo-brano-in-riproduzione").text(listaBrani[i].titolo);
            $("#album2").attr("src", listaBrani[i].url_cover);
            urlBrano = listaBrani[i].url_brano;
            indiceCorrente=i;
        }
        percorsi[i]=listaBrani[i].url_brano;
    }
    $.get("/WebPlayer/riproduciBrano/musica/0/Perdonami.mp3", {
        urlBrano: urlBrano
    }, function () {

        audioElement.src ="riproduciBrano/musica/0/Perdonami.mp3";
        audioElement.load();
        audioElement.play();
        seeking=true;
        $("#play").hide();
        $("#pause").show();

    });
}

//Funzione che converte i secondi in formato mm:ss
function toMinutes(secondi) {
    var minutes = "0" + Math.floor(secondi/ 60);
    var seconds = "0" + Math.floor(secondi % 60);
    var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
    return dur;
}
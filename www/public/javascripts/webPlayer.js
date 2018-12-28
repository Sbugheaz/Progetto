
var pannelloAttivo=null;
var nome=$("#pulsante-Logout").text();
var pannelloSecondario;



//funzione che mostra le password nascoste
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

//funzione che rende modificabili i campi dei form
function abilitaScrittura(id){
    document.getElementById(id).readOnly = false;
}

//funzione che mostra il footer del modal profilo quando un campo viene modificato
$(document).ready(function(){
$(".campi").on('input',function(){
    $(".modal-footer").show("display");
});
});

//funzione che mostra il div contenente gli utenti da aggiungere che corrispondono ai dati inseriti nel form
$(document).ready(function(){
    $(".campoNomeUtente").on('input',function(){
        $(".container-listaUtenti").show();
    });
});


//funzione che gestisce la sovrapposizione dei modal
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

//funzione che permette di aprire il pannello-amicizie
$(document).ready(function(){
    $(".pulsanteGestioneAmicizie,#gest-amicizie").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Amicizie").show();
        pannelloAttivo= $("#pannello-Amicizie");

    });
});
//funzione che permette di aprire il pannello degli amici online
$(document).ready(function(){
    $("#amici-online").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Amicizie-mobile").show();
        pannelloAttivo= $("#pannello-Amicizie-mobile");

    });
});
//funzione che permette di aprire il pannello mobile
$(document).ready(function(){
    $("#altro").click(function(){
        $("#pannello-mobile").show(500);
        pannelloSecondario=$('#pannello-mobile');

    });
});



//funzione che chiude il pannello-mobile
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


//funzione che permentte di aprire il pannello-playlist
$(document).ready(function(){
    $(".pulsanteA-playlist").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Playlist").show();
        pannelloAttivo=$("#pannello-Playlist");

    });
});



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


$(window).on('load', function () {
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


$(document).ready(function() {
    $("#volume-range").slider();
    $("#barraDiAvanzamento").slider();
    var audioElement = new Audio();        // create the audio object// assign the audio file to its src
    audioElement.src ='songs/AC_DC_Back_In_Black.mp3';
    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);

    audioElement.addEventListener("canplay",function(){
        var minutes = "0" + Math.floor(audioElement.duration / 60);
        var seconds = "0" + Math.floor(audioElement.duration % 60);
        var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
        $("#labelDurataTotaleBrano").text(dur);
        $("#titolo-brano-in-riproduzione").text(audioElement.src.substr(48));

    });

    audioElement.addEventListener("timeupdate",function(){
        var avanzamento= ((audioElement.currentTime/audioElement.duration)*100);
        var minutes = "0" + Math.floor(audioElement.currentTime/ 60);
        var seconds = "0" + Math.floor(audioElement.currentTime - minutes * 60);
        var dur2 = minutes.substr(-2) + ":" + seconds.substr(-2);
        $("#labelSecondoAttuale").text(dur2);

        $('#barraDiAvanzamento').slider({value: avanzamento})
        $('#barraDiAvanzamento').slider('refresh');


    });

    $('#play').click(function() {
        audioElement.play();
        $('#play').hide();
        $('#pause').show()

    });

    $('#pause').click(function() {
        audioElement.pause();
        $('#pause').hide();
        $('#play').show()

    });

    $('#repeat').click(function() {
        audioElement.currentTime = 0;
    });

    $("#volume-range").on("slide", function(slideEvt) {
            audioElement.volume=slideEvt.value/100;
    });

    $("#barraDiAvanzamento").on("slide", function(slideEvt) {
        var valoreattuale=((slideEvt.value)*(audioElement.duration))/100;
        audioElement.currentTime =valoreattuale;


    });

    $("#barraDiAvanzamento").on("change", function(slideEvt) {
        var slideVal=$("#barraDiAvanzamento").slider('getValue');

        console.log( (audioElement.duration *slideVal)/100);

        var valoreattuale2=($("#barraDiAvanzamento").slider('getValue')*(audioElement.duration))/100;
        audioElement.currentTime=valoreattuale2;


    });

});



//Funzioni che gestiscono la comunicazione con il server

/*Viene chiamata quando l'utente clicca su logout. La funzione avverte il server della richiesta e carica la
pagina di login*/
function logout(){
    $.get("/Logout", function(){
        window.location.href = '/';
    });
}


// Funzione per la modifica della password
function modificaPassword() {
    var password1 = $("input[name=pass1]").val();
    var password2 = $("input[name=pass2]").val();
    var password3 = $("input[name=pass3]").val();
    if(password1 == "")
        $("#err_password").text("Inserisci la tua password attuale.").css("display", "block");
    else if(password2 == "")
        $("#err_password").text("Inserisci la nuova password.").css("display", "block");
    else if(password3 == "")
        $("#err_password").text("Conferma la nuova password.").css("display", "block");
    else {
        $.post("/WebPlayer/modificaPassword",
            {
                vecchiaPassword: password1,
                nuovaPassword: password2,
                confermaNuovaPassword: password3,
            },
            function (result) {
                if (result == "ERR_1") {
                    $("#err_password").text("La password inserita non coincide con quella attualmente utilizzata.")
                        .css("display", "block");
                } else if (result == "ERR_2") {
                    $("#err_password").text("Inserisci una password diversa da quella attuale.").css("display", "block");
                } else if (result == "ERR_3") {
                    $("#err_password").text("La password deve rispettare il formato richiesto.").css("display", "block");
                } else if (result == "ERR_4") {
                    $("#err_password").text("Le password non coincidono.").css("display", "block");
                } else if (result == "OK") {
                    $("#err_password").text("").css("display", "none");
                    alert("Password modificata con successo!");
                }
            });
    }
}



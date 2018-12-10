
var pannelloAttivo=null;
var nome=$("#pulsante-Logout").text();

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


$(document).ready(function(){
    $(".PulsanteGestioneAmicizie").click(function(){
        if(pannelloAttivo!=null){
            pannelloAttivo.hide();
        }
        $("#pannello-Amicizie").show();
        pannelloAttivo= $("#pannello-Amicizie");

    });
});

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

    $("#pulsante-Logout").mouseenter(function(){
        var $containerWidth = $(window).width();

        if ($containerWidth >768) {
            $(this).html("<i class=\'fa fa-sign-out\'></i> Logout");
            $(this).animate({

                width: '100%'
            });
        }

    });
});

$(document).ready(function(){

    $("#pulsante-Logout").mouseleave(function(){
        $(this).html("<i class=\'fa fa-sign-out\'></i>");
        $(this).animate({

            width: '35%'
        });

    });
});

$(window).resize(setDivVisibility);
function setDivVisibility(){
    if (($(window).width()) > '768'){
        $('#menu-orizzontale').css('display','none');
    } else {
        $('#menu-orizzontale').css('display','block');
    }
}
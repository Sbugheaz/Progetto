
var pannelloAttivo=null;


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

//funzione che rende scrivibili i campi dei form
function abilitaScrittura(id){
    document.getElementById(id).readOnly = false;
}

$(document).ready(function(){
$(".pulsanteModifica").click(function(){
    $(".modal-footer").show();
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


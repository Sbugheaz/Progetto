
//funzione che mostra le password nascoste
function mostraPass(id){
    var x = document.getElementById(id);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
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
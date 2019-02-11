var utente;

$(document).ready(function () {
    $.get('/WebPlayer/utente', function(result){
        utente = new Account(JSON.parse(result));
        $(".nomeUtente").html("<br>" + utente.nomeUtente);
        $('#nome').attr("value",utente.nome);
        $('#cognome').attr("value",utente.cognome);
        $('#dataNascita').attr("value", utente.dataDiNascita.substring(0,10));
        $('#email').attr("value",utente.email);
    });
});

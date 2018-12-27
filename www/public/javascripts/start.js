var utente;





$(document).ready(function () {
    $.get('/WebPlayer/utente', function(result){
        var temp = JSON.parse(result);
        utente = new Account(temp);
        console.log(temp);
        $(".nomeUtente").html("<br>" + utente.nomeUtente);
        $('#nome').attr("value",utente.nome);
        $('#cognome').attr("value",utente.cognome);
        $('#dataNascita').attr("value", utente.dataDiNascita.substring(0,10));
        $('#email').attr("value",utente.email);
    });
});
//
var utente;

$.post('/WebPlayer/utente'), function(result){
    var temp = JSON.parse(result);
    utente = new Utente(temp);
    consol.log(utente);
}

function printDataUtente(){
    $('<div class="nomeUtente"><p><br>' + utente.nomeUtente + '</p></div>');
    $('#nome').attr("value",utente.nome);
    $('#cognome').attr("value",utente.cognome);
    $('#dataNascita').attr("value",utente.dataNascita);
    $('#email').attr("value",utente.email);
    $('#nome').attr("value",utente.Nome);
}

//dichiarazione degli oggetti
var utente, listaAmici;

//funzione eseguita al caricamento della pagina
$(document).ready(function () {

    //funzione che inizializza i dati dell'account estrapolandoli dall'oggetto JSON ricevuto dal server
    $.get('/WebPlayer/utente', function(result){
        utente = new Account(JSON.parse(result));
        $(".nomeUtente").html("<br>" + utente.nomeUtente);
        $('#nome').attr("value",utente.nome);
        $('#cognome').attr("value",utente.cognome);
        $('#dataNascita').attr("value", utente.dataDiNascita.substring(0,10));
        $('#email').attr("value",utente.email);
    });


    $.get('/WebPlayer/amici', function(result){
        var la=JSON.parse(result);
        for(i=0;la.length(); i++){
            listaAmici[i]=new Account(la[i])
        }
        console.log(listaAmici[0]);
        console.log(listaAmici[1]);

        /*
        $(".nomeUtente").html("<br>" + utente.nomeUtente);
        $('#nome').attr("value",utente.nome);
        $('#cognome').attr("value",utente.cognome);
        $('#dataNascita').attr("value", utente.dataDiNascita.substring(0,10));
        $('#email').attr("value",utente.email);
        */
    });

});


/**
 * Questo file js contiene tutte le funzioni principali che riguardano la pagina di login, incluse tutte le
 * funzioni che comunicano con il server per ricevere ed inviare dati.
 */

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


//Svuota i campi di input e rimuove gli errori alla chiusura del modal per il recupero della password
$('#myModal').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
    $("#err_recuperoPass").text("").css("display", "none");
});


//Rimuove i messaggi di errore all'inserimento delle credenziali d'accesso
$("#username").on('input',function(){
    $("#err_dati_accesso").css("display", "none");
});
$("#psw").on('input',function(){
    $("#err_dati_accesso").css("display", "none");
});


//Chiude i modal per il recupero della password quando l'utente clicca ok
$('#confermaRecupero').click(function () {
    $("#myModal").find('form').trigger('reset');
    $("#myModal").modal('toggle');
    $("#err_recuperoPass").text("").css("display", "none");
    $("input").find('form').trigger('reset');
});


//Funzione che verifica la formattazione dell'indirizzo e-mail nel campo per il recupero della password
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}






/**
 * Funzioni che gestiscono la comunicazione con il server.
 */
//Invia i dati inseriti nella pagina di login dall'utente al server e in caso siano corretti carica la pagina del web player
function login(){
    if($('input[name=username]').val() == "" || $('input[name=username]').val() == "")
        $("#err_dati_accesso").text("Inserisci nome utente e password per accedere.").css("display", "block");
    else {
        $.post("/Login",
            {
                nomeUtente: $('input[name=username]').val(),
                password: $('input[name=password]').val(),
            },
            function(result){
                if(result == "ERR_1")
                    $("#err_dati_accesso").text("Nome utente o password errati.").css("display", "block");
                else if(result == "ERR_2")
                    $("#modal-verifica-email").modal();
                else if(result == "OK")
                    window.location.href = '/WebPlayer';
            });
    }
}


/*Gestisce il recupero della password da parte dell'utente, se l'account è stato attivato il server manda una mail
contenente una password generata casualmente con la quale l'utente potrà successivamente effettuare l'accesso*/
function recuperoPassword(){
    if($("input[name=email]").val() == "")
        $("#err_recuperoPass").text("Inserisci il tuo indirizzo e-mail.").css("display", "block");
    else if(!validateEmail($('input[name=email]').val()))
        $("#err_recuperoPass").text("L'indirizzo e-mail deve rispettare il formato corretto.").css("display", "block");
    else {
        $.post("/RecuperoPassword",
            {
                email: $('input[name=email]').val(),
            },
            function (result) {
                if (result == "ERR_1")
                    $("#err_recuperoPass").text("Non esiste alcun account registrato con questo indirizzo e-mail al nostro sito.").css("display", "block");
                else if (result == "ERR_2")
                    $("#err_recuperoPass").text("Verifica la tua e-mail prima di provare a recuperare la password.").css("display", "block");
                else if (result == "OK") {
                    $("#err_recuperoPass").text("").css("display", "none");
                    $("#modal-invio-email").modal();
                }
            });
    }
}
//Invia i dati inseriti nella pagina di login dall'utente al server e in caso siano corretti carica la pagina webPlayer
function sendLogin(){
    $.post("/Login",
        {
            nomeUtente: $('input[name=username]').val(),
            password: $('input[name=password]').val(),
        },
        function(result){
            if(result == "ERR_1")
                $("#err_dati_accesso").text("Inserisci nome utente e password per accedere.").css("display", "block");
            else if(result == "ERR_2")
                $("#err_dati_accesso").text("Nome utente o password errati.").css("display", "block");
            else if(result == "ERR_3")
                $("#modal-verifica-email").modal();
            else if(result == "OK")
                window.location.href = '/WebPlayer';

        });
}

//Gestisce il recupero della password, inviando al server l'email.
function recuperoPassword(){
    $.post("/RecuperoPassword",
        {
            email: $('input[name=email]').val(),
        },
        function(result){
                 if(result == "ERR_1")
                $("#err_recuperoPass").text("Inserisci il tuo indirizzo e-mail.").css("display", "block");
            else if(result == "ERR_2")
                $("#err_recuperoPass").text("L'e-mail deve rispettare il formato corretto.").css("display", "block");
            else if(result == "ERR_3")
                $("#err_recuperoPass").text("Non esiste alcun account registrato con questa e-mail al nostro sito.").css("display", "block");
            else if(result == "ERR_4")
                $("#err_recuperoPass").text("Verifica la tua e-mail prima di provare a recuperare la password.").css("display", "block");
            else if(result == "OK"){
                     $("#modal-invio-email").modal();
            }
        });
}

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
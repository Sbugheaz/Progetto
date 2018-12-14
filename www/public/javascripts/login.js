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
                alert("Verifica la tua email per poter accedere alle funzionalità del nostro sito.");
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
                alert("A breve riceverai una mail contenente una password provvisoria con cui potrai accedere al nostro sito.");
                window.location.href = '/';
            }
        });
}
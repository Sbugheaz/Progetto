//Gestisce il form per la registrazione di un nuovo account

var nome = $("input[name=nome]");
var cognome = $("input[name=cognome]");
var data_nascita = $("input[name=data_nascita]");
var email1 = $("input[name=email]");
var email2 = $("input[name=email2]");
var nomeUtente = $("input[name=nomeUtente]");
var password1= $("input[name=password]");
var password2 = $("input[name=password2]");

//Questa funzione verifica se i campi del form sono validi
    function convalidaForm() {
        var flag = false;
                if(nome.val()  == "") {
                    nome.addClass("invalid");
                    $("#err_registrazione").text("Inserisci il tuo nome.").css("display", "block");
                }
                else if (!validateName(nome.val())) {
                    nome.addClass("invalid");
                    $("#err_registrazione").text("Il nome deve contenere almeno due caratteri, iniziare con una lettera maiuscola" +
                        " ed essere seguito da lettere minuscole. Non può contenere numeri o simboli.").css("display", "block");
                }
                else if(cognome.val() == "") {
                    cognome.addClass("invalid");
                    $("#err_registrazione").text("Inserisci il tuo cognome.").css("display", "block");
                }
                else if(!validateName(cognome.val())) {
                    cognome.addClass("invalid");
                    $("#err_registrazione").text("Il cognome deve contenere almeno due caratteri, iniziare con una lettera maiuscola" +
                        " ed essere seguito da lettere minuscole. Non può contenere numeri o simboli.").css("display", "block");
                }
                else if(data_nascita.val() == "") {
                    data_nascita.addClass("invalid");
                    $("#err_registrazione").text("Inserisci la tua data di nascita.").css("display", "block");
                }
                else if(email1.val() == "") {
                    email1.addClass("invalid");
                    $("#err_registrazione").text("Inserisci un indirizzo e-mail.").css("display", "block");
                }
                else if(!validateEmail(email1.val())) {
                    email1.addClass("invalid");
                    $("#err_registrazione").text("L'indirizzo e-mail deve rispettare il formato corretto, es: prova@esempio.it.").css("display", "block");
                }
                else if(email2.val() == "") {
                    email2.addClass("invalid");
                    $("#err_registrazione").text("Conferma il tuo indirizzo e-mail.").css("display", "block");
                }
                else if(email1.val() != email2.val()) {
                    email2.addClass("invalid");
                    $("#err_registrazione").text("Gli indirizzi e-mail non corrispondono.").css("display", "block");
                }
                else if(nomeUtente.val() == "") {
                    nomeUtente.addClass("invalid");
                    $("#err_registrazione").text("Inserisci un nome utente.").css("display", "block");
                }
                else if(!validateUsername(nomeUtente.val())) {
                    nomeUtente.addClass("invalid");
                    $("#err_registrazione").text("Il nome utente deve contenere almeno due caratteri, iniziare con una lettera " +
                    "e non può contenere spazi o simboli.").css("display", "block");
                }
                else if(password1.val() == "") {
                    password1.addClass("invalid");
                    $("#err_registrazione").text("Inserisci una password.").css("display", "block");
                }
                else if(!validatePassword(password1.val())) {
                    password1.addClass("invalid");
                    $("#err_registrazione").text("La password deve rispettare il formato richiesto.").css("display", "block");
                }
                else if(password2.val() == "") {
                password2.addClass("invalid");
                $("#err_registrazione").text("Conferma la tua password.").css("display", "block");
                }
                else if(password1.val() != password2.val()) {
                    password2.addClass("invalid");
                $("#err_registrazione").text("Le password non coincidono.").css("display", "block");
                }
                else
                    flag = true;
        return flag;
    }

    //funzione che cambia il colore del bordo inferiore da rosso a grigio quando viene modificato il campo
    $(document).ready(function(){
       $(".campi").on('input',function(){
           $(".campi").removeClass("invalid");
           $(".pd").css("display", "none");
       });
    });

    //Verifica la validità dei campi "E-mail" e "Conferma e-mail"
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //Verifica la validità dei campo "Nome" e "Cognome"
    function validateName(nome) {
    var testo = /^[A-Z][a-z]{1,12}(\s[A-Z][a-z]{1,12})*$/;
    return testo.test(String(nome));
}

    //Verifica la validità del campo "Nome utente"
    function validateUsername(nomeUtente) {
        var testo = /^[A-Za-z][A-Za-z0-9]{1,15}$/;
        return testo.test(String(nomeUtente));
    }

    //Verifica la validità dei campi "Password" e "Verifica password"
    function validatePassword(password) {
        var testo = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        return testo.test(String(password));
    }


//Funzioni che gestiscono la comunicazione con il server

function registrati() {
    if (convalidaForm()) {
        $.post("/Registrazione/registrati",
            {
                nome: nome.val(),
                cognome: cognome.val(),
                data_nascita: data_nascita.val(),
                sesso: $("input[name=sesso]:checked").val(),
                email: email1.val(),
                nomeUtente: nomeUtente.val(),
                password: password1.val(),
            },
            function (result) {
                if (result == "ERR_1") {
                    $("#err_registrazione").text("Impossibile proseguire, alcuni dei dati inseriti non rispettano il formato richiesto.")
                        .css("display", "block");
                }
                else if (result == "ERR_2") {
                    $("#err_registrazione").text("Esiste già un account registrato con questa e-mail, prova ad inserirne un'altra.")
                        .css("display", "block");
                }
                else if(result == "ERR_3") {
                    $("#err_registrazione").text("Il nome utente non è disponibile, prova ad inserirne un altro.")
                        .css("display", "block");
                }
                else if(result == "OK") {
                    $("#err_registrazione").text("").css("display", "none");
                    $("#modal-linkDiConferma").modal();
                }
            });
    }
}
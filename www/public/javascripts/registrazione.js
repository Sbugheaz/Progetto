//Gestisce il form per la registrazione di un nuovo account

    var currentTab = 0; //currentTab è settata ad essere il primo pannello (0)
    showTab(currentTab); //Mostra la currentTab

//Questa funzione mostra lo specifico pannello del form
    function showTab(n) {
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Registrati";
        } else {
            document.getElementById("nextBtn").innerHTML = "Avanti";
        }
        //... ed esegue una funzione che mostra il corretto cerchio indicatore del pannello:
        fixStepIndicator(n)
    }

    function nextPrev(n) {
        //Questa funzione calcola il pannello da mostrare
        var x = document.getElementsByClassName("tab");
        //Esce dalla funzione se qualsiasi campo non è valido
        if (n == 1 && !validateForm()) return false;
        //Nasconde il pannello corrente
        x[currentTab].style.display = "none";
        //Incrementa o decrementa la currentTab di 1:
        currentTab = currentTab + n;
        //Se si raggiunge la fine del form:
        if (currentTab >= x.length) {
            $("#nextBtn").click(registrati());
            return false;
        }
        //Altrimenti mostra la currentTab
        showTab(currentTab);
    }

    //Questa funzione verifica se i campi del form sono validi
    function validateForm() {
        var x, y, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[currentTab].getElementsByTagName("input");
        if(currentTab == 0) {
                if(y[0].value == "") {
                    y[0].className += " invalid";
                    $("#err_name").text("Inserisci il tuo nome.").css("display", "block");
                    valid = false;
                }
                else if (!validateName(y[0].value)) {
                    y[0].className += " invalid";
                    $("#err_name").text("Il nome deve contenere almeno due caratteri, iniziare con una lettera maiuscola" +
                        " ed essere seguito da lettere minuscole. Non può contenere cifre.").css("display", "block");
                    valid = false;
                }
                else if(y[1].value == "") {
                    y[1].className += " invalid";
                    $("#err_name").text("Inserisci il tuo cognome.").css("display", "block");
                    valid = false;
                }
                else if(!validateName(y[1].value)) {
                    y[1].className += " invalid";
                    $("#err_name").text("Il cognome deve contenere almeno due caratteri, iniziare con una lettera maiuscola" +
                        " ed essere seguito da lettere minuscole. Non può contenere cifre.").css("display", "block");
                    valid = false;
                }
                else {
                    $("#err_name").text("").css("display", "none");
                }
        }
        else if(currentTab == 1) {
                if(y[0].value == "") {
                    y[0].className += " invalid";
                    $("#err_email").text("Inserisci un'e-mail.").css("display", "block");
                    valid = false;
                }
                else if(!validateEmail(y[0].value)) {
                    y[0].className += " invalid";
                    $("#err_email").text("L'e-mail deve rispettare il formato corretto, es: prova@esempio.it.").css("display", "block");
                    valid = false;
                }
                else if(y[1].value == "") {
                    y[1].className += " invalid";
                    $("#err_email").text("Conferma la tua e-mail.").css("display", "block");
                    valid = false;
                }
                else if(y[0].value!=y[1].value) {
                    y[1].className += " invalid";
                    $("#err_email").text("Le e-mail non corrispondono.").css("display", "block");
                    valid = false;
                }
                else verificaUtilizzoEmail(y);
        }
        else if(currentTab == 2){
            if(y[0].value == "") {
                y[0].className += " invalid";
                $("#err_account").text("Inserisci un nome utente.").css("display", "block");
                valid = false;
            }
            else if(!validateUsername(y[0].value)) {
                y[0].className += " invalid";
                $("#err_account").text("Il nome utente deve contenere almeno due caratteri, iniziare con una lettera " +
                    "e non può contenere spazi.").css("display", "block");
                valid = false;
            }
            else if(y[1].value == "") {
                y[1].className += " invalid";
                $("#err_account").text("Inserisci una password.").css("display", "block");
                valid = false;
            }
            else if(!validatePassword(y[1].value)) {
                y[1].className += " invalid";
                $("#err_account").text("La password deve rispettare il formato richiesto.").css("display", "block");
                valid = false;
            }
            else if(y[2].value == "") {
                y[2].className += " invalid";
                $("#err_account").text("Conferma la tua password.").css("display", "block");
                valid = false;
            }
            else if(y[1].value != y[2].value) {
                y[2].className += " invalid";
                $("#err_account").text("Le password non coincidono.").css("display", "block");
                valid = false;
            }
            else verificaUtilizzoNomeUtente(y);
        }
        if (valid) {
            document.getElementsByClassName("step")[currentTab].className += " finish";
        }
        return valid;
    }

    function fixStepIndicator(n) {
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        x[n].className += " active";
    }


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

function verificaUtilizzoEmail(y) {
        $.post("/Registrazione/email",
            {
                email: $("input[name=email]").val(),
            },
            function (result) {
            if(result == "ERR_1") {
                y[0].className += " invalid";
                $("#err_email").text("L'e-mail deve rispettare il formato corretto, es: prova@esempio.it.").css("display", "block");
            }
            else if (result == "ERR_2") {
                y[0].className += " invalid";
                y[1].className += " invalid";
                $("#err_email").text("Esiste già un account registrato con questa e-mail, prova ad inserirne un'altra.")
                .css("display", "block");
            }
            else if(result == "OK") {
                $("#err_email").text("").css("display", "none");
            }
        });
    }


function verificaUtilizzoNomeUtente(y) {
        $.post("/Registrazione/nomeUtente",
            {
                nomeUtente: $("input[name=uname]").val(),
            },
            function (result) {
            if(result == "ERR_1") {
                y[0].className += " invalid";
                $("#err_account").text("Il nome utente deve contenere almeno due caratteri, iniziare con una lettera " +
                    "e non può contenere spazi.").css("display", "block");
            }
            else if (result == "ERR_2") {
                y[0].className += " invalid";
                $("#err_account").text("Il nome utente non è disponibile, prova ad inserirne un'altro.").css("display", "block");
            }
            else if (result == "OK") {
                $("#err_account").text("").css("display", "none");
            }
        });
}

function registrati() {
    $("#nextBtn").text("Ok");
    $("#prevBtn").css("display", "none");
    $("#registrazione_effettuata").css("display", "block");
    $("#nextBtn").click(window.location.href = '/');
}